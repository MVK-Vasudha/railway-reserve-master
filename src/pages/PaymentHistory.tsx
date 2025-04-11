import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomButton } from "@/components/ui/custom-button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, CreditCard, Ticket, Search, Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { getUserPayments, clearAllData, createDummyBooking, simulateSuccessfulPayment } from "@/utils/events";
import PaymentReceipt from "@/components/payment/PaymentReceipt";

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || "demo@example.com");
    
    if (token) {
      fetchPaymentHistory(token);
    } else {
      loadLocalPayments();
    }
    
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
      loadLocalPayments();
    } finally {
      setLoading(false);
    }
  };
  
  const loadLocalPayments = () => {
    setLoading(true);
    const payments = getUserPayments();
    console.log("Loaded local payments:", payments.length);
    
    const sortedPayments = [...payments].sort((a, b) => {
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
    
    setTransactions(sortedPayments);
    setLoading(false);
  };

  const handleCreateDummyBooking = () => {
    const dummyBooking = createDummyBooking();
    simulateSuccessfulPayment(dummyBooking);
    toast({
      title: "Test Booking Created",
      description: "A dummy booking has been added with a payment record",
    });
    loadLocalPayments();
  };

  const handleClearData = () => {
    clearAllData();
    toast({
      title: "Data Cleared",
      description: "All bookings and payments have been cleared",
    });
    loadLocalPayments();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                              <PaymentReceipt transaction={transaction} />
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
