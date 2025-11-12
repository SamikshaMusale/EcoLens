import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartTheme } from "@/hooks/useChartTheme";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface LocationData {
  location: string;
  deforestationSeries: Array<{ year: number; hectares_lost: number }>;
}

interface ComparisonDeforestationChartProps {
  locations: LocationData[];
}

const COLORS = [
  { bg: "rgba(46, 125, 50, 0.7)", border: "rgb(46, 125, 50)" },      // Green
  { bg: "rgba(255, 107, 107, 0.7)", border: "rgb(255, 107, 107)" },  // Red
  { bg: "rgba(74, 144, 226, 0.7)", border: "rgb(74, 144, 226)" },    // Blue
];

export const ComparisonDeforestationChart = ({ locations }: ComparisonDeforestationChartProps) => {
  const { textColor, gridColor, tooltipBg, tooltipBorder } = useChartTheme();
  const allYears = locations[0]?.deforestationSeries.map(d => d.year.toString()) || [];
  
  const datasets = locations.map((loc, index) => ({
    label: loc.location,
    data: loc.deforestationSeries.map(d => d.hectares_lost),
    backgroundColor: COLORS[index]?.bg || "rgba(100, 100, 100, 0.7)",
    borderColor: COLORS[index]?.border || "rgb(100, 100, 100)",
    borderWidth: 2,
    borderRadius: 6,
  }));

  const chartData = {
    labels: allYears,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} ha`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          callback: function(value: any) {
            return value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: "Hectares Lost",
          color: textColor,
        }
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

  return (
    <Card className="shadow-card animate-fade-in border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Forest Cover Loss Comparison</CardTitle>
        <CardDescription>Comparative analysis of annual deforestation across locations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
