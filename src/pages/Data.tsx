import { useGroundwaterData } from "@/hooks/useGroundwaterData";
import { DataTable } from "@/components/dashboard/DataTable";
import { Loader2 } from "lucide-react";

export default function Data() {
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
            <h2 className="text-xl font-semibold">Loading Data</h2>
            <p className="text-muted-foreground">Processing data table...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedStationData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Data Unavailable</h2>
          <p className="text-muted-foreground">Please select a station from the Overview tab.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-water bg-clip-text text-transparent mb-2">
          Data Table
        </h1>
        <p className="text-muted-foreground">
          Raw data view and export for <span className="font-semibold text-primary">{selectedStationData.location}</span> (Station ID: {selectedStationData.stationId})
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Displaying {selectedStationData.records.length} records from {selectedStationData.records[0]?.Date} to {selectedStationData.records[selectedStationData.records.length - 1]?.Date}
        </p>
      </div>

      {/* Data Table */}
      <DataTable station={selectedStationData} />
    </div>
  );
}