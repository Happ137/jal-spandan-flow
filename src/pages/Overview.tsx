import { useGroundwaterData } from "@/hooks/useGroundwaterData";
import { InfoCards } from "@/components/dashboard/InfoCards";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Overview() {
  const {
    selectedStationData,
    stations,
    selectedStation,
    viewMode,
    selectedDate,
    availableDates,
    loading,
    error,
    loadCustomData,
    updateSelectedStation,
    updateViewMode,
    updateSelectedDate
  } = useGroundwaterData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Loading JalDarpan</h2>
            <p className="text-muted-foreground">Processing groundwater data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Data</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedStationData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">No Data Available</h2>
          <p className="text-muted-foreground">Please upload a CSV file with groundwater data in Settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        stations={stations}
        selectedStation={selectedStation}
        viewMode={viewMode}
        selectedDate={selectedDate}
        availableDates={availableDates}
        onStationSelect={updateSelectedStation}
        onViewModeChange={updateViewMode}
        onDateChange={updateSelectedDate}
        onFileUpload={loadCustomData}
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-water bg-clip-text text-transparent mb-2">
              JalDarpan Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time groundwater monitoring and analysis for {selectedStationData.location}
            </p>
          </div>

      {/* Info Cards */}
      <InfoCards 
        station={selectedStationData} 
        selectedDate={viewMode === 'timeSeries' ? selectedDate : undefined}
      />

      {/* Alert Banner */}
      <AlertBanner 
        station={selectedStationData}
        selectedDate={viewMode === 'timeSeries' ? selectedDate : undefined}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{selectedStationData.records.length}</p>
            <p className="text-sm text-muted-foreground">days of data</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average Water Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-secondary">
              {(selectedStationData.records.reduce((sum, r) => sum + r.Water_Level_m, 0) / selectedStationData.records.length).toFixed(1)}m
            </p>
            <p className="text-sm text-muted-foreground">over monitored period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Rainfall</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">
              {selectedStationData.records.reduce((sum, r) => sum + r.Rainfall_mm, 0)}mm
            </p>
            <p className="text-sm text-muted-foreground">cumulative precipitation</p>
          </CardContent>
        </Card>
          </div>
        </div>
      </main>
    </div>
  );
}