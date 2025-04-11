
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import TicketTemplate from "./TicketTemplate";
import TicketButton from "./TicketButton";
import { generatePDF } from "@/utils/pdfUtils";

interface TicketDownloadProps {
  booking: any;
  train: any;
}

const TicketDownload = ({ booking, train }: TicketDownloadProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownloadTicket = async () => {
    setIsGenerating(true);
    
    try {
      if (ticketRef.current) {
        await generatePDF(
          ticketRef.current,
          `RailReserve-Ticket-${booking.pnr}.pdf`,
          {
            format: 'a4',
            orientation: 'portrait',
            quality: 0.95,
            scale: 2
          }
        );
        
        toast({
          title: "Ticket downloaded",
          description: "Your e-ticket has been downloaded as PDF.",
        });
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating your ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <TicketButton 
        isGenerating={isGenerating}
        disabled={booking.status === 'cancelled'}
        onClick={handleDownloadTicket}
      />

      {/* Hidden ticket template that will be converted to PDF */}
      <div className="hidden">
        <TicketTemplate ref={ticketRef} booking={booking} train={train} />
      </div>
    </>
  );
};

export default TicketDownload;
