import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { StationData, ViewMode } from "@/types/groundwater";
import { Upload, MapPin, Calendar, ToggleLeft } from "lucide-react";
import { useRef } from "react";

interface SidebarProps {
  stations: StationData[];
  selectedStation: string;
  viewMode: ViewMode;
  selectedDate: string;
  availableDates: string[];
  onStationSelect: (stationId: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onDateChange: (date: string) => void;
  onFileUpload: (file: File) => void;
}

export function Sidebar({ 
  stations, 
  selectedStation, 
  viewMode,
  selectedDate,
  availableDates,
  onStationSelect, 
  onViewModeChange,
  onDateChange,
  onFileUpload 
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const currentDateIndex = availableDates.indexOf(selectedDate);
  const maxDateIndex = availableDates.length - 1;

  const handleSliderChange = (value: number[]) => {
    const dateIndex = value[0];
    if (dateIndex >= 0 && dateIndex < availableDates.length) {
      onDateChange(availableDates[dateIndex]);
    }
  };

  return (
    <div className="w-80 h-screen bg-card border-r border-border p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="bg-gradient-water text-white p-4 rounded-lg mb-4">
          <h1 className="text-xl font-bold mb-1">JalDarpan</h1>
          <p className="text-sm opacity-90">Real-Time Groundwater Resource Evaluation</p>
          <p className="text-xs opacity-75 mt-1">Prototype using DWLR data – Smart India Hackathon 2025</p>
        </div>
      </div>

      {/* Location Selector */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={selectedStation} onValueChange={onStationSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select station..." />
            </SelectTrigger>
            <SelectContent>
              {stations.map(station => (
                <SelectItem key={station.stationId} value={station.stationId}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      station.status === 'safe' ? 'bg-water-safe' :
                      station.status === 'moderate' ? 'bg-water-moderate' :
                      'bg-water-critical'
                    }`}></div>
                    <span>{station.location}</span>
                    <span className="text-xs text-muted-foreground">({station.stationId})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <ToggleLeft className="h-4 w-4 text-primary" />
            <span>View Mode</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              checked={viewMode === 'timeSeries'}
              onCheckedChange={(checked) => onViewModeChange(checked ? 'timeSeries' : 'latest')}
            />
            <Label className="text-sm">
              {viewMode === 'latest' ? 'Last Available Data' : 'Step Through Days'}
            </Label>
          </div>
          
          {viewMode === 'timeSeries' && availableDates.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {new Date(selectedDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="px-2">
                <Slider
                  value={[currentDateIndex]}
                  onValueChange={handleSliderChange}
                  max={maxDateIndex}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {new Date(availableDates[0]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
                <span>
                  {new Date(availableDates[maxDateIndex]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Upload className="h-4 w-4 text-primary" />
            <span>Dataset</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">
              Expected format: Station_ID, Location, Lat, Lon, Date, Water_Level_m, Rainfall_mm
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-water-safe/10 rounded text-center">
              <div className="font-semibold text-water-safe">
                {stations.filter(s => s.status === 'safe').length}
              </div>
              <div className="text-muted-foreground">Safe</div>
            </div>
            <div className="p-2 bg-water-moderate/10 rounded text-center">
              <div className="font-semibold text-water-moderate">
                {stations.filter(s => s.status === 'moderate').length}
              </div>
              <div className="text-muted-foreground">Moderate</div>
            </div>
          </div>
          <div className="p-2 bg-water-critical/10 rounded text-center text-xs">
            <div className="font-semibold text-water-critical">
              {stations.filter(s => s.status === 'critical').length}
            </div>
            <div className="text-muted-foreground">Critical</div>
          </div>
          <div className="pt-2 border-t text-xs text-muted-foreground">
            Total Stations: <strong>{stations.length}</strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}