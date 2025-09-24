import { useGroundwaterData } from "@/hooks/useGroundwaterData";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { Loader2 } from "lucide-react";

export default function Charts() {
  const {
    selectedStationData,
    loading,
    error
  } = useGroundwaterData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Loading Charts</h2>
            <p className="text-muted-foreground">Preparing visualizations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedStationData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Charts Unavailable</h2>
          <p className="text-muted-foreground">Please select a station from the Overview tab.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Charts Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-water bg-clip-text text-transparent mb-2">
          Charts & Visualizations
        </h1>
        <p className="text-muted-foreground">
          Graphical analysis of groundwater trends for <span className="font-semibold text-primary">{selectedStationData.location}</span> (Station ID: {selectedStationData.stationId})
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Visualizing {selectedStationData.records.length} data points from {selectedStationData.records[0]?.Date} to {selectedStationData.records[selectedStationData.records.length - 1]?.Date}
        </p>
      </div>

      {/* Trend Chart */}
      <TrendChart station={selectedStationData} />
    </div>
  );
}