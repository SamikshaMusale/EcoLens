import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DataTableProps {
  deforestationSeries: Array<{ year: number; hectares_lost: number }>;
  climateSeries: Array<{ year: number; avg_temp_c: number; total_precip_mm: number }>;
  location: string;
}

export const DataTable = ({ deforestationSeries, climateSeries, location }: DataTableProps) => {
  const downloadCSV = () => {
    const headers = ["Year", "Forest Loss (ha)", "Avg Temp (°C)", "Precipitation (mm)"];
    const rows = deforestationSeries.map((deforest, idx) => {
      const climate = climateSeries[idx];
      return [
        deforest.year,
        deforest.hectares_lost,
        climate?.avg_temp_c.toFixed(1) || 'N/A',
        climate?.total_precip_mm.toLocaleString() || 'N/A'
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecolens-${location.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Year-by-Year Data</h3>
        <Button onClick={downloadCSV} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>
      <Card className="border-border shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Year</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Forest Loss (ha)</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Avg Temp (°C)</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Precipitation (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deforestationSeries.map((deforest, idx) => {
                  const climate = climateSeries[idx];
                  return (
                    <tr key={deforest.year} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{deforest.year}</td>
                      <td className="px-6 py-4 text-sm text-right text-muted-foreground">
                        {deforest.hectares_lost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-muted-foreground">
                        {climate?.avg_temp_c.toFixed(1) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-muted-foreground">
                        {climate?.total_precip_mm.toLocaleString() || 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
