
import { useState, useRef } from "react";
import { Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff"
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`RailReserve-Ticket-${booking.pnr}.pdf`);
        
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
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
          <FileText className="w-4 h-4 mr-2" />
        )}
        E-Ticket
      </button>

      {/* Hidden ticket template that will be converted to PDF */}
      <div className="hidden">
        <div 
          ref={ticketRef} 
          className="w-[800px] p-8 bg-white text-gray-800 font-sans"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {/* Ticket Header - Using solid background instead of gradient */}
          <div className="bg-railway-600 text-white rounded-t-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">RailReserve</h1>
                <p className="text-sm opacity-90">E-Ticket / Reservation Voucher</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Booking Date</p>
                <p className="font-semibold">{formatDate(booking.bookingDate || new Date().toISOString())}</p>
              </div>
            </div>
          </div>

          {/* PNR and Status */}
          <div className="bg-railway-50 p-4 border-b border-railway-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">PNR Number</p>
              <p className="text-xl font-bold text-railway-700">{booking.pnr}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                booking.status === 'waitlisted' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {booking.status === 'confirmed' ? 'CONFIRMED' : 
                 booking.status === 'waitlisted' ? 'WAITLISTED' : 'CANCELLED'}
              </span>
            </div>
          </div>

          {/* Train Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-railway-700">Train Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Train Number & Name</p>
                <p className="font-semibold">{train.number} - {train.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Journey Date</p>
                <p className="font-semibold">{formatDate(booking.journeyDate || booking.date)}</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-500">From</p>
                <p className="font-semibold">{train.source}</p>
                <p className="text-sm font-medium">{train.departureTime}</p>
              </div>
              
              <div className="flex-1 flex items-center justify-center px-4">
                <div className="relative w-full flex items-center justify-center">
                  <div className="w-full h-0.5 bg-railway-200"></div>
                  <div className="absolute -left-1 w-3 h-3 rounded-full bg-railway-600"></div>
                  <div className="absolute -right-1 w-3 h-3 rounded-full bg-railway-600"></div>
                  <div className="absolute bg-white px-2 text-xs text-gray-500">
                    {train.duration} • {train.distance} km
                  </div>
                </div>
              </div>
              
              <div className="flex-1 text-right">
                <p className="text-sm text-gray-500">To</p>
                <p className="font-semibold">{train.destination}</p>
                <p className="text-sm font-medium">{train.arrivalTime}</p>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-railway-700">Passenger Details</h2>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {booking.passengers.map((p: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{i+1}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{p.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{p.age} yrs</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{p.gender}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{p.seatNumber || 'To be allocated'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fare Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-railway-700">Fare Details</h2>
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Class</span>
                <span className="font-medium">
                  {booking.seatClass === 'sleeper' ? 'Sleeper' :
                  booking.seatClass === 'ac3Tier' ? 'AC 3 Tier' :
                  booking.seatClass === 'ac2Tier' ? 'AC 2 Tier' : 'AC First Class'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Base Fare</span>
                <span className="font-medium">₹{(booking.totalFare * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax (GST)</span>
                <span className="font-medium">₹{(booking.totalFare * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
                <span className="text-gray-800 font-bold">Total Fare</span>
                <span className="text-railway-700 font-bold">₹{booking.totalFare.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="p-6 bg-yellow-50 rounded-b-lg">
            <h2 className="text-lg font-bold mb-2 text-yellow-800">Important Information</h2>
            <ul className="list-disc pl-5 text-sm text-yellow-800 space-y-1">
              <li>Please carry a valid photo ID proof during the journey.</li>
              <li>Reach the station at least 30 minutes before the scheduled departure.</li>
              <li>This is a computer-generated ticket and does not require signature.</li>
              <li>Smoking and carrying inflammable items is strictly prohibited.</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Thank you for choosing RailReserve for your journey.</p>
            <p>For any assistance, please contact our 24/7 helpline: 1800-XXX-XXXX</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketDownload;
