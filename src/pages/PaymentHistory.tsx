import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { CustomButton } from "@/components/ui/custom-button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  User, CreditCard, Ticket, Search, Download, Calendar, CheckCircle, XCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  getUserPayments, clearAllData, createDummyBooking, simulateSuccessfulPayment
} from "@/utils/events";

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
        const formatted = response.data.data.map((p: any) => ({
          id: p.transactionId,
          date: new Date(p.createdAt).toLocaleDateString(),
          amount: p.amount,
          status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
          type: "Train Ticket",
          reference: p.bookingId?.pnr || 'N/A'
        }));
        setTransactions(formatted);
      }
    } catch (error) {
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
    const sorted = [...payments].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    setTransactions(sorted);
    setLoading(false);
  };

  const handleDownloadReceipt = async (transaction: any) => {
    const div = document.createElement("div");
    div.className = "p-6 rounded-xl w-[350px] bg-white text-black font-sans";
    div.innerHTML = `
      <div class="text-center mb-4">
        <h2 class="text-lg font-bold text-railway-700">RailReserve Receipt</h2>
        <p class="text-sm text-gray-500">${transaction.date}</p>
      </div>
      <div class="space-y-2 text-sm">
        <div><strong>Transaction ID:</strong> ${transaction.id}</div>
        <div><strong>Reference (PNR):</strong> ${transaction.reference}</div>
        <div><strong>Type:</strong> ${transaction.type}</div>
        <div><strong>Status:</strong> ${transaction.status}</div>
        <div><strong>Amount:</strong> ₹${transaction.amount.toFixed(2)}</div>
      </div>
      <div class="mt-4 text-center text-xs text-gray-500">
        Thank you for choosing RailReserve!
      </div>
    `;
    document.body.appendChild(div);

    const canvas = await html2canvas(div, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`receipt-${transaction.id}.pdf`);
    document.body.removeChild(div);

    toast({
      title: "Receipt Downloaded",
      description: `PDF for transaction ${transaction.id} saved.`,
    });
  };

  const handleCreateDummyBooking = () => {
    const dummy = createDummyBooking();
    simulateSuccessfulPayment(dummy);
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
                    <CardTitle>{userEmail?.split('@')[0] || 'Guest'}</CardTitle>
                    <CardDescription>{userEmail || 'Not logged in'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link to="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                    <Ticket className="h-5 w-5" /><span>My Bookings</span>
                  </Link>
                  <Link to="/profile" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                    <User className="h-5 w-5" /><span>Profile</span>
                  </Link>
                  <Link to="/pnr" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                    <Search className="h-5 w-5" /><span>PNR Status</span>
                  </Link>
                  <Link to="/payment" className="flex items-center space-x-2 p-2 bg-railway-50 text-railway-700 rounded-md">
                    <CreditCard className="h-5 w-5" /><span>Payment History</span>
                  </Link>
                </nav>
                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Testing Options:</p>
                  <CustomButton onClick={handleCreateDummyBooking} variant="outline" className="w-full text-sm">
                    Create Test Payment
                  </CustomButton>
                  <CustomButton onClick={handleClearData} variant="outline" className="w-full text-sm text-red-500">
                    Clear All Data
                  </CustomButton>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <h1 className="text-2xl font-bold mb-2">Payment History</h1>
            <p className="text-gray-600 mb-6">View and manage your past transactions</p>
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
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
                        transactions.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1 text-gray-400" />
                                {t.date}
                              </div>
                            </TableCell>
                            <TableCell>{t.id}</TableCell>
                            <TableCell>{t.reference}</TableCell>
                            <TableCell>{t.type}</TableCell>
                            <TableCell className="font-medium">₹{t.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {t.status === "Completed" ? (
                                  <CheckCircle size={14} className="mr-1 text-green-500" />
                                ) : (
                                  <XCircle size={14} className="mr-1 text-red-500" />
                                )}
                                {t.status}
                              </div>
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() => handleDownloadReceipt(t)}
                                className="text-railway-600 hover:text-railway-800 flex items-center"
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
