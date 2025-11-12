import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChartTheme } from "@/hooks/useChartTheme";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LocationData {
  location: string;
  climateSeries: Array<{ year: number; avg_temp_c: number; total_precip_mm: number }>;
}

interface ComparisonClimateChartProps {
  locations: LocationData[];
}

const COLORS = [
  "rgb(46, 125, 50)",      // Green
  "rgb(255, 107, 107)",    // Red
  "rgb(74, 144, 226)",     // Blue
];

export const ComparisonClimateChart = ({ locations }: ComparisonClimateChartProps) => {
  const { textColor, gridColor, tooltipBg, tooltipBorder } = useChartTheme();
  const allYears = locations[0]?.climateSeries.map(d => d.year.toString()) || [];
  
  // Temperature datasets
  const tempDatasets = locations.map((loc, index) => ({
    label: loc.location,
    data: loc.climateSeries.map(d => d.avg_temp_c),
    borderColor: COLORS[index] || "rgb(100, 100, 100)",
    backgroundColor: `${COLORS[index] || "rgb(100, 100, 100)"}33`,
    tension: 0.3,
    pointRadius: 4,
    pointHoverRadius: 6,
  }));

  // Precipitation datasets
  const precipDatasets = locations.map((loc, index) => ({
    label: loc.location,
    data: loc.climateSeries.map(d => d.total_precip_mm),
    borderColor: COLORS[index] || "rgb(100, 100, 100)",
    backgroundColor: `${COLORS[index] || "rgb(100, 100, 100)"}33`,
    tension: 0.3,
    pointRadius: 4,
    pointHoverRadius: 6,
  }));

  const tempChartData = {
    labels: allYears,
    datasets: tempDatasets,
  };

  const precipChartData = {
    labels: allYears,
    datasets: precipDatasets,
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "system-ui",
            size: 12,
          },
          color: textColor,
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  };

  const tempOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        title: {
          display: true,
          text: "Temperature (°C)",
          color: textColor,
        },
      },
    },
  };

  const precipOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        beginAtZero: true,
        title: {
          display: true,
          text: "Precipitation (mm)",
          color: textColor,
        },
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: function(value: any) {
            return value.toLocaleString();
          }
        },
      },
    },
  };

  return (
    <Card className="shadow-card animate-fade-in border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Climate Trends Comparison</CardTitle>
        <CardDescription>Comparative analysis of temperature and precipitation patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
          </TabsList>
          <TabsContent value="temperature">
            <div className="h-[400px]">
              <Line data={tempChartData} options={tempOptions} />
            </div>
          </TabsContent>
          <TabsContent value="precipitation">
            <div className="h-[400px]">
              <Line data={precipChartData} options={precipOptions} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
