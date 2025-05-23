
// Mock für localStorage und sessionStorage in der Testumgebung
// Dies ermöglicht es uns, die Supabase-Authentifizierung in Tests zu verwenden

Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(() => null),
    removeItem: jest.fn(() => null),
    clear: jest.fn(() => null),
    key: jest.fn(() => null),
    length: 0
  },
  writable: true
});

Object.defineProperty(global, 'sessionStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(() => null),
    removeItem: jest.fn(() => null),
    clear: jest.fn(() => null),
    key: jest.fn(() => null),
    length: 0
  },
  writable: true
});

// Mocking window.URL.createObjectURL für File-Tests
Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn()
  },
  writable: true
});
