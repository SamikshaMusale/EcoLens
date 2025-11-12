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
import { useChartTheme } from "@/hooks/useChartTheme";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ClimateData {
  year: number;
  avg_temp_c: number;
  total_precip_mm: number;
}

interface ClimateChartProps {
  data: ClimateData[];
}

export const ClimateChart = ({ data }: ClimateChartProps) => {
  const { textColor, gridColor, tooltipBg, tooltipBorder } = useChartTheme();

  const chartData = {
    labels: data.map((d) => d.year.toString()),
    datasets: [
      {
        label: "Avg Temperature (°C)",
        data: data.map((d) => d.avg_temp_c),
        borderColor: "hsl(0 84.2% 60.2%)",
        backgroundColor: "hsl(0 84.2% 60.2% / 0.1)",
        yAxisID: "y",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Total Precipitation (mm)",
        data: data.map((d) => d.total_precip_mm),
        borderColor: "hsl(200 90% 50%)",
        backgroundColor: "hsl(200 90% 50% / 0.1)",
        yAxisID: "y1",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
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
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Temperature (°C)",
          color: "hsl(0 84.2% 60.2%)",
        },
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Precipitation (mm)",
          color: "hsl(200 90% 50%)",
        },
        grid: {
          drawOnChartArea: false,
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

  return (
    <Card className="shadow-card animate-fade-in border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Climate Trends</CardTitle>
        <CardDescription>Annual temperature and precipitation patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
