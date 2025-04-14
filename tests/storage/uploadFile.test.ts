
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { storageUtils, FILE_SIZE_LIMIT, ALLOWED_MIME_TYPES } from '@/services/invoice/storage/storageUtils';
import { supabase } from '@/lib/supabaseClient';
import { toast } from "@/hooks/use-toast";

// Mock the supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn(),
        createSignedUrl: vi.fn()
      })
    }
  }
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

describe('uploadFile utility function', () => {
  const invoiceId = 'test-invoice-123';
  const bucketName = 'invoices';
  const filePath = `invoices/${invoiceId}/test.pdf`;
  
  // Create a mock PDF file (a simple Blob)
  const createMockPdf = (size = 1024) => {
    return new Blob([new ArrayBuffer(size)], { type: 'application/pdf' });
  };
  
  // Create a mock EXE file
  const createMockExe = () => {
    return new Blob([new ArrayBuffer(1024)], { type: 'application/x-msdownload' });
  };
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Setup default mock responses
    const uploadMock = vi.fn().mockResolvedValue({ error: null });
    const createSignedUrlMock = vi.fn().mockResolvedValue({
      data: { signedUrl: 'https://test-signed-url.com/test.pdf' }
    });
    
    const fromMock = vi.fn().mockReturnValue({
      upload: uploadMock,
      createSignedUrl: createSignedUrlMock
    });
    
    supabase.storage.from = fromMock;
  });
  
  it('should successfully upload a PDF file and return a valid URL', async () => {
    // Arrange
    const mockPdf = createMockPdf();
    
    // Act
    const result = await storageUtils.uploadFile(
      bucketName,
      filePath,
      mockPdf,
      'application/pdf'
    );
    
    // Assert
    expect(supabase.storage.from).toHaveBeenCalledWith(bucketName);
    expect(supabase.storage.from().upload).toHaveBeenCalledWith(
      filePath,
      mockPdf,
      {
        contentType: 'application/pdf',
        upsert: true
      }
    );
    expect(supabase.storage.from().createSignedUrl).toHaveBeenCalledWith(
      filePath,
      60 * 60 * 24 * 7 // 7 days
    );
    expect(result).toEqual({
      url: 'https://test-signed-url.com/test.pdf',
      path: filePath
    });
    expect(toast).not.toHaveBeenCalled();
  });
  
  it('should reject files with invalid MIME types', async () => {
    // Arrange
    const mockExe = createMockExe();
    
    // Act
    const result = await storageUtils.uploadFile(
      bucketName,
      filePath,
      mockExe,
      'application/x-msdownload'
    );
    
    // Assert
    expect(result).toBeNull();
    expect(supabase.storage.from().upload).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith({
      title: "Fehler",
      description: "Dateityp nicht unterstützt. Erlaubte Typen: PDF, XML, JSON",
      variant: "destructive"
    });
  });
  
  it('should reject files exceeding size limit', async () => {
    // Arrange
    const tooLargeFile = createMockPdf(FILE_SIZE_LIMIT + 1024); // Slightly larger than the limit
    
    // Act
    const result = await storageUtils.uploadFile(
      bucketName,
      filePath,
      tooLargeFile,
      'application/pdf'
    );
    
    // Assert
    expect(result).toBeNull();
    expect(supabase.storage.from().upload).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith({
      title: "Fehler",
      description: "Die Datei ist zu groß. Maximale Größe ist 10MB.",
      variant: "destructive"
    });
  });
  
  it('should handle upload errors gracefully', async () => {
    // Arrange
    const mockPdf = createMockPdf();
    
    // Setup the upload function to return an error
    supabase.storage.from().upload = vi.fn().mockResolvedValue({
      error: new Error('Storage error')
    });
    
    // Act
    const result = await storageUtils.uploadFile(
      bucketName,
      filePath,
      mockPdf,
      'application/pdf'
    );
    
    // Assert
    expect(result).toBeNull();
    expect(supabase.storage.from().upload).toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith({
      title: "Fehler",
      description: "Die Datei konnte nicht hochgeladen werden.",
      variant: "destructive"
    });
  });
  
  it('should handle server errors when creating signed URLs', async () => {
    // Arrange
    const mockPdf = createMockPdf();
    
    // Setup successful upload but failed URL creation
    supabase.storage.from().upload = vi.fn().mockResolvedValue({ error: null });
    supabase.storage.from().createSignedUrl = vi.fn().mockRejectedValue(new Error('Failed to create URL'));
    
    // Act
    const result = await storageUtils.uploadFile(
      bucketName,
      filePath,
      mockPdf,
      'application/pdf'
    );
    
    // Assert
    expect(result).toBeNull();
    expect(supabase.storage.from().upload).toHaveBeenCalled();
    expect(supabase.storage.from().createSignedUrl).toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith({
      title: "Fehler",
      description: "Die Datei konnte nicht hochgeladen werden.",
      variant: "destructive"
    });
  });
});
