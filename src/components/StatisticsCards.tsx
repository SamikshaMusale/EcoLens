import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Droplets, Thermometer, Trees } from "lucide-react";

interface StatisticsCardsProps {
  deforestationSeries: Array<{ year: number; hectares_lost: number }>;
  climateSeries: Array<{ year: number; avg_temp_c: number; total_precip_mm: number }>;
}

export const StatisticsCards = ({ deforestationSeries, climateSeries }: StatisticsCardsProps) => {
  const totalDeforestation = deforestationSeries.reduce(
    (sum, d) => sum + d.hectares_lost, 0
  );
  const avgDeforestation = Math.round(totalDeforestation / deforestationSeries.length);
  
  const firstTemp = climateSeries[0]?.avg_temp_c || 0;
  const lastTemp = climateSeries[climateSeries.length - 1]?.avg_temp_c || 0;
  const tempChange = (lastTemp - firstTemp).toFixed(2);
  
  const firstPrecip = climateSeries[0]?.total_precip_mm || 0;
  const lastPrecip = climateSeries[climateSeries.length - 1]?.total_precip_mm || 0;
  const precipChange = ((lastPrecip - firstPrecip) / firstPrecip * 100).toFixed(1);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border shadow-soft hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <Trees className="h-4 w-4 text-destructive" />
            Total Forest Loss
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {totalDeforestation.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">hectares</p>
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            Avg. Annual Loss
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {avgDeforestation.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">hectares/year</p>
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            Temperature Change
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <div className="text-3xl font-bold text-foreground">
              {Number(tempChange) > 0 ? '+' : ''}{tempChange}
            </div>
            <span className="text-sm text-muted-foreground">°C</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {Number(tempChange) > 0 ? (
              <TrendingUp className="h-3 w-3 text-destructive" />
            ) : (
              <TrendingDown className="h-3 w-3 text-green-500" />
            )}
            <p className="text-xs text-muted-foreground">
              {firstTemp.toFixed(1)}°C → {lastTemp.toFixed(1)}°C
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            Precipitation Change
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <div className="text-3xl font-bold text-foreground">
              {Number(precipChange) > 0 ? '+' : ''}{precipChange}
            </div>
            <span className="text-sm text-muted-foreground">%</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {Number(precipChange) > 0 ? (
              <TrendingUp className="h-3 w-3 text-blue-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-orange-500" />
            )}
            <p className="text-xs text-muted-foreground">
              {firstPrecip.toFixed(0)}mm → {lastPrecip.toFixed(0)}mm
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
