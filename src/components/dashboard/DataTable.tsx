import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StationData } from "@/types/groundwater";
import { formatDate, exportStationData } from "@/utils/groundwater";
import { ChevronDown, ChevronUp, Download, Database } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  station: StationData;
}

export function DataTable({ station }: DataTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const recentRecords = station.records.slice(-10).reverse();

  const handleDownload = () => {
    const csvContent = exportStationData(station);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${station.location.replace(/\s+/g, '_')}_groundwater_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-6">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary" />
                <span>📊 Data Table</span>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                Last {recentRecords.length} days for {station.location}
              </p>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                ⬇ Download CSV (Filtered Data)
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Water Level (m)</TableHead>
                    <TableHead className="font-semibold">Rainfall (mm)</TableHead>
                    <TableHead className="font-semibold">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRecords.map((record, index) => {
                    const previousRecord = index < recentRecords.length - 1 ? recentRecords[index + 1] : null;
                    const change = previousRecord ? record.Water_Level_m - previousRecord.Water_Level_m : 0;
                    
                    return (
                      <TableRow key={record.Date} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          {formatDate(record.Date)}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{record.Water_Level_m.toFixed(1)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{record.Rainfall_mm}</span>
                        </TableCell>
                        <TableCell>
                          {previousRecord && (
                            <span 
                              className={`font-mono text-sm ${
                                change > 0 ? 'text-water-critical' : 
                                change < 0 ? 'text-water-safe' : 
                                'text-muted-foreground'
                              }`}
                            >
                              {change > 0 ? '+' : ''}{change.toFixed(2)}m
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 p-3 bg-muted/20 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Positive changes indicate rising water levels (potentially concerning), 
                while negative changes indicate falling levels (potentially improving conditions).
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}