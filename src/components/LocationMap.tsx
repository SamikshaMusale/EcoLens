import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationStats {
  avgTemp?: number;
  totalRainfall?: number;
  annualDeforestation?: number;
}

interface LocationMapProps {
  locations?: Array<{
    name: string;
    coordinates: [number, number];
    stats?: LocationStats;
  }>;
  // Legacy single-location support
  location?: string;
  coordinates?: [number, number];
  stats?: LocationStats;
}

export function LocationMap({ locations, location, coordinates, stats }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const { theme } = useTheme();

  // Normalize props to always work with array format
  const normalizedLocations = locations || (location && coordinates ? [{
    name: location,
    coordinates,
    stats
  }] : []);

  const markerColors = ["#2E7D32", "#FF6B6B", "#4A90E2"];

  useEffect(() => {
    if (!mapContainer.current || normalizedLocations.length === 0) return;

    // Parse coordinates as numbers to ensure accuracy
    const parsedLocations = normalizedLocations.map(loc => ({
      ...loc,
      coordinates: [parseFloat(String(loc.coordinates[0])), parseFloat(String(loc.coordinates[1]))] as [number, number]
    }));

    // Initialize or update map
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    if (!map.current) {
      // Create new map
      map.current = L.map(mapContainer.current, {
        center: parsedLocations[0].coordinates,
        zoom: parsedLocations.length > 1 ? 4 : 8,
        zoomControl: true,
      });
    } else {
      // Map exists, just update tiles and markers
      map.current.eachLayer((layer) => {
        map.current!.removeLayer(layer);
      });
    }

    // Add OpenStreetMap tiles with theme-appropriate style
    const tileLayer = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    
    const attribution = isDark
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    L.tileLayer(tileLayer, {
      attribution,
      maxZoom: 19,
    }).addTo(map.current);

    // Add markers for each location
    const bounds = L.latLngBounds([]);
    parsedLocations.forEach((loc, index) => {
      const color = markerColors[index] || markerColors[0];
      
      // Create custom colored marker
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          background-color: ${color};
          width: 25px;
          height: 25px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 24],
      });

      const marker = L.marker(loc.coordinates, { icon: customIcon }).addTo(map.current!);

      // Create popup content with stats
      const popupContent = `
        <div style="font-family: system-ui; min-width: 200px;">
          <strong style="font-size: 14px; display: block; margin-bottom: 8px;">${loc.name}</strong>
          ${loc.stats ? `
            <div style="font-size: 12px; color: #666;">
              ${loc.stats.avgTemp !== undefined ? `
                <div style="margin-bottom: 4px;">
                  <span style="font-weight: 500;">Avg Temperature:</span> ${loc.stats.avgTemp.toFixed(1)}°C
                </div>
              ` : ''}
              ${loc.stats.totalRainfall !== undefined ? `
                <div style="margin-bottom: 4px;">
                  <span style="font-weight: 500;">Total Rainfall:</span> ${loc.stats.totalRainfall.toLocaleString()} mm
                </div>
              ` : ''}
              ${loc.stats.annualDeforestation !== undefined ? `
                <div style="margin-bottom: 4px;">
                  <span style="font-weight: 500;">Annual Deforestation:</span> ${loc.stats.annualDeforestation.toLocaleString()} ha
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      bounds.extend(loc.coordinates);
    });

    // Fit map to show all markers with smooth animation
    if (parsedLocations.length > 1) {
      setTimeout(() => {
        map.current?.fitBounds(bounds, { 
          padding: [50, 50],
          animate: true,
          duration: 1
        });
      }, 100);
    } else {
      // Single location - fly to it smoothly
      setTimeout(() => {
        map.current?.flyTo(parsedLocations[0].coordinates, 8, {
          animate: true,
          duration: 1
        });
      }, 100);
    }

    // Invalidate size on theme change or window resize to ensure proper rendering
    const handleResize = () => {
      map.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [normalizedLocations, theme]);

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Location Map
        </CardTitle>
        <CardDescription>
          {normalizedLocations.length > 1 
            ? "Interactive map showing all compared locations"
            : "Geographic visualization of analyzed region"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainer} 
          className="h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-border"
          style={{ width: "100%" }}
        />
      </CardContent>
    </Card>
  );
}
