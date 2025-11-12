import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PDFExportProps {
  location: string;
  timeRange: string;
}

export function PDFExport({ location, timeRange }: PDFExportProps) {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(46, 125, 50);
      pdf.text("EcoLens Analysis Report", pageWidth / 2, 20, { align: "center" });
      
      // Location and date
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Location: ${location}`, 20, 35);
      pdf.text(`Time Range: ${timeRange}`, 20, 42);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 49);
      
      let yPosition = 60;

      // Capture statistics cards
      const statsElement = document.querySelector('[data-stats-cards]');
      if (statsElement) {
        const canvas = await html2canvas(statsElement as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (yPosition + imgHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }

      // Capture charts
      const chartsElement = document.querySelector('[data-charts]');
      if (chartsElement) {
        if (yPosition + 80 > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        
        const canvas = await html2canvas(chartsElement as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }

      // Capture data table
      const tableElement = document.querySelector('[data-table]');
      if (tableElement) {
        pdf.addPage();
        const canvas = await html2canvas(tableElement as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
      }

      // Footer
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `EcoLens - Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      pdf.save(`ecolens-${location.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-report.pdf`);
      
      toast({
        title: "PDF Exported!",
        description: "Your analysis report has been downloaded",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToPDF}
      disabled={exporting}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Export PDF
        </>
      )}
    </Button>
  );
}
