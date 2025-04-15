
import { useState, useEffect } from 'react';
import { validationService } from '@/services/invoice/validationService';
import { toast } from '@/hooks/use-toast';

export type ValidationResult = {
  validation_id: string;
  invoice_id: string;
  validation_type: string;
  passed: boolean;
  validation_date: string;
  error_messages: string[];
  warning_messages: string[];
};

export type AuditLogEntry = {
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

export function useValidationDashboard() {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValidationType, setSelectedValidationType] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [auditLogModalOpen, setAuditLogModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [auditLogEntries, setAuditLogEntries] = useState<AuditLogEntry[]>([]);
  const [auditLogLoading, setAuditLogLoading] = useState(false);

  useEffect(() => {
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
  }, [selectedValidationType, selectedStatus, startDate, endDate, searchTerm]);

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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedValidationType(undefined);
    setSelectedStatus(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return {
    validationResults,
    loading,
    searchTerm,
    setSearchTerm,
    selectedValidationType,
    setSelectedValidationType,
    selectedStatus,
    setSelectedStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    auditLogModalOpen,
    setAuditLogModalOpen,
    selectedInvoiceId,
    auditLogEntries,
    auditLogLoading,
    handleViewAuditLog,
    resetFilters
  };
}
