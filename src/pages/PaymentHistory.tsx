
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, CreditCard, Ticket, Search, Download, Calendar, CheckCircle, XCircle } from "lucide-react";
import { mockBookings, formatPrice } from "@/utils/mockData";

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Load transactions when component mounts
  useEffect(() => {
    loadTransactions();
    
    // Get user email from localStorage
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
    
    // Listen for payment updates
    window.addEventListener("payment_completed", loadTransactions);
    
    return () => {
      window.removeEventListener("payment_completed", loadTransactions);
    };
  }, []);
  
  const loadTransactions = () => {
    // Format transactions based on bookings for demonstration
    const formattedTransactions = mockBookings.map(booking => ({
      id: `TXN-${Math.floor(Math.random() * 1000000)}`,
      date: booking.journeyDate, 
      amount: booking.totalFare,
      status: "Completed",
      type: "Train Ticket",
      reference: booking.pnr
    }));
    
    setTransactions(formattedTransactions);
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
                          <TableCell className="font-medium">{formatPrice(transaction.amount)}</TableCell>
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
                            <button className="text-railway-600 hover:text-railway-800 flex items-center">
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
