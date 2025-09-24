import { useGroundwaterData } from "@/hooks/useGroundwaterData";
import { Recommendations } from "@/components/dashboard/Recommendations";
import { Loader2, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Analysis() {
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
            <h2 className="text-xl font-semibold">Loading Analysis</h2>
            <p className="text-muted-foreground">Processing groundwater analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedStationData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Analysis Unavailable</h2>
          <p className="text-muted-foreground">Please select a station from the Overview tab.</p>
        </div>
      </div>
    );
  }

  // Calculate trends and statistics
  const records = selectedStationData.records;
  const waterLevels = records.map(r => r.Water_Level_m);
  const rainfallData = records.map(r => r.Rainfall_mm);
  
  const minLevel = Math.min(...waterLevels);
  const maxLevel = Math.max(...waterLevels);
  const avgLevel = waterLevels.reduce((sum, level) => sum + level, 0) / waterLevels.length;
  
  const totalRainfall = rainfallData.reduce((sum, rain) => sum + rain, 0);
  const avgRainfall = totalRainfall / rainfallData.length;
  
  // Calculate trend (comparing first and last 7 days)
  const firstWeekAvg = waterLevels.slice(0, 7).reduce((sum, level) => sum + level, 0) / 7;
  const lastWeekAvg = waterLevels.slice(-7).reduce((sum, level) => sum + level, 0) / 7;
  const overallTrend = lastWeekAvg > firstWeekAvg ? 'increasing' : lastWeekAvg < firstWeekAvg ? 'decreasing' : 'stable';

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-water bg-clip-text text-transparent mb-2">
          Groundwater Analysis
        </h1>
        <p className="text-muted-foreground">
          Detailed insights and trends for <span className="font-semibold text-primary">{selectedStationData.location}</span> (Station ID: {selectedStationData.stationId})
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Analyzing {selectedStationData.records.length} data points from {selectedStationData.records[0]?.Date} to {selectedStationData.records[selectedStationData.records.length - 1]?.Date}
        </p>
      </div>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Trend Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {overallTrend === 'increasing' && <TrendingUp className="h-5 w-5 text-water-safe" />}
                {overallTrend === 'decreasing' && <TrendingDown className="h-5 w-5 text-water-critical" />}
                {overallTrend === 'stable' && <Activity className="h-5 w-5 text-muted-foreground" />}
                <Badge variant={overallTrend === 'increasing' ? 'default' : overallTrend === 'decreasing' ? 'destructive' : 'secondary'}>
                  {overallTrend.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm font-medium">Overall Trend</p>
              <p className="text-xs text-muted-foreground">Last 7 days vs First 7 days</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-lg font-bold text-primary">{(lastWeekAvg - firstWeekAvg).toFixed(2)}m</p>
              <p className="text-sm font-medium">Net Change</p>
              <p className="text-xs text-muted-foreground">Over monitoring period</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-lg font-bold text-secondary">{((Math.abs(lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100).toFixed(1)}%</p>
              <p className="text-sm font-medium">Relative Change</p>
              <p className="text-xs text-muted-foreground">Percentage variation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistical Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Statistical Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-xl font-bold text-primary">{minLevel.toFixed(1)}m</p>
              <p className="text-sm font-medium">Minimum Level</p>
            </div>
            <div className="text-center p-4 bg-secondary/10 rounded-lg">
              <p className="text-xl font-bold text-secondary">{maxLevel.toFixed(1)}m</p>
              <p className="text-sm font-medium">Maximum Level</p>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <p className="text-xl font-bold text-accent">{avgLevel.toFixed(1)}m</p>
              <p className="text-sm font-medium">Average Level</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-xl font-bold">{(maxLevel - minLevel).toFixed(1)}m</p>
              <p className="text-sm font-medium">Range</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rainfall Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Rainfall Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalRainfall}mm</p>
              <p className="text-sm font-medium">Total Rainfall</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{avgRainfall.toFixed(1)}mm</p>
              <p className="text-sm font-medium">Daily Average</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {rainfallData.filter(r => r > 0).length}
              </p>
              <p className="text-sm font-medium">Rainy Days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Recommendations station={selectedStationData} />
    </div>
  );
}