import { useGroundwaterData } from "@/hooks/useGroundwaterData";
import { StationMap } from "@/components/dashboard/StationMap";
import { Loader2 } from "lucide-react";

export default function Map() {
  const {
    stations,
    selectedStation,
    updateSelectedStation,
    loading,
    error
  } = useGroundwaterData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Loading Map</h2>
            <p className="text-muted-foreground">Preparing station locations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stations.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Map Unavailable</h2>
          <p className="text-muted-foreground">Please select a station from the Overview tab.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-water bg-clip-text text-transparent mb-2">
          Station Map
        </h1>
        <p className="text-muted-foreground">
          Interactive map showing all monitoring stations with <span className="font-semibold text-primary">{stations.find(s => s.stationId === selectedStation)?.location || 'selected station'}</span> highlighted
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Click on any station marker to switch location and update all dashboard data
        </p>
      </div>

      {/* Map */}
      <StationMap
        stations={stations}
        selectedStation={selectedStation}
        onStationSelect={updateSelectedStation}
      />
    </div>
  );
}