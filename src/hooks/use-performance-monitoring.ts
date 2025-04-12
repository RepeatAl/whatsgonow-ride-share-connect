import { useState, useEffect } from "react";

type PerformanceMetrics = {
  responseTime: number;
  threshold: number;
  isWithinThreshold: boolean;
  timestamp: Date;
};

type PerformanceMonitoringResult = {
  isEnabled: boolean;
  metrics: PerformanceMetrics[];
  averageResponseTime: number;
  isPerformanceGood: boolean;
};

export const usePerformanceMonitoring = (): PerformanceMonitoringResult => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  
  const threshold = 1500; // 1.5 seconds in ms
  
  useEffect(() => {
    let intervalId: number;
    
    const startMonitoring = () => {
      // In a real implementation, this would connect to Supabase
      console.log("Starting performance monitoring...");
      setIsEnabled(true);
      
      // Simulate metrics collection
      intervalId = window.setInterval(() => {
        const randomResponseTime = Math.floor(Math.random() * 2000); // Random between 0-2000ms
        
        setMetrics(prev => {
          // Keep only the last 50 data points
          const updatedMetrics = [...prev, {
            responseTime: randomResponseTime,
            threshold,
            isWithinThreshold: randomResponseTime < threshold,
            timestamp: new Date()
          }];
          
          if (updatedMetrics.length > 50) {
            return updatedMetrics.slice(-50);
          }
          
          return updatedMetrics;
        });
      }, 5000); // Collect data every 5 seconds
    };
    
    startMonitoring();
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
  
  // Calculate average response time
  const averageResponseTime = metrics.length > 0
    ? metrics.reduce((acc, metric) => acc + metric.responseTime, 0) / metrics.length
    : 0;
    
  // Determine if overall performance is good
  const isPerformanceGood = averageResponseTime < threshold;
  
  return {
    isEnabled,
    metrics,
    averageResponseTime,
    isPerformanceGood
  };
};
