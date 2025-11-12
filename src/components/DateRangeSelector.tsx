import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface DateRangeSelectorProps {
  startYear: string;
  endYear: string;
  onStartYearChange: (year: string) => void;
  onEndYearChange: (year: string) => void;
}

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2000; year <= currentYear; year++) {
    years.push(year.toString());
  }
  return years.reverse();
};

export const DateRangeSelector = ({
  startYear,
  endYear,
  onStartYearChange,
  onEndYearChange,
}: DateRangeSelectorProps) => {
  const years = generateYears();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="start-year" className="text-foreground font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Start Year
        </Label>
        <Select value={startYear} onValueChange={onStartYearChange}>
          <SelectTrigger id="start-year" className="transition-all focus:shadow-soft">
            <SelectValue placeholder="Select start year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="end-year" className="text-foreground font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          End Year
        </Label>
        <Select value={endYear} onValueChange={onEndYearChange}>
          <SelectTrigger id="end-year" className="transition-all focus:shadow-soft">
            <SelectValue placeholder="Select end year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
