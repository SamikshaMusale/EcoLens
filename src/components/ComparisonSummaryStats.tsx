import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Thermometer, Droplets, MapPin } from "lucide-react";

interface LocationData {
  location: string;
  deforestationSeries: Array<{ year: number; hectares_lost: number }>;
  climateSeries: Array<{ year: number; avg_temp_c: number; total_precip_mm: number }>;
}

interface ComparisonSummaryStatsProps {
  locations: LocationData[];
}

export const ComparisonSummaryStats = ({ locations }: ComparisonSummaryStatsProps) => {
  if (locations.length === 0) return null;

  const calculateStats = (loc: LocationData) => {
    const totalDeforestation = loc.deforestationSeries.reduce((sum, d) => sum + d.hectares_lost, 0);
    const avgTemp = loc.climateSeries.reduce((sum, d) => sum + d.avg_temp_c, 0) / loc.climateSeries.length;
    const avgPrecip = loc.climateSeries.reduce((sum, d) => sum + d.total_precip_mm, 0) / loc.climateSeries.length;
    
    return { totalDeforestation, avgTemp, avgPrecip };
  };

  const stats = locations.map(loc => ({
    location: loc.location,
    ...calculateStats(loc)
  }));

  const mostDeforested = stats.reduce((max, stat) => 
    stat.totalDeforestation > max.totalDeforestation ? stat : max
  );

  const warmest = stats.reduce((max, stat) => 
    stat.avgTemp > max.avgTemp ? stat : max
  );

  const wettest = stats.reduce((max, stat) => 
    stat.avgPrecip > max.avgPrecip ? stat : max
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Locations</p>
              <p className="text-2xl font-bold text-foreground">{locations.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Most Deforested</p>
              <p className="text-sm font-bold text-foreground truncate">{mostDeforested.location}</p>
              <p className="text-xs text-muted-foreground">{mostDeforested.totalDeforestation.toLocaleString()} ha</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <Thermometer className="h-6 w-6 text-destructive" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Warmest</p>
              <p className="text-sm font-bold text-foreground truncate">{warmest.location}</p>
              <p className="text-xs text-muted-foreground">{warmest.avgTemp.toFixed(1)}°C avg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Droplets className="h-6 w-6 text-accent" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Wettest</p>
              <p className="text-sm font-bold text-foreground truncate">{wettest.location}</p>
              <p className="text-xs text-muted-foreground">{wettest.avgPrecip.toFixed(0)} mm avg</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
