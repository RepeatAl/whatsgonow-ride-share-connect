
import { useState, useEffect } from "react";
import { checkConnection } from "@/lib/supabaseClient";
import { ConnectionError } from "./connection-error";

export const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnectionStatus = async () => {
    setIsChecking(true);
    try {
      const result = await checkConnection();
      setIsConnected(result.connected);
      setError(result.connected ? null : (result.error || "Unbekannter Verbindungsfehler"));
    } catch (err) {
      setIsConnected(false);
      setError((err as Error).message || "Unbekannter Fehler bei der Verbindungsprüfung");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
    
    // Überprüfe Verbindung periodisch
    const intervalId = setInterval(checkConnectionStatus, 60000); // Jede Minute
    
    return () => clearInterval(intervalId);
  }, []);

  if (isConnected) return null;

  return (
    <ConnectionError 
      message={error || "Es gibt ein Problem mit der Verbindung zum Server."}
      onRetry={checkConnectionStatus}
    />
  );
};
