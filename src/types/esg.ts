
export interface ESGMetric {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  unit?: string;
  color: string;
  progress?: number;
  title: string;
  description: string;
}

export interface ESGGoal {
  key: string;
  progress: number;
}

export interface ESGData {
  metrics: {
    co2Saved: number;
    emptyRidesAvoided: number;
    activeUsers: number;
    efficiencyImprovement: number;
    reuseRate: number;
    esgScore: string;
  };
  goals: {
    co2Neutrality: number;
    electricVehicles: number;
    zeroWaste: number;
  };
}

// Mock data that would come from API in real implementation
export const getMockESGData = (): ESGData => ({
  metrics: {
    co2Saved: 1247,
    emptyRidesAvoided: 892,
    activeUsers: 2543,
    efficiencyImprovement: 34,
    reuseRate: 89,
    esgScore: "A-"
  },
  goals: {
    co2Neutrality: 45,
    electricVehicles: 23,
    zeroWaste: 78
  }
});
