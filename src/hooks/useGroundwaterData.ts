import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { GroundwaterRecord, StationData, DashboardState } from '@/types/groundwater';
import { processStationData } from '@/utils/groundwater';

export function useGroundwaterData() {
  const [state, setState] = useState<DashboardState>({
    selectedStation: '',
    viewMode: 'latest',
    selectedDate: '',
    data: [],
    stations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDefaultData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/data/dwlr_data.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const records = results.data as GroundwaterRecord[];
          const validRecords = records.filter(record => 
            record.Station_ID && record.Location && record.Date
          ).map(record => ({
            ...record,
            Lat: parseFloat(record.Lat as any),
            Lon: parseFloat(record.Lon as any),
            Water_Level_m: parseFloat(record.Water_Level_m as any),
            Rainfall_mm: parseFloat(record.Rainfall_mm as any)
          }));

          const stations = processStationData(validRecords);
          const dates = [...new Set(validRecords.map(r => r.Date))].sort();
          
          setState(prev => ({
            ...prev,
            data: validRecords,
            stations,
            selectedStation: stations[0]?.stationId || '',
            selectedDate: dates[dates.length - 1] || ''
          }));
          setLoading(false);
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          setLoading(false);
        }
      });
    } catch (err) {
      setError(`Error loading data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const loadCustomData = (file: File) => {
    setLoading(true);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const records = results.data as GroundwaterRecord[];
        const validRecords = records.filter(record => 
          record.Station_ID && record.Location && record.Date
        ).map(record => ({
          ...record,
          Lat: parseFloat(record.Lat as any),
          Lon: parseFloat(record.Lon as any),
          Water_Level_m: parseFloat(record.Water_Level_m as any),
          Rainfall_mm: parseFloat(record.Rainfall_mm as any)
        }));

        const stations = processStationData(validRecords);
        const dates = [...new Set(validRecords.map(r => r.Date))].sort();
        
        setState(prev => ({
          ...prev,
          data: validRecords,
          stations,
          selectedStation: stations[0]?.stationId || '',
          selectedDate: dates[dates.length - 1] || ''
        }));
        setLoading(false);
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
        setLoading(false);
      }
    });
  };

  const updateSelectedStation = (stationId: string) => {
    setState(prev => ({ ...prev, selectedStation: stationId }));
  };

  const updateViewMode = (mode: 'latest' | 'timeSeries') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  };

  const updateSelectedDate = (date: string) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  };

  useEffect(() => {
    loadDefaultData();
  }, []);

  const selectedStationData = state.stations.find(s => s.stationId === state.selectedStation);
  const availableDates = selectedStationData ? 
    selectedStationData.records.map(r => r.Date).sort() : [];

  return {
    ...state,
    selectedStationData,
    availableDates,
    loading,
    error,
    loadCustomData,
    updateSelectedStation,
    updateViewMode,
    updateSelectedDate
  };
}