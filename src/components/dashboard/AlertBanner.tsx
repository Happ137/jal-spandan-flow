import { Alert, AlertDescription } from "@/components/ui/alert";
import { StationData } from "@/types/groundwater";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertBannerProps {
  station: StationData;
  selectedDate?: string;
}

export function AlertBanner({ station, selectedDate }: AlertBannerProps) {
  const currentRecord = selectedDate 
    ? station.records.find(r => r.Date === selectedDate) || station.latestRecord
    : station.latestRecord;

  const getAlertConfig = (status: string) => {
    switch (status) {
      case 'safe':
        return {
          icon: CheckCircle,
          title: "✅ Safe Zone",
          description: `Water level at ${currentRecord.Water_Level_m.toFixed(1)}m is within safe limits (< 10m)`,
          className: "border-water-safe bg-water-safe/10 text-water-safe"
        };
      case 'moderate':
        return {
          icon: AlertTriangle,
          title: "⚠️ Moderate Zone",
          description: `Water level at ${currentRecord.Water_Level_m.toFixed(1)}m requires monitoring (10-20m)`,
          className: "border-water-moderate bg-water-moderate/10 text-water-moderate"
        };
      case 'critical':
        return {
          icon: XCircle,
          title: "❌ Critical Zone",
          description: `Water level at ${currentRecord.Water_Level_m.toFixed(1)}m is critically high (> 20m)`,
          className: "border-water-critical bg-water-critical/10 text-water-critical"
        };
      default:
        return {
          icon: AlertTriangle,
          title: "Unknown Status",
          description: "Unable to determine water level status",
          className: "border-muted bg-muted/10 text-muted-foreground"
        };
    }
  };

  const config = getAlertConfig(station.status);
  const Icon = config.icon;

  return (
    <Alert className={cn("mb-6", config.className)}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-semibold">{config.title}</span>
          <span className="ml-2">{config.description}</span>
        </div>
        <div className="text-sm opacity-75">
          Station: {station.location}
        </div>
      </AlertDescription>
    </Alert>
  );
}