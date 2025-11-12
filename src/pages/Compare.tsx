import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LocationSearch } from "@/components/LocationSearch";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { ComparisonDeforestationChart } from "@/components/ComparisonDeforestationChart";
import { ComparisonClimateChart } from "@/components/ComparisonClimateChart";
import { ComparisonSummaryStats } from "@/components/ComparisonSummaryStats";
import { LocationMap } from "@/components/LocationMap";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, Leaf, ArrowLeft, Plus, X, Download, Share2, Check } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationData {
  id: string;
  location: string;
  timeRange: string;
  coordinates?: [number, number];
  deforestationSeries: Array<{ year: number; hectares_lost: number }>;
  climateSeries: Array<{ year: number; avg_temp_c: number; total_precip_mm: number }>;
}

const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [startYear, setStartYear] = useState("2015");
  const [endYear, setEndYear] = useState("2024");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load comparison from URL on mount
  useEffect(() => {
    const urlLocations = searchParams.get('locations');
    const urlStartYear = searchParams.get('start');
    const urlEndYear = searchParams.get('end');

    if (urlStartYear) setStartYear(urlStartYear);
    if (urlEndYear) setEndYear(urlEndYear);

    if (urlLocations) {
      const locationNames = urlLocations.split(',');
      locationNames.forEach(async (name) => {
        if (name.trim()) {
          await loadLocationData(name.trim());
        }
      });
    }
  }, []);

  // Update URL when locations change
  useEffect(() => {
    if (locations.length > 0) {
      const params = new URLSearchParams();
      params.set('locations', locations.map(l => l.location).join(','));
      params.set('start', startYear);
      params.set('end', endYear);
      setSearchParams(params, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [locations, startYear, endYear]);

  const loadLocationData = async (locationName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("analyze", {
        body: {
          locationName,
          startYear,
          endYear,
        },
      });

      if (error) throw error;

      const newLocation: LocationData = {
        id: Math.random().toString(36).substr(2, 9),
        location: data.analysis.location,
        timeRange: data.analysis.time_range,
        coordinates: data.analysis.coordinates,
        deforestationSeries: data.analysis.deforestation_series,
        climateSeries: data.analysis.climate_series,
      };

      setLocations(prev => {
        if (prev.some(l => l.location === newLocation.location)) {
          return prev;
        }
        return [...prev, newLocation];
      });
    } catch (error) {
      console.error("Failed to load location:", error);
    }
  };

  const handleAddLocation = async () => {
    if (!currentLocation) {
      toast({
        title: "Location Required",
        description: "Please enter a location to analyze",
        variant: "destructive",
      });
      return;
    }

    if (locations.length >= 3) {
      toast({
        title: "Maximum Locations",
        description: "You can compare up to 3 locations at once",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(startYear) >= parseInt(endYear)) {
      toast({
        title: "Invalid Date Range",
        description: "Start year must be before end year",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze", {
        body: {
          locationName: currentLocation,
          startYear,
          endYear,
        },
      });

      if (error) throw error;

      const newLocation: LocationData = {
        id: Math.random().toString(36).substr(2, 9),
        location: data.analysis.location,
        timeRange: data.analysis.time_range,
        coordinates: data.analysis.coordinates,
        deforestationSeries: data.analysis.deforestation_series,
        climateSeries: data.analysis.climate_series,
      };

      setLocations([...locations, newLocation]);
      setCurrentLocation("");
      
      toast({
        title: "Location Added",
        description: `${currentLocation} has been added to comparison`,
      });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to complete analysis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeLocation = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
    toast({
      title: "Location Removed",
      description: "Location has been removed from comparison",
    });
  };

  const downloadComparisonCSV = () => {
    if (locations.length === 0) return;

    const headers = ["Year"];
    locations.forEach(loc => {
      headers.push(`${loc.location} - Forest Loss (ha)`);
      headers.push(`${loc.location} - Avg Temp (°C)`);
      headers.push(`${loc.location} - Precipitation (mm)`);
    });

    const years = locations[0].deforestationSeries.map(d => d.year);
    const rows = years.map((year, yearIndex) => {
      const row: (string | number)[] = [year];
      locations.forEach(loc => {
        const deforest = loc.deforestationSeries[yearIndex];
        const climate = loc.climateSeries[yearIndex];
        row.push(deforest?.hectares_lost ?? 0);
        row.push(climate?.avg_temp_c.toFixed(1) ?? '0');
        row.push(climate?.total_precip_mm.toLocaleString() ?? '0');
      });
      return row;
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecolens-comparison-${locations.length}-locations.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const shareComparison = async () => {
    const url = window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "Shareable comparison link copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background">
                <img src={logo} alt="EcoLens Logo" className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">EcoLens</h1>
                <p className="text-sm text-muted-foreground">Compare Locations</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Add Location Form */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle>Add Location to Compare</CardTitle>
              <CardDescription>
                Add up to 3 locations to compare their deforestation and climate trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <LocationSearch value={currentLocation} onChange={setCurrentLocation} />
              <DateRangeSelector
                startYear={startYear}
                endYear={endYear}
                onStartYearChange={setStartYear}
                onEndYearChange={setEndYear}
              />
              <Button
                onClick={handleAddLocation}
                disabled={loading || locations.length >= 3}
                className="w-full shadow-soft transition-all hover:shadow-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Location ({locations.length}/3)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Added Locations */}
          {locations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Locations in Comparison</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {locations.map((loc, index) => (
                  <Card key={loc.id} className="border-border shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: ["#2E7D32", "#FF6B6B", "#4A90E2"][index],
                            }}
                          />
                          <h4 className="font-semibold text-foreground">{loc.location}</h4>
                          <p className="text-xs text-muted-foreground">{loc.timeRange}</p>
                        </div>
                        <Button
                          onClick={() => removeLocation(loc.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Charts */}
          {locations.length > 0 && (
            <div ref={resultsRef} className="space-y-8 animate-fade-in scroll-mt-24">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-2xl font-bold text-foreground">Comparison Results</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={shareComparison}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        Share Comparison
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={downloadComparisonCSV}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Data
                  </Button>
                </div>
              </div>

              <ComparisonSummaryStats locations={locations} />

              {/* Comparison Map */}
              <LocationMap 
                locations={locations
                  .filter(loc => loc.coordinates)
                  .map((loc, index) => ({
                    name: loc.location,
                    coordinates: loc.coordinates!,
                    stats: {
                      avgTemp: loc.climateSeries.reduce((sum, d) => sum + d.avg_temp_c, 0) / loc.climateSeries.length,
                      totalRainfall: loc.climateSeries.reduce((sum, d) => sum + d.total_precip_mm, 0),
                      annualDeforestation: loc.deforestationSeries.reduce((sum, d) => sum + d.hectares_lost, 0) / loc.deforestationSeries.length,
                    }
                  }))}
              />
              
              <div className="space-y-6">
                <ComparisonDeforestationChart
                  locations={locations.map(loc => ({
                    location: loc.location,
                    deforestationSeries: loc.deforestationSeries,
                  }))}
                />

                <ComparisonClimateChart 
                  locations={locations.map(loc => ({
                    location: loc.location,
                    climateSeries: loc.climateSeries,
                  }))}
                />

                {/* Summary Insights */}
                <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Leaf className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Comparison Insights</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Comparing {locations.length} locations reveals different patterns of deforestation 
                          and climate change. Use the overlaid charts above to identify correlations and 
                          divergences in environmental trends across regions. Areas with higher deforestation 
                          often show more pronounced climate shifts over the same time period.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Compare;
