
import React from 'react';
import { useValidationDashboard } from '@/hooks/use-validation-dashboard';
import { ValidationFilters } from './validation/ValidationFilters';
import { ValidationResultsTable } from './validation/ValidationResultsTable';
import { AuditLogModal } from './validation/AuditLogModal';

const ValidationDashboard = () => {
  const {
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
  } = useValidationDashboard();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Validierungs-Dashboard</h1>
      
      <ValidationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedValidationType={selectedValidationType}
        onValidationTypeChange={setSelectedValidationType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onReset={resetFilters}
      />
      
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <ValidationResultsTable
          results={validationResults}
          loading={loading}
          onViewAuditLog={handleViewAuditLog}
        />
      </div>
      
      <AuditLogModal
        open={auditLogModalOpen}
        onOpenChange={setAuditLogModalOpen}
        invoiceId={selectedInvoiceId}
        entries={auditLogEntries}
        loading={auditLogLoading}
      />
    </div>
  );
};

export default ValidationDashboard;
