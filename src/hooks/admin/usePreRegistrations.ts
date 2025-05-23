import { useState, useEffect, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { PreRegistration } from "@/types/pre-registration";
import { toast } from "@/components/ui/use-toast";

export function usePreRegistrations() {
  const supabase = getSupabaseClient();
  const [allRegs, setAllRegs] = useState<PreRegistration[]>([]);
  const [filtered, setFiltered] = useState<PreRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDrivers, setFilterDrivers] = useState(false);
  const [filterCM, setFilterCM] = useState(false);
  const [filterSender, setFilterSender] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Data fetching
  const fetchRegs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pre_registrations")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(item => ({
        ...item,
        vehicle_types: typeof item.vehicle_types === 'string'
          ? JSON.parse(item.vehicle_types)
          : item.vehicle_types
      }));

      setAllRegs(formattedData);
    } catch (err) {
      console.error("Error fetching pre-registrations:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast({
        title: "Fehler",
        description: "Die Vorregistrierungen konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchRegs();
  }, [fetchRegs]);

  // Filter logic
  useEffect(() => {
    let result = [...allRegs];

    // Apply date filters
    if (startDate) {
      result = result.filter(reg =>
        new Date(reg.created_at) >= startDate
      );
    }

    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter(reg =>
        new Date(reg.created_at) <= endOfDay
      );
    }

    // Apply role filters
    if (filterDrivers || filterCM || filterSender) {
      result = result.filter(reg =>
        (filterDrivers && reg.wants_driver) ||
        (filterCM && reg.wants_cm) ||
        (filterSender && reg.wants_sender)
      );
    }

    // Apply search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        reg =>
          reg.first_name.toLowerCase().includes(term) ||
          reg.last_name.toLowerCase().includes(term) ||
          reg.email.toLowerCase().includes(term) ||
          reg.postal_code.toLowerCase().includes(term)
      );
    }

    setFiltered(result);
  }, [allRegs, searchTerm, filterDrivers, filterCM, filterSender, startDate, endDate]);

  return {
    registrations: filtered,
    rawRegistrations: allRegs,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterDrivers,
    setFilterDrivers,
    filterCM,
    setFilterCM,
    filterSender,
    setFilterSender,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refresh: fetchRegs
  };
}
