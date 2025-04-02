import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockBookings, getTrainById, formatPrice } from "@/utils/mockData";
import { getUserBookings } from "@/utils/events";
import { Calendar, Clock, MapPin, Ticket, User, AlertTriangle, CreditCard, Search } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check if user is logged in and load bookings on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    
    if (!isLoggedIn) {
      toast({
        title: "Not logged in",
        description: "You need to log in to view your bookings",
      });
      navigate("/login");
      return;
    }
    
    setUserEmail(email);
    setUserName(name || (email ? email.split('@')[0] : null));
    
    // Load bookings
    loadBookings();
    
    // Listen for booking updates
    window.addEventListener("booking_updated", loadBookings);
    
    return () => {
      window.removeEventListener("booking_updated", loadBookings);
    };
  }, [navigate]);
  
  const loadBookings = () => {
    // Get bookings from localStorage
    const userBookings = getUserBookings();
    
    // If we have user bookings, use those
    if (userBookings && userBookings.length > 0) {
      const upcoming = userBookings.filter((b: any) => b.status === 'confirmed');
      const cancelled = userBookings.filter((b: any) => b.status === 'cancelled');
      
      setUpcomingBookings(upcoming);
      setCancelledBookings(cancelled);
    } else {
      // Fall back to mock data if no user bookings
      const upcoming = mockBookings.filter(b => b.status === 'confirmed');
      const cancelled = mockBookings.filter(b => b.status === 'cancelled');
      
      setUpcomingBookings(upcoming);
      setCancelledBookings(cancelled);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    // Get current bookings
    const userBookings = getUserBookings();
    
    // Find and update the cancelled booking
    const updatedBookings = userBookings.map((booking: any) => {
      if (booking.id === bookingId) {
        return { ...booking, status: 'cancelled' };
      }
      return booking;
    });
    
    // Save back to localStorage
    localStorage.setItem("userBookings", JSON.stringify(updatedBookings));
    
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully. Refund process initiated.",
    });
    
    // Reload bookings to update the UI
    loadBookings();
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
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">My Bookings</h1>
              <p className="text-gray-600">Manage your train bookings and view your journey details</p>
            </div>
            
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming">Upcoming Journeys</TabsTrigger>
                <TabsTrigger value="completed">Completed Journeys</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled Bookings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-6 animate-fade-in">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => {
                    const train = getTrainById(booking.trainId);
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
                              {booking.passengers.map((passenger, index) => (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <User size={16} className="mr-2 text-gray-500" />
                                    <span>{passenger.name}</span>
                                    <span className="text-gray-500 text-sm ml-2">
                                      ({passenger.age} yrs, {passenger.gender})
                                    </span>
                                  </div>
                                  <div className="text-sm font-medium">
                                    {passenger.seatNumber}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-gray-600 text-sm">Total Fare</span>
                                <p className="font-bold text-lg">{formatPrice(booking.totalFare)}</p>
                              </div>
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
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No completed journeys</h3>
                  <p className="text-gray-500 mb-6">Your completed journeys will appear here.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="cancelled" className="animate-fade-in">
                {cancelledBookings.length > 0 ? (
                  <div className="space-y-6">
                    {cancelledBookings.map((booking) => {
                      const train = getTrainById(booking.trainId);
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
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
