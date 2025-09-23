import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StationData } from "@/types/groundwater";
import { formatDate } from "@/utils/groundwater";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

interface TrendChartProps {
  station: StationData;
}

export function TrendChart({ station }: TrendChartProps) {
  const chartData = station.records.map(record => ({
    date: formatDate(record.Date),
    waterLevel: record.Water_Level_m,
    rainfall: record.Rainfall_mm,
    fullDate: record.Date
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'waterLevel' ? 'Water Level: ' : 'Rainfall: '}
              {entry.value}{entry.dataKey === 'waterLevel' ? 'm' : 'mm'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Groundwater Trends & Recharge Pattern</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                yAxisId="water"
                orientation="left"
                stroke="hsl(var(--primary))"
                fontSize={12}
                label={{ value: 'Water Level (m)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="rain"
                orientation="right"
                stroke="hsl(var(--secondary))"
                fontSize={12}
                label={{ value: 'Rainfall (mm)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Bar 
                yAxisId="rain"
                dataKey="rainfall" 
                name="Rainfall (mm)"
                fill="hsl(var(--secondary))"
                opacity={0.6}
                radius={[2, 2, 0, 0]}
              />
              
              <Line
                yAxisId="water"
                type="monotone"
                dataKey="waterLevel"
                name="Water Level (m)"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="font-medium text-primary">Average Water Level</p>
            <p className="text-lg font-bold">
              {(station.records.reduce((sum, r) => sum + r.Water_Level_m, 0) / station.records.length).toFixed(1)}m
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="font-medium text-secondary">Total Rainfall</p>
            <p className="text-lg font-bold">
              {station.records.reduce((sum, r) => sum + r.Rainfall_mm, 0)}mm
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="font-medium text-accent">Data Points</p>
            <p className="text-lg font-bold">{station.records.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}