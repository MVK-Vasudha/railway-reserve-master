
import { useState, useRef } from "react";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PaymentReceiptProps {
  transaction: {
    id: string;
    date: string;
    amount: number;
    status: string;
    type: string;
    reference: string;
  };
}

const PaymentReceipt = ({ transaction }: PaymentReceiptProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownloadReceipt = async () => {
    setIsGenerating(true);
    
    try {
      if (receiptRef.current) {
        // Add a small delay to ensure DOM is fully rendered
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff",
          allowTaint: false,
          removeContainer: true
        });
        
        // Create PDF with specific dimensions
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a5',
          compress: true
        });
        
        const imgWidth = 148; // A5 width
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Convert canvas to data URL with JPEG format instead of PNG
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save(`RailReserve-Receipt-${transaction.id}.pdf`);
        
        toast({
          title: "Receipt downloaded",
          description: "Your receipt has been downloaded as PDF.",
        });
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating your receipt. Please try again.",
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
        className="text-railway-600 hover:text-railway-800 flex items-center"
        onClick={handleDownloadReceipt}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <div className="w-3 h-3 border-2 border-t-railway-600 border-railway-200 rounded-full animate-spin mr-1"></div>
        ) : (
          <Download size={14} className="mr-1" />
        )}
        <span className="text-xs">Receipt</span>
      </button>

      {/* Hidden receipt template that will be converted to PDF */}
      <div className="hidden">
        <div 
          ref={receiptRef} 
          className="w-[600px] p-6 bg-white text-gray-800 font-sans"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {/* Receipt Header - Using solid background instead of gradient */}
          <div className="bg-railway-700 text-white rounded-t-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">RailReserve</h1>
                <p className="text-sm opacity-90">Payment Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Transaction Date</p>
                <p className="font-semibold">{transaction.date}</p>
              </div>
            </div>
          </div>

          {/* Transaction ID and Status */}
          <div className="bg-railway-50 p-4 border-b border-railway-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="text-md font-bold text-railway-700">{transaction.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                transaction.status === "Completed" ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {transaction.status}
              </span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-md font-bold mb-3 text-railway-700">Payment Details</h2>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Payment Type</span>
              <span className="font-medium">{transaction.type}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Reference (PNR)</span>
              <span className="font-medium">{transaction.reference}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">Credit/Debit Card</span>
            </div>
          </div>

          {/* Fare Details */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-md font-bold mb-3 text-railway-700">Amount</h2>
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Base Fare</span>
                <span className="font-medium">₹{(transaction.amount * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax (GST)</span>
                <span className="font-medium">₹{(transaction.amount * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
                <span className="text-gray-800 font-bold">Total Amount</span>
                <span className="text-railway-700 font-bold">₹{transaction.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Generated on</p>
                <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Customer Support</p>
                <p className="text-sm font-medium">1800-XXX-XXXX</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>This is an electronically generated receipt and does not require signature.</p>
              <p className="mt-1">Thank you for choosing RailReserve for your journey.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentReceipt;
