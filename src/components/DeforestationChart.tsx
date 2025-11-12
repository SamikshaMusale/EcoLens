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

interface DeforestationData {
  year: number;
  hectares_lost: number;
}

interface DeforestationChartProps {
  data: DeforestationData[];
}

export const DeforestationChart = ({ data }: DeforestationChartProps) => {
  const { textColor, gridColor, tooltipBg, tooltipBorder } = useChartTheme();

  const chartData = {
    labels: data.map((d) => d.year.toString()),
    datasets: [
      {
        label: "Hectares Lost",
        data: data.map((d) => d.hectares_lost),
        backgroundColor: "hsl(142 76% 36% / 0.7)",
        borderColor: "hsl(142 76% 36%)",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
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
        displayColors: false,
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
        <CardTitle className="text-foreground">Forest Cover Loss</CardTitle>
        <CardDescription>Annual deforestation in hectares</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
