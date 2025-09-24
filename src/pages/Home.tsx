import { useGroundwaterData } from "@/hooks/useGroundwaterData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { stations, loading, error, updateSelectedStation } = useGroundwaterData();
  const navigate = useNavigate();

  const handleLocationSelect = (stationId: string) => {
    updateSelectedStation(stationId);
    navigate('/overview');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Loading Locations</h2>
            <p className="text-muted-foreground">Preparing monitoring stations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stations.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">No Locations Available</h2>
          <p className="text-muted-foreground">Unable to load monitoring stations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-water bg-clip-text text-transparent">
          Groundwater Monitoring System
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select a monitoring station to view detailed groundwater analysis, charts, and data
        </p>
      </div>

      {/* Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {stations.map((station) => {
          const latestRecord = station.records[station.records.length - 1];
          const waterLevel = latestRecord?.Water_Level_m || 0;
          const status = waterLevel > 5 ? 'Normal' : waterLevel > 2 ? 'Watch' : 'Critical';
          const statusColor = status === 'Normal' ? 'text-water-safe' : 
                             status === 'Watch' ? 'text-water-warning' : 'text-water-critical';

          return (
            <Card key={station.stationId} className="cursor-pointer hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="group-hover:text-primary transition-colors">
                    {station.location}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Station ID</span>
                    <span className="font-medium">{station.stationId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Water Level</span>
                    <span className="font-bold">{waterLevel.toFixed(1)}m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`font-medium ${statusColor}`}>
                      {status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Records</span>
                    <span className="text-sm font-medium flex items-center space-x-1">
                      <Activity className="h-3 w-3" />
                      <span>{station.records.length}</span>
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleLocationSelect(station.stationId)}
                  className="w-full"
                  variant="default"
                >
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}