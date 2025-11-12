import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LocationSearch } from "@/components/LocationSearch";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { DeforestationChart } from "@/components/DeforestationChart";
import { ClimateChart } from "@/components/ClimateChart";
import { StatisticsCards } from "@/components/StatisticsCards";
import { DataTable } from "@/components/DataTable";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShareButton } from "@/components/ShareButton";
import { PDFExport } from "@/components/PDFExport";
import { LocationMap } from "@/components/LocationMap";
import { Loader2, Leaf, Trees, Calendar, ArrowDown, ArrowLeft, Info, GitCompare, Sparkles } from "lucide-react";
import forestHero from "@/assets/forest-hero.jpg";
import homepageLogo from "@/assets/homepage-logo.png";
import bg from "@/assets/bg.png";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
interface AnalysisData {
  location: string;
  time_range: string;
  coordinates?: [number, number];
  deforestation_series: Array<{
    year: number;
    hectares_lost: number;
  }>;
  climate_series: Array<{
    year: number;
    avg_temp_c: number;
    total_precip_mm: number;
  }>;
}
const Index = () => {
  const [showHome, setShowHome] = useState(true);
  const [location, setLocation] = useState("");
  const [startYear, setStartYear] = useState("2015");
  const [endYear, setEndYear] = useState("2024");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const {
    toast
  } = useToast();
  const analysisRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollToAnalysis = () => {
    analysisRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  const handleAnalyze = async () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enter a location to analyze",
        variant: "destructive"
      });
      return;
    }
    if (parseInt(startYear) >= parseInt(endYear)) {
      toast({
        title: "Invalid Date Range",
        description: "Start year must be before end year",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke("analyze", {
        body: {
          locationName: location,
          startYear,
          endYear
        }
      });
      if (error) throw error;
      setAnalysisData(data.analysis);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${location} from ${startYear} to ${endYear}`
      });

      // Scroll to results after a brief delay
      setTimeout(scrollToResults, 300);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to complete analysis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background relative">
      {/* Home Landing Page */}
      {showHome && <div className="fixed inset-0 z-40 animate-fade-in">
          {/* Forest Background */}
          <div className="absolute inset-0">
            <img src={forestHero} alt="Forest landscape" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/90" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center space-y-8 max-w-4xl animate-slide-up">
              {/* Logo */}
              <div className="flex justify-center -mb-6">
                <img src={homepageLogo} alt="EcoLens Logo" className="h-28 w-32" />
              </div>

              {/* Title */}
              <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight text-green-900">
                EcoLens
              </h1>
              
              {/* Tagline */}
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                The climate is changing—see how, where, and why.
              </p>

              {/* Description */}
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Track how deforestation fuels temperature rise and disrupts rainfall patterns—see the impact unfold with EcoLens.
              </p>

              {/* CTA Button */}
              <div className="pt-6">
              <Button onClick={() => setShowHome(false)} size="lg" className="gap-3 text-lg px-6 py-4 h-auto shadow-soft hover:shadow-lg hover:scale-105 transition-all duration-300 animate-scale-in">
                <Sparkles className="h-5 w-5" />
                Start Analysis
              </Button>
              </div>
            </div>
          </div>
        </div>}

      {/* Analysis Dashboard */}
      <div className={showHome ? "hidden" : "animate-fade-in"}>
        {/* Hero Section */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                <img src={bg} alt="EcoLens Logo" className="h-18 w-18" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">EcoLens</h1>
                <p className="text-sm text-muted-foreground">
                  Connecting Climate and Forests
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/about">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Info className="h-4 w-4" />
                  About
                </Button>
              </Link>
              <Link to="/compare">
                <Button variant="ghost" size="sm" className="gap-2">
                  <GitCompare className="h-4 w-4" />
                  Compare
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Analysis Form */}
        <div ref={analysisRef} className="mx-auto max-w-4xl space-y-8 scroll-mt-24">
          <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Analyze Location</h2>
              <p className="text-sm text-muted-foreground">
                Enter a location and time range to see how deforestation correlates with climate
                patterns
              </p>
            </div>

            <div className="space-y-6">
              <LocationSearch value={location} onChange={setLocation} />
              <DateRangeSelector startYear={startYear} endYear={endYear} onStartYearChange={setStartYear} onEndYearChange={setEndYear} />

              <Button onClick={handleAnalyze} disabled={loading} className="w-full shadow-soft transition-all hover:shadow-lg" size="lg">
                {loading ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </> : "Analyze"}
              </Button>
            </div>
          </div>

          {/* Results */}
          {analysisData && <div ref={resultsRef} className="space-y-8 animate-fade-in scroll-mt-24">
              {/* Location Header */}
              <div className="rounded-xl border border-border bg-gradient-to-br from-card via-card to-muted/20 p-6 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Analysis Results</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Leaf className="h-4 w-4" />
                      <p className="text-sm font-medium">{analysisData.location}</p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      <p className="text-sm">{analysisData.time_range}</p>
                    </div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Trees className="h-7 w-7 text-primary" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <ShareButton location={analysisData.location} timeRange={analysisData.time_range} />
                <PDFExport location={analysisData.location} timeRange={analysisData.time_range} />
              </div>

              {/* Key Statistics */}
              <div data-stats-cards>
                <StatisticsCards deforestationSeries={analysisData.deforestation_series} climateSeries={analysisData.climate_series} />
              </div>

              {/* Interactive Map */}
              {analysisData.coordinates && <LocationMap location={analysisData.location} coordinates={analysisData.coordinates} stats={{
              avgTemp: analysisData.climate_series.reduce((sum, d) => sum + d.avg_temp_c, 0) / analysisData.climate_series.length,
              totalRainfall: analysisData.climate_series.reduce((sum, d) => sum + d.total_precip_mm, 0),
              annualDeforestation: analysisData.deforestation_series.reduce((sum, d) => sum + d.hectares_lost, 0) / analysisData.deforestation_series.length
            }} />}

              {/* Charts Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Visual Analysis</h3>
                <div data-charts className="grid gap-6 lg:grid-cols-2">
                  <DeforestationChart data={analysisData.deforestation_series} />
                  <ClimateChart data={analysisData.climate_series} />
                </div>
              </div>

              {/* Detailed Statistics Table */}
              <div data-table>
                <DataTable deforestationSeries={analysisData.deforestation_series} climateSeries={analysisData.climate_series} location={analysisData.location} />
              </div>

              {/* Correlation Insight */}
              <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent shadow-soft">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Correlation Insight</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The data shows how forest loss trends correspond with climate changes over time. 
                        Rising temperatures and changing precipitation patterns often correlate with increased 
                        deforestation, creating a feedback loop that can accelerate environmental degradation. 
                        Compare the statistical changes above with the visual trends in the charts to understand 
                        the full impact.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>}
        </div>
      </main>

        <Footer />
      </div>
    </div>;
};
export default Index;