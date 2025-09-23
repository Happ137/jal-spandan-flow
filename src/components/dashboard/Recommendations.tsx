import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StationData } from "@/types/groundwater";
import { getRecommendation } from "@/utils/groundwater";
import { Lightbulb, Shield, AlertTriangle, Ban } from "lucide-react";

interface RecommendationsProps {
  station: StationData;
}

export function Recommendations({ station }: RecommendationsProps) {
  const recommendation = getRecommendation(station.status);
  
  const getIcon = (status: string) => {
    switch (status) {
      case 'safe': return Shield;
      case 'moderate': return AlertTriangle;
      case 'critical': return Ban;
      default: return Lightbulb;
    }
  };

  const getColorClass = (status: string) => {
    switch (status) {
      case 'safe': return 'text-water-safe border-water-safe bg-water-safe/5';
      case 'moderate': return 'text-water-moderate border-water-moderate bg-water-moderate/5';
      case 'critical': return 'text-water-critical border-water-critical bg-water-critical/5';
      default: return 'text-muted-foreground border-muted bg-muted/5';
    }
  };

  const Icon = getIcon(station.status);
  
  const getAdditionalRecommendations = (status: string) => {
    switch (status) {
      case 'safe':
        return [
          "Continue regular monitoring of groundwater levels",
          "Implement rainwater harvesting systems",
          "Promote water conservation practices in the community",
          "Consider establishing a groundwater management committee"
        ];
      case 'moderate':
        return [
          "Increase monitoring frequency to daily observations",
          "Restrict new groundwater extraction permits",
          "Implement water-saving irrigation techniques",
          "Explore alternative water sources for non-essential uses",
          "Conduct groundwater quality assessments"
        ];
      case 'critical':
        return [
          "Immediately restrict all non-essential groundwater extraction",
          "Implement emergency water rationing measures",
          "Deploy artificial recharge systems urgently",
          "Conduct detailed hydrogeological surveys",
          "Establish emergency water supply alternatives",
          "Issue public advisories about water scarcity"
        ];
      default:
        return [];
    }
  };

  const additionalRecs = getAdditionalRecommendations(station.status);

  return (
    <Card className={`border-l-4 ${getColorClass(station.status)}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <span>Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg border ${getColorClass(station.status)}`}>
          <div className="flex items-start space-x-3">
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-2">
                Primary Recommendation ({station.status.toUpperCase()} Zone)
              </h4>
              <p className="text-sm">{recommendation}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Detailed Action Items:</h4>
          <div className="grid gap-2">
            {additionalRecs.map((rec, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 rounded bg-muted/30">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-gradient-water rounded-lg text-white">
          <h4 className="font-semibold mb-2 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Smart Insights
          </h4>
          <p className="text-sm opacity-90">
            Current water level: <strong>{station.latestRecord.Water_Level_m.toFixed(1)}m</strong>
            {station.records.length > 1 && (
              <>
                {' • '}
                Trend over last {Math.min(7, station.records.length)} days: 
                <strong>
                  {(() => {
                    const recent = station.records.slice(-7);
                    const change = recent[recent.length - 1].Water_Level_m - recent[0].Water_Level_m;
                    return change > 0.1 ? ' Rising' : change < -0.1 ? ' Falling' : ' Stable';
                  })()}
                </strong>
              </>
            )}
            {' • '}
            Station: <strong>{station.location}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}