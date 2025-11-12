import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Leaf, 
  Target, 
  Database, 
  TrendingUp, 
  Globe, 
  ArrowLeft,
  Heart,
  Lightbulb,
  Shield
} from "lucide-react";
import logo from "@/assets/logo.svg";

const About = () => {
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
                <p className="text-sm text-muted-foreground">
                  Connecting Climate and Forests
                </p>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              About EcoLens
            </h2>
            <p className="text-lg text-muted-foreground">
              Empowering environmental awareness through data visualization and analysis
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mission Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            </div>
            <Card className="border-border shadow-card">
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  EcoLens is dedicated to making environmental data accessible and understandable 
                  for everyone. We believe that visualizing the relationship between deforestation 
                  and climate change is crucial for raising awareness and driving meaningful action 
                  to protect our planet's ecosystems.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* What We Do */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">What We Do</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border shadow-soft hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Data Integration</h4>
                      <p className="text-sm text-muted-foreground">
                        We aggregate data from trusted sources like Global Forest Watch and 
                        Open-Meteo to provide accurate, up-to-date environmental insights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Visual Analytics</h4>
                      <p className="text-sm text-muted-foreground">
                        Transform complex environmental data into clear, interactive 
                        visualizations that reveal correlations and trends over time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Global Coverage</h4>
                      <p className="text-sm text-muted-foreground">
                        Analyze any location worldwide, from the Amazon rainforest to 
                        Southeast Asian tropical forests.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-soft hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Community Impact</h4>
                      <p className="text-sm text-muted-foreground">
                        Support researchers, educators, and activists with tools to 
                        communicate environmental changes effectively.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Data Sources */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Trusted Data Sources</h3>
            </div>
            <Card className="border-border shadow-card">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Global Forest Watch (GFW)</h4>
                  <p className="text-sm text-muted-foreground">
                    Provides authoritative forest monitoring data, including deforestation 
                    rates and forest cover changes across the globe.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Open-Meteo</h4>
                  <p className="text-sm text-muted-foreground">
                    Offers comprehensive historical weather and climate data, including 
                    temperature and precipitation measurements.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">OpenCage Geocoding</h4>
                  <p className="text-sm text-muted-foreground">
                    Enables accurate location resolution from place names to geographic 
                    coordinates for precise analysis.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA Section */}
          <section className="text-center space-y-6 py-8">
            <h3 className="text-2xl font-bold text-foreground">
              Ready to Explore Environmental Data?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start analyzing deforestation and climate patterns in any location worldwide.
            </p>
            <div className="pt-4">
              <Link to="/">
                <Button size="lg" className="gap-2 shadow-soft hover:shadow-lg transition-all">
                  <Leaf className="h-5 w-5" />
                  Start Analysis
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
