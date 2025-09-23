import { useGroundwaterData } from "@/hooks/useGroundwaterData";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const {
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
            <h2 className="text-xl font-semibold">Loading Settings</h2>
            <p className="text-muted-foreground">Preparing configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-water bg-clip-text text-transparent mb-2">
          Settings & Configuration
        </h1>
        <p className="text-muted-foreground">
          Configure data sources, station selection, and view preferences
        </p>
      </div>

      {/* Settings Panel */}
      <div className="max-w-md">
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
      </div>
    </div>
  );
}