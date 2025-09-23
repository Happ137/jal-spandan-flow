export interface GroundwaterRecord {
  Station_ID: string;
  Location: string;
  Lat: number;
  Lon: number;
  Date: string;
  Water_Level_m: number;
  Rainfall_mm: number;
}

export interface StationData {
  stationId: string;
  location: string;
  lat: number;
  lon: number;
  records: GroundwaterRecord[];
  latestRecord: GroundwaterRecord;
  status: 'safe' | 'moderate' | 'critical';
}

export type ViewMode = 'latest' | 'timeSeries';

export interface DashboardState {
  selectedStation: string;
  viewMode: ViewMode;
  selectedDate: string;
  data: GroundwaterRecord[];
  stations: StationData[];
}