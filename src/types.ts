export type HazardType = 'drought' | 'flood' | 'food_security';

export type TriggerStatus = 'exceeded' | 'at_threshold' | 'below_threshold';
export type Trend = 'rising' | 'declining' | 'stable';
export type Severity = 'severe' | 'moderate' | 'watch';

export interface HistoryPoint {
  date: string;
  value: number;
}

export interface HazardRecord {
  id: string;
  country: string;
  region: string;
  hazardType: HazardType;
  indicatorName: string;
  value: number;
  unit: string;
  threshold: number;
  triggerStatus: TriggerStatus;
  trend: Trend;
  lastUpdated: string;
  history: HistoryPoint[];
  lat: number;
  lng: number;
}

export interface AlertData {
  severity: Severity;
  headline: string;
  message: string;
  actions: string[];
}
