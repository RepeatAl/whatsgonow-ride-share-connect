
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Check, X, Search, Calendar, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { validationService } from '@/services/invoice/validationService';
import { toast } from '@/hooks/use-toast';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

type ValidationResult = {
  validation_id: string;
  invoice_id: string;
  validation_type: string;
  passed: boolean;
  validation_date: string;
  error_messages: string[];
  warning_messages: string[];
};

type AuditLogEntry = {
  log_id: string;
  invoice_id: string;
  user_id: string;
  action: string;
  previous_state: any;
  new_state: any;
  timestamp: string;
  ip_address: string;
  user_agent: string;
};

const ValidationDashboard: React.FC = () => {
  const { user } = useAuth();
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValidationType, setSelectedValidationType] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // For the audit log modal
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [auditLogEntries, setAuditLogEntries] = useState<AuditLogEntry[]>([]);
  const [auditLogModalOpen, setAuditLogModalOpen] = useState(false);
  const [auditLogLoading, setAuditLogLoading] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast({
        title: "Zugriff verweigert",
        description: "Nur Administratoren haben Zugriff auf dieses Dashboard.",
        variant: "destructive",
      });
    }
  }, [user]);

  // Fetch validation results on load and when filters change
  useEffect(() => {
    if (user?.role !== 'admin') return;
    
    const fetchValidationResults = async () => {
      setLoading(true);
      
      const filters: any = {};
      if (selectedValidationType) filters.validationType = selectedValidationType;
      if (selectedStatus !== undefined) filters.passed = selectedStatus === 'passed';
      if (startDate) filters.startDate = startDate.toISOString();
      if (endDate) filters.endDate = endDate.toISOString();
      if (searchTerm) filters.invoiceId = searchTerm;
      
      const { data, error } = await validationService.getAllValidationResults(filters);
      
      if (error) {
        toast({
          title: "Fehler",
          description: "Validierungsergebnisse konnten nicht geladen werden.",
          variant: "destructive",
        });
      } else {
        setValidationResults(data || []);
      }
      
      setLoading(false);
    };
    
    fetchValidationResults();
  }, [user, selectedValidationType, selectedStatus, startDate, endDate, searchTerm]);

  // Handle opening the audit log modal
  const handleViewAuditLog = async (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setAuditLogModalOpen(true);
    setAuditLogLoading(true);
    
    const { data, error } = await validationService.getInvoiceAuditLog(invoiceId);
    
    if (error) {
      toast({
        title: "Fehler",
        description: "Audit-Log konnte nicht geladen werden.",
        variant: "destructive",
      });
    } else {
      setAuditLogEntries(data || []);
    }
    
    setAuditLogLoading(false);
  };

  // Handle filter reset
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedValidationType(undefined);
    setSelectedStatus(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Ungültiges Datum';
    }
  };

  // Render JSON diff in a readable format
  const renderJsonDiff = (prev: any, next: any) => {
    if (!prev || !next) return null;
    
    return (
      <div className="bg-gray-50 p-3 rounded-md mt-2 text-xs overflow-auto max-h-40">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-1">Vorheriger Status:</h4>
            <pre>{JSON.stringify(prev, null, 2)}</pre>
          </div>
          <div>
            <h4 className="font-medium mb-1">Neuer Status:</h4>
            <pre>{JSON.stringify(next, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h2 className="text-lg font-semibold">Zugriff verweigert</h2>
          <p>Sie haben keine Berechtigung, auf dieses Dashboard zuzugreifen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Validierungs-Dashboard</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rechnungs-ID</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Validierungstyp</label>
            <Select
              value={selectedValidationType}
              onValueChange={setSelectedValidationType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Alle Typen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital_signature">Digitale Signatur</SelectItem>
                <SelectItem value="xrechnung">XRechnung</SelectItem>
                <SelectItem value="gobd">GoBD</SelectItem>
                <SelectItem value="format">Format</SelectItem>
                <SelectItem value="tax">Steuer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Alle Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passed">Bestanden</SelectItem>
                <SelectItem value="failed">Nicht bestanden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Startdatum</label>
            <Popover open={showStartDatePicker} onOpenChange={setShowStartDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'dd.MM.yyyy') : 'Startdatum wählen'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setShowStartDatePicker(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Enddatum</label>
            <Popover open={showEndDatePicker} onOpenChange={setShowEndDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'dd.MM.yyyy') : 'Enddatum wählen'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    setShowEndDatePicker(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetFilters} className="mr-2">
            Filter zurücksetzen
          </Button>
        </div>
      </div>
      
      {/* Validation Results Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rechnungs-ID</TableHead>
              <TableHead>Validierungstyp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Warnungen</TableHead>
              <TableHead>Fehler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Lade Validierungsergebnisse...
                </TableCell>
              </TableRow>
            ) : validationResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Keine Validierungsergebnisse gefunden.
                </TableCell>
              </TableRow>
            ) : (
              validationResults.map((result) => (
                <TableRow key={result.validation_id}>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => handleViewAuditLog(result.invoice_id)}
                      className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                    >
                      {result.invoice_id.substring(0, 8)}...
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {result.validation_type === 'digital_signature' 
                        ? 'Digitale Signatur' 
                        : result.validation_type === 'xrechnung'
                        ? 'XRechnung'
                        : result.validation_type === 'gobd'
                        ? 'GoBD'
                        : result.validation_type === 'format'
                        ? 'Format'
                        : result.validation_type === 'tax'
                        ? 'Steuer'
                        : result.validation_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {result.passed ? (
                      <Badge className="bg-green-500 text-white flex items-center space-x-1 w-fit">
                        <Check className="h-3 w-3" />
                        <span>Bestanden</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500 text-white flex items-center space-x-1 w-fit">
                        <X className="h-3 w-3" />
                        <span>Nicht bestanden</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(result.validation_date)}</TableCell>
                  <TableCell>
                    {result.warning_messages && result.warning_messages.length > 0 ? (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {result.warning_messages.length}
                      </Badge>
                    ) : (
                      '0'
                    )}
                  </TableCell>
                  <TableCell>
                    {result.error_messages && result.error_messages.length > 0 ? (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                        {result.error_messages.length}
                      </Badge>
                    ) : (
                      '0'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Audit Log Modal */}
      <Dialog open={auditLogModalOpen} onOpenChange={setAuditLogModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Audit-Log für Rechnung</DialogTitle>
            <DialogDescription>
              Rechnungs-ID: {selectedInvoiceId}
            </DialogDescription>
          </DialogHeader>
          
          {auditLogLoading ? (
            <div className="py-8 text-center">Lade Audit-Log...</div>
          ) : auditLogEntries.length === 0 ? (
            <div className="py-8 text-center">Keine Audit-Log-Einträge gefunden.</div>
          ) : (
            <div className="max-h-[60vh] overflow-auto">
              {auditLogEntries.map((entry) => (
                <div key={entry.log_id} className="border-b border-gray-200 py-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{entry.action}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(entry.timestamp)}
                      </p>
                    </div>
                    <Badge variant="outline">
                      Benutzer: {entry.user_id ? entry.user_id.substring(0, 8) : 'System'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-600">
                      IP-Adresse: {entry.ip_address || 'Nicht verfügbar'}
                    </p>
                    
                    {(entry.previous_state || entry.new_state) && (
                      renderJsonDiff(entry.previous_state, entry.new_state)
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValidationDashboard;
