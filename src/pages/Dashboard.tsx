import { useGroundwaterData } from "@/hooks/useGroundwaterData";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { InfoCards } from "@/components/dashboard/InfoCards";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { StationMap } from "@/components/dashboard/StationMap";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DataTable } from "@/components/dashboard/DataTable";
import { Recommendations } from "@/components/dashboard/Recommendations";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
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
      <div className="flex items-center justify-center min-h-screen bg-background">
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
      <div className="flex items-center justify-center min-h-screen bg-background">
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">No Data Available</h2>
          <p className="text-muted-foreground">Please upload a CSV file with groundwater data.</p>
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

          {/* Map */}
          <StationMap
            stations={stations}
            selectedStation={selectedStation}
            onStationSelect={updateSelectedStation}
          />

          {/* Trend Chart */}
          <TrendChart station={selectedStationData} />

          {/* Data Table */}
          <DataTable station={selectedStationData} />

          {/* Recommendations */}
          <Recommendations station={selectedStationData} />
        </div>
      </main>
    </div>
  );
}