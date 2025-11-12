import { useTheme } from "@/components/ThemeProvider";

export const useChartTheme = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return {
    textColor: isDark ? "hsl(0 0% 95%)" : "hsl(140 20% 15%)",
    gridColor: isDark ? "hsl(140 20% 18%)" : "hsl(140 15% 88%)",
    tooltipBg: isDark ? "hsl(140 20% 10%)" : "hsl(0 0% 100%)",
    tooltipBorder: isDark ? "hsl(140 20% 18%)" : "hsl(140 15% 88%)",
  };
};
