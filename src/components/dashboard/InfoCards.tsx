import { Card, CardContent } from "@/components/ui/card";
import { StationData } from "@/types/groundwater";
import { getRechargeChange, getStatusColor } from "@/utils/groundwater";
import { MapPin, Droplets, TrendingUp, TrendingDown, Minus, CloudRain } from "lucide-react";

interface InfoCardsProps {
  station: StationData;
  selectedDate?: string;
}

export function InfoCards({ station, selectedDate }: InfoCardsProps) {
  const currentRecord = selectedDate 
    ? station.records.find(r => r.Date === selectedDate) || station.latestRecord
    : station.latestRecord;
    
  const previousRecord = station.records[station.records.indexOf(currentRecord) - 1];
  const rechargeChange = previousRecord ? getRechargeChange(currentRecord.Water_Level_m, previousRecord.Water_Level_m) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Location</p>
              <p className="text-lg font-semibold">{station.location}</p>
              <p className="text-xs text-muted-foreground">{station.stationId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-secondary">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Droplets className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Groundwater Level</p>
              <p className="text-lg font-semibold">{currentRecord.Water_Level_m.toFixed(1)}m</p>
              <p className={`text-xs font-medium ${getStatusColor(station.status)}`}>
                {station.status.toUpperCase()} ZONE
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-accent">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              {rechargeChange?.trend === 'up' && <TrendingUp className="h-5 w-5 text-water-safe" />}
              {rechargeChange?.trend === 'down' && <TrendingDown className="h-5 w-5 text-water-critical" />}
              {rechargeChange?.trend === 'stable' && <Minus className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recharge Δ</p>
              <p className="text-lg font-semibold">
                {rechargeChange ? 
                  `${rechargeChange.value > 0 ? '+' : ''}${rechargeChange.value.toFixed(2)}m` 
                  : 'N/A'
                }
              </p>
              <p className="text-xs text-muted-foreground">from previous day</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CloudRain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rainfall</p>
              <p className="text-lg font-semibold">{currentRecord.Rainfall_mm}mm</p>
              <p className="text-xs text-muted-foreground">current day</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}