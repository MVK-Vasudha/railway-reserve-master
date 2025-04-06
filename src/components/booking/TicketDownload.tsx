
import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TicketDownloadProps {
  booking: any;
  train: any;
}

const TicketDownload = ({ booking, train }: TicketDownloadProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadTicket = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        // Generate ticket content
        const ticketContent = generateTicketContent(booking, train);
        
        // Create downloadable file
        const blob = new Blob([ticketContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ticket-${booking.pnr}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Ticket downloaded",
          description: "Your e-ticket has been downloaded successfully.",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "There was an error generating your ticket. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  const generateTicketContent = (booking: any, train: any) => {
    return `
==============================================
             RAILRESERVE E-TICKET             
==============================================

PNR NUMBER: ${booking.pnr}
BOOKING DATE: ${booking.bookingDate || new Date().toLocaleDateString()}
JOURNEY DATE: ${booking.journeyDate || booking.date || 'Not specified'}

TRAIN DETAILS:
  ${train.number} - ${train.name}
  From: ${train.source}
  To: ${train.destination}
  Departure: ${train.departureTime} (${booking.journeyDate || booking.date || 'Not specified'})
  Arrival: ${train.arrivalTime}
  Duration: ${train.duration}
  Distance: ${train.distance} km

CLASS: ${booking.seatClass === 'sleeper' ? 'Sleeper' :
       booking.seatClass === 'ac3Tier' ? 'AC 3 Tier' :
       booking.seatClass === 'ac2Tier' ? 'AC 2 Tier' : 'AC First Class'}

PASSENGER DETAILS:
${booking.passengers.map((p: any, i: number) => 
`  ${i+1}. ${p.name} (${p.age} yrs, ${p.gender})
     Seat: ${p.seatNumber || 'To be allocated'}`).join('\n')}

FARE DETAILS:
  Base Fare: ₹${(booking.totalFare * 0.9).toFixed(2)}
  Tax (GST): ₹${(booking.totalFare * 0.1).toFixed(2)}
  Total Fare: ₹${booking.totalFare.toFixed(2)}

STATUS: ${booking.status === 'confirmed' ? 'CONFIRMED' : 
         booking.status === 'waitlisted' ? 'WAITLISTED' : 'CANCELLED'}

==============================================
Important:
1. Please carry a valid ID proof during the journey.
2. Reach the station at least 30 minutes before departure.
3. This is a computer-generated ticket and does not require signature.
==============================================
    `;
  };

  return (
    <button
      onClick={handleDownloadTicket}
      disabled={isGenerating || booking.status === 'cancelled'}
      className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
        booking.status === 'cancelled' 
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
          : 'bg-railway-50 text-railway-700 hover:bg-railway-100'
      }`}
    >
      {isGenerating ? (
        <div className="w-4 h-4 border-2 border-t-railway-600 border-railway-200 rounded-full animate-spin mr-2"></div>
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      E-Ticket
    </button>
  );
};

export default TicketDownload;
