import { GroundwaterRecord, StationData } from '@/types/groundwater';

export function getWaterLevelStatus(waterLevel: number): 'safe' | 'moderate' | 'critical' {
  if (waterLevel < 10) return 'safe';
  if (waterLevel <= 20) return 'moderate';
  return 'critical';
}

export function getStatusColor(status: 'safe' | 'moderate' | 'critical'): string {
  switch (status) {
    case 'safe': return 'text-water-safe';
    case 'moderate': return 'text-water-moderate';
    case 'critical': return 'text-water-critical';
  }
}

export function getStatusBgColor(status: 'safe' | 'moderate' | 'critical'): string {
  switch (status) {
    case 'safe': return 'bg-water-safe';
    case 'moderate': return 'bg-water-moderate';
    case 'critical': return 'bg-water-critical';
  }
}

export function getRechargeChange(current: number, previous: number): { value: number; trend: 'up' | 'down' | 'stable' } {
  const change = current - previous;
  if (Math.abs(change) < 0.05) return { value: change, trend: 'stable' };
  return { value: change, trend: change > 0 ? 'up' : 'down' };
}

export function processStationData(records: GroundwaterRecord[]): StationData[] {
  const stationMap = new Map<string, GroundwaterRecord[]>();
  
  // Group records by station
  records.forEach(record => {
    if (!stationMap.has(record.Station_ID)) {
      stationMap.set(record.Station_ID, []);
    }
    stationMap.get(record.Station_ID)!.push(record);
  });

  // Process each station
  return Array.from(stationMap.entries()).map(([stationId, stationRecords]) => {
    // Sort by date
    const sortedRecords = stationRecords.sort((a, b) => 
      new Date(a.Date).getTime() - new Date(b.Date).getTime()
    );
    
    const latestRecord = sortedRecords[sortedRecords.length - 1];
    const status = getWaterLevelStatus(latestRecord.Water_Level_m);

    return {
      stationId,
      location: latestRecord.Location,
      lat: latestRecord.Lat,
      lon: latestRecord.Lon,
      records: sortedRecords,
      latestRecord,
      status
    };
  });
}

export function getRecommendation(status: 'safe' | 'moderate' | 'critical'): string {
  switch (status) {
    case 'safe':
      return "Maintain current usage. Promote conservation awareness.";
    case 'moderate':
      return "Encourage efficient irrigation. Monitor extraction carefully.";
    case 'critical':
      return "High risk. Restrict extraction and promote artificial recharge.";
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function exportStationData(station: StationData): string {
  const headers = ['Date', 'Water Level (m)', 'Rainfall (mm)'];
  const rows = station.records.slice(-10).map(record => [
    formatDate(record.Date),
    record.Water_Level_m.toString(),
    record.Rainfall_mm.toString()
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}