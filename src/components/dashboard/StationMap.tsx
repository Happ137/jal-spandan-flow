import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { StationData } from '@/types/groundwater';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface StationMapProps {
  stations: StationData[];
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
}

export function StationMap({ stations, selectedStation, onStationSelect }: StationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSet, setTokenSet] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [77.2090, 18.5204], // Center on India
      zoom: 5,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each station
    stations.forEach(station => {
      const color = getMarkerColor(station.status);
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
      `;
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([station.lon, station.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0; font-weight: bold;">${station.location}</h3>
              <p style="margin: 2px 0; font-size: 12px;"><strong>Station:</strong> ${station.stationId}</p>
              <p style="margin: 2px 0; font-size: 12px;"><strong>Water Level:</strong> ${station.latestRecord.Water_Level_m.toFixed(1)}m</p>
              <p style="margin: 2px 0; font-size: 12px;"><strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${station.status.toUpperCase()}</span></p>
            </div>
          `))
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onStationSelect(station.stationId);
      });

      markers.current[station.stationId] = marker;
    });
  };

  const getMarkerColor = (status: 'safe' | 'moderate' | 'critical') => {
    switch (status) {
      case 'safe': return '#22c55e';
      case 'moderate': return '#eab308';
      case 'critical': return '#ef4444';
    }
  };

  useEffect(() => {
    if (tokenSet) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        markers.current = {};
      }
    };
  }, [tokenSet, stations]);

  // Highlight selected station
  useEffect(() => {
    Object.entries(markers.current).forEach(([stationId, marker]) => {
      const element = marker.getElement();
      if (stationId === selectedStation) {
        element.style.transform = 'scale(1.3)';
        element.style.zIndex = '1000';
        element.style.border = '3px solid #0077B6';
      } else {
        element.style.transform = 'scale(1)';
        element.style.zIndex = '1';
        element.style.border = '2px solid white';
      }
    });
  }, [selectedStation]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setTokenSet(true);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-6">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>📍 Station Map</span>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {!tokenSet ? (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  To display the map, please enter your Mapbox public token. You can get one at{' '}
                  <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    mapbox.com
                  </a>
                </p>
                <div className="flex space-x-2">
                  <Input
                    placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOi..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
                    Load Map
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div ref={mapContainer} className="h-96 rounded-lg border overflow-hidden" />
                
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-water-safe rounded-full"></div>
                    <span>Safe Zone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-water-moderate rounded-full"></div>
                    <span>Moderate Zone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-water-critical rounded-full"></div>
                    <span>Critical Zone</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}