
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomButton } from "@/components/ui/custom-button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, CreditCard, Ticket, Search, Download, Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { getUserPayments, clearAllData, createDummyBooking, simulateSuccessfulPayment } from "@/utils/events";

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Load transactions when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || "demo@example.com");
    
    if (token) {
      fetchPaymentHistory(token);
    } else {
      // Use localStorage data when no token is available
      loadLocalPayments();
    }
    
    // Listen for payment updates
    window.addEventListener("payment_completed", handlePaymentUpdate);
    
    return () => {
      window.removeEventListener("payment_completed", handlePaymentUpdate);
    };
  }, []);
  
  const handlePaymentUpdate = () => {
    console.log("Payment update event detected");
    const token = localStorage.getItem("token");
    if (token) {
      fetchPaymentHistory(token);
    } else {
      loadLocalPayments();
    }
  };
  
  const fetchPaymentHistory = async (token: string) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get('/api/payments/my-payments', config);
      
      if (response.data.success) {
        const formattedTransactions = response.data.data.map((payment: any) => ({
          id: payment.transactionId,
          date: new Date(payment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          amount: payment.amount,
          status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
          type: "Train Ticket",
          reference: payment.bookingId?.pnr || 'N/A'
        }));
        
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast({
        title: "Failed to load payment history",
        description: "Using local payment data instead",
      });
      // Fall back to local payment data
      loadLocalPayments();
    } finally {
      setLoading(false);
    }
  };
  
  const loadLocalPayments = () => {
    // Get payments directly from localStorage
    setLoading(true);
    const payments = getUserPayments();
    console.log("Loaded local payments:", payments.length);
    
    // Sort payments by timestamp (newest first)
    const sortedPayments = [...payments].sort((a, b) => {
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
    
    setTransactions(sortedPayments);
    setLoading(false);
  };

  const handleDownloadReceipt = (transaction: any) => {
    // In a real implementation, this would generate and download a PDF receipt
    // For now, we'll create a simple text receipt as a downloadable file
    const receiptContent = `
    ----- RAILRESERVE PAYMENT RECEIPT -----
    Transaction ID: ${transaction.id}
    Date: ${transaction.date}
    Amount: ₹${transaction.amount.toFixed(2)}
    Status: ${transaction.status}
    Type: ${transaction.type}
    Reference (PNR): ${transaction.reference}
    
    Thank you for choosing RailReserve!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt downloaded",
      description: `Receipt for transaction ${transaction.id} has been downloaded.`,
    });
  };
  
  // FOR TESTING ONLY: Creates a dummy booking for testing
  const handleCreateDummyBooking = () => {
    const dummyBooking = createDummyBooking();
    simulateSuccessfulPayment(dummyBooking);
    toast({
      title: "Test Booking Created",
      description: "A dummy booking has been added with a payment record",
    });
    loadLocalPayments(); // Refresh the payments list
  };
  
  // FOR TESTING ONLY: Clears all data from localStorage
  const handleClearData = () => {
    clearAllData();
    toast({
      title: "Data Cleared",
      description: "All bookings and payments have been cleared",
    });
    loadLocalPayments(); // Refresh the payments list
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="glass sticky top-20">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-railway-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-railway-600" />
                  </div>
                  <div>
                    <CardTitle>{userEmail ? userEmail.split('@')[0] : 'Guest'}</CardTitle>
                    <CardDescription>{userEmail || 'Not logged in'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link to="/dashboard" className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <Ticket className="h-5 w-5" />
                    <span>My Bookings</span>
                  </Link>
                  <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link to="/pnr" className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <Search className="h-5 w-5" />
                    <span>PNR Status</span>
                  </Link>
                  <Link to="/payment" className="flex items-center space-x-2 p-2 rounded-md bg-railway-50 text-railway-700">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment History</span>
                  </Link>
                </nav>
                
                {/* Testing Controls - REMOVE IN PRODUCTION */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Testing Options:</p>
                  <div className="space-y-2">
                    <CustomButton 
                      onClick={handleCreateDummyBooking}
                      variant="outline"
                      className="w-full text-sm"
                    >
                      Create Test Payment
                    </CustomButton>
                    <CustomButton 
                      onClick={handleClearData}
                      variant="outline" 
                      className="w-full text-sm text-red-500"
                    >
                      Clear All Data
                    </CustomButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Payment History</h1>
              <p className="text-gray-600">View and manage your past transactions</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  A history of your payments and refunds
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-10 h-10 border-4 border-t-railway-600 border-railway-200 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1 text-gray-400" />
                                {transaction.date}
                              </div>
                            </TableCell>
                            <TableCell>{transaction.id}</TableCell>
                            <TableCell>{transaction.reference}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell className="font-medium">₹{transaction.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {transaction.status === "Completed" ? (
                                  <CheckCircle size={14} className="mr-1 text-green-500" />
                                ) : (
                                  <XCircle size={14} className="mr-1 text-red-500" />
                                )}
                                {transaction.status}
                              </div>
                            </TableCell>
                            <TableCell>
                              <button 
                                className="text-railway-600 hover:text-railway-800 flex items-center"
                                onClick={() => handleDownloadReceipt(transaction)}
                              >
                                <Download size={14} className="mr-1" />
                                <span className="text-xs">Receipt</span>
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentHistory;
