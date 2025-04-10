import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TicketDownload from "@/components/booking/TicketDownload";
import { formatPrice } from "@/utils/mockData";
import { getUserBookings, cancelBooking, clearAllData, createDummyBooking, simulateSuccessfulPayment } from "@/utils/events";
import axios from "axios";
import { Calendar, Clock, MapPin, Ticket, User, AlertTriangle, CreditCard, Search, Download } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<any[]>([]);
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    const token = localStorage.getItem("token");
    
    if (!isLoggedIn) {
      // For the demo, we'll allow non-logged in users to view the dashboard
      // but in a real app, we would redirect to login
      /*
      toast({
        title: "Not logged in",
        description: "You need to log in to view your bookings",
      });
      navigate("/login");
      return;
      */
    }
    
    setUserEmail(email || "demo@example.com");
    setUserName(name || (email ? email.split('@')[0] : "Demo User"));
    
    if (token) {
      fetchBookings(token);
    } else {
      loadLocalBookings();
    }
    
    window.addEventListener("booking_updated", handleBookingUpdate);
    
    return () => {
      window.removeEventListener("booking_updated", handleBookingUpdate);
    };
  }, [navigate]);
  
  const handleBookingUpdate = () => {
    console.log("Booking update event detected");
    const token = localStorage.getItem("token");
    if (token) {
      fetchBookings(token);
    } else {
      loadLocalBookings();
    }
  };
  
  const fetchBookings = async (token: string) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get('/api/bookings/my-bookings', config);
      
      if (response.data.success) {
        const allBookings = response.data.data;
        categorizeBookings(allBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Failed to load bookings",
        description: "Please try again later",
        variant: "destructive",
      });
      loadLocalBookings();
    } finally {
      setLoading(false);
    }
  };
  
  const loadLocalBookings = () => {
    console.log("Loading bookings from localStorage");
    const userBookings = getUserBookings();
    
    if (userBookings && userBookings.length > 0) {
      categorizeBookings(userBookings);
      console.log("Local bookings loaded:", userBookings.length);
    } else {
      setUpcomingBookings([]);
      setCompletedBookings([]);
      setCancelledBookings([]);
      setLoading(false);
    }
  };
  
  const categorizeBookings = (bookings: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for proper comparison
    
    const upcoming: any[] = [];
    const completed: any[] = [];
    const cancelled: any[] = [];
    
    bookings.forEach((booking: any) => {
      let journeyDate;
      
      // Parse journey date, handling different formats
      if (booking.journeyDate) {
        journeyDate = new Date(booking.journeyDate);
      } else if (booking.date) {
        journeyDate = new Date(booking.date);
      } else {
        // If no date is found, default to 7 days from now
        journeyDate = new Date();
        journeyDate.setDate(journeyDate.getDate() + 7);
      }
      
      // Reset time to beginning of day for proper comparison
      journeyDate.setHours(0, 0, 0, 0);
      
      if (booking.status === 'cancelled') {
        cancelled.push(booking);
      } else if (journeyDate < today) {
        completed.push(booking);
      } else {
        upcoming.push(booking);
      }
    });
    
    console.log("Categorized bookings:", {
      upcoming: upcoming.length,
      completed: completed.length,
      cancelled: cancelled.length
    });
    
    setUpcomingBookings(upcoming);
    setCompletedBookings(completed);
    setCancelledBookings(cancelled);
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    const token = localStorage.getItem("token");
    
    try {
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const response = await axios.put(`/api/bookings/${bookingId}`, { status: 'cancelled' }, config);
        
        if (response.data.success) {
          toast({
            title: "Booking Cancelled",
            description: "Your booking has been cancelled successfully. Refund process initiated.",
          });
          
          fetchBookings(token);
        }
      } else {
        const cancelled = cancelBooking(bookingId);
        
        if (cancelled) {
          toast({
            title: "Booking Cancelled",
            description: "Your booking has been cancelled successfully. Refund process initiated.",
          });
          
          loadLocalBookings();
        } else {
          toast({
            title: "Cancellation Failed",
            description: "Could not find the booking to cancel",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Failed to cancel booking",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // FOR TESTING ONLY: Creates a dummy booking for testing
  const handleCreateDummyBooking = () => {
    const dummyBooking = createDummyBooking();
    simulateSuccessfulPayment(dummyBooking);
    toast({
      title: "Test Booking Created",
      description: "A dummy booking has been added to your bookings",
    });
    loadLocalBookings(); // Refresh the bookings list
  };
  
  // FOR TESTING ONLY: Clears all data from localStorage
  const handleClearData = () => {
    clearAllData();
    toast({
      title: "Data Cleared",
      description: "All bookings and payments have been cleared",
    });
    loadLocalBookings(); // Refresh the bookings list
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
                    <CardTitle>{userName || 'Guest'}</CardTitle>
                    <CardDescription>{userEmail || 'Not logged in'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Link to="/dashboard" className="flex items-center space-x-2 p-2 rounded-md bg-railway-50 text-railway-700">
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
                  <Link to="/payment" className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-100">
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
                      Create Test Booking
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
              <h1 className="text-2xl font-bold mb-2">My Bookings</h1>
              <p className="text-gray-600">Manage your train bookings and view your journey details</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-t-railway-600 border-railway-200 rounded-full animate-spin"></div>
              </div>
            ) : (
              <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="upcoming">Upcoming Journeys</TabsTrigger>
                  <TabsTrigger value="completed">Completed Journeys</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled Bookings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-6 animate-fade-in">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => {
                      const train = booking.train || getTrainById(booking.trainId);
                      if (!train) return null;
                      
                      return (
                        <Card key={booking.id} className="glass overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-railway-50 p-4 border-b border-gray-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-bold text-lg">{train.name}</h3>
                                  <p className="text-sm text-gray-500">{train.number}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-green-600 mb-1">
                                    Confirmed
                                  </div>
                                  <div className="text-xs bg-railway-100 text-railway-800 px-2 py-1 rounded-full">
                                    PNR: {booking.pnr}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-500">Departure</p>
                                  <p className="text-xl font-bold">{train.departureTime}</p>
                                  <p className="text-sm font-medium">{train.source}</p>
                                </div>
                                
                                <div className="flex flex-col items-center justify-center">
                                  <div className="text-xs text-gray-500 mb-1">{train.duration}</div>
                                  <div className="relative w-full flex items-center justify-center">
                                    <div className="w-full h-0.5 bg-railway-200"></div>
                                    <div className="absolute w-2 h-2 rounded-full bg-railway-600 left-0"></div>
                                    <div className="absolute w-2 h-2 rounded-full bg-railway-600 right-0"></div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{train.distance} km</div>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">Arrival</p>
                                  <p className="text-xl font-bold">{train.arrivalTime}</p>
                                  <p className="text-sm font-medium">{train.destination}</p>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-4">
                                <div className="flex items-center">
                                  <Calendar size={16} className="mr-1 text-railway-600" />
                                  {booking.journeyDate}
                                </div>
                                <div className="flex items-center">
                                  <Ticket size={16} className="mr-1 text-railway-600" />
                                  {booking.seatType === 'sleeper' ? 'Sleeper' :
                                   booking.seatType === 'ac3Tier' ? 'AC 3 Tier' :
                                   booking.seatType === 'ac2Tier' ? 'AC 2 Tier' : 'AC First Class'}
                                </div>
                              </div>
                              
                              <Separator className="my-4" />
                              
                              <div className="space-y-3">
                                <h4 className="font-medium">Passenger Details</h4>
                                {booking.passengers && booking.passengers.map((passenger, index) => (
                                  <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <User size={16} className="mr-2 text-gray-500" />
                                      <span>{passenger.name}</span>
                                      <span className="text-gray-500 text-sm ml-2">
                                        ({passenger.age} yrs, {passenger.gender})
                                      </span>
                                    </div>
                                    <div className="text-sm font-medium">
                                      {passenger.seatNumber || `Seat ${index + 1}`}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <Separator className="my-4" />
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-gray-600 text-sm">Total Fare</span>
                                  <p className="font-bold text-lg">{formatPrice(booking.totalFare || booking.fare)}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <TicketDownload booking={booking} train={train} />
                                  <CustomButton
                                    variant="outline"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                  >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Cancel Booking
                                  </CustomButton>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ticket className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
                      <p className="text-gray-500 mb-6">You don't have any upcoming train journeys.</p>
                      <Link to="/search">
                        <CustomButton>
                          <Search className="mr-2 h-4 w-4" />
                          Search Trains
                        </CustomButton>
                      </Link>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="animate-fade-in">
                  {completedBookings && completedBookings.length > 0 ? (
                    <div className="space-y-6">
                      {completedBookings.map((booking) => {
                        const train = booking.train || getTrainById(booking.trainId);
                        if (!train) return null;
                        
                        return (
                          <Card key={booking.id} className="glass overflow-hidden">
                            <CardContent className="p-0">
                              <div className="bg-gray-100 p-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-bold text-lg">{train.name}</h3>
                                    <p className="text-sm text-gray-500">{train.number}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-blue-600 mb-1">
                                      Completed
                                    </div>
                                    <div className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                                      PNR: {booking.pnr}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Departure</p>
                                    <p className="text-xl font-bold">{train.departureTime}</p>
                                    <p className="text-sm font-medium">{train.source}</p>
                                  </div>
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="text-xs text-gray-500 mb-1">{train.duration}</div>
                                    <div className="relative w-full flex items-center justify-center">
                                      <div className="w-full h-0.5 bg-gray-200"></div>
                                      <div className="absolute w-2 h-2 rounded-full bg-gray-400 left-0"></div>
                                      <div className="absolute w-2 h-2 rounded-full bg-gray-400 right-0"></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{train.distance} km</div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">Arrival</p>
                                    <p className="text-xl font-bold">{train.arrivalTime}</p>
                                    <p className="text-sm font-medium">{train.destination}</p>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-4">
                                  <div className="flex items-center">
                                    <Calendar size={16} className="mr-1 text-gray-600" />
                                    {booking.journeyDate}
                                  </div>
                                </div>
                                
                                <div className="flex justify-end">
                                  <TicketDownload booking={booking} train={train} />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No completed journeys</h3>
                      <p className="text-gray-500 mb-6">Your completed journeys will appear here.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="cancelled" className="animate-fade-in">
                  {cancelledBookings.length > 0 ? (
                    <div className="space-y-6">
                      {cancelledBookings.map((booking) => {
                        const train = booking.train || getTrainById(booking.trainId);
                        if (!train) return null;
                        
                        return (
                          <Card key={booking.id} className="glass overflow-hidden">
                            <CardContent className="p-0">
                              <div className="bg-gray-100 p-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-bold text-lg">{train.name}</h3>
                                    <p className="text-sm text-gray-500">{train.number}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-red-600 mb-1">
                                      Cancelled
                                    </div>
                                    <div className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                                      PNR: {booking.pnr}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4 opacity-75">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Departure</p>
                                    <p className="text-xl font-bold">{train.departureTime}</p>
                                    <p className="text-sm font-medium">{train.source}</p>
                                  </div>
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="text-xs text-gray-500 mb-1">{train.duration}</div>
                                    <div className="relative w-full flex items-center justify-center">
                                      <div className="w-full h-0.5 bg-gray-200"></div>
                                      <div className="absolute w-2 h-2 rounded-full bg-gray-400 left-0"></div>
                                      <div className="absolute w-2 h-2 rounded-full bg-gray-400 right-0"></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{train.distance} km</div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">Arrival</p>
                                    <p className="text-xl font-bold">{train.arrivalTime}</p>
                                    <p className="text-sm font-medium">{train.destination}</p>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-4">
                                  <div className="flex items-center">
                                    <Calendar size={16} className="mr-1 text-gray-600" />
                                    {booking.journeyDate}
                                  </div>
                                  <div className="flex items-center">
                                    <Ticket size={16} className="mr-1 text-gray-600" />
                                    {booking.seatType === 'sleeper' ? 'Sleeper' :
                                     booking.seatType === 'ac3Tier' ? 'AC 3 Tier' :
                                     booking.seatType === 'ac2Tier' ? 'AC 2 Tier' : 'AC First Class'}
                                  </div>
                                </div>
                                
                                <div className="p-4 mt-4 bg-red-50 rounded-md text-red-700 text-sm">
                                  <AlertTriangle size={16} className="inline-block mr-2" />
                                  This booking has been cancelled. Refund will be processed within 3-5 business days.
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No cancelled bookings</h3>
                      <p className="text-gray-500">You don't have any cancelled bookings.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
