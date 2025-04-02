
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Search, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { mockBookings, getTrainById } from "@/utils/mockData";

const PnrStatus = () => {
  const [pnrNumber, setPnrNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pnrNumber || pnrNumber.length < 8) {
      toast({
        title: "Invalid PNR",
        description: "Please enter a valid 10-digit PNR number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const booking = mockBookings.find(b => b.pnr === pnrNumber);
      
      if (booking) {
        const train = getTrainById(booking.trainId);
        setSearchResult({ booking, train });
        toast({
          title: "PNR Found",
          description: "Your booking details have been retrieved",
        });
      } else {
        toast({
          title: "PNR Not Found",
          description: "No booking found with the provided PNR number",
          variant: "destructive",
        });
      }
      
      setIsSearching(false);
    }, 1000);
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
                    <CardTitle>John Doe</CardTitle>
                    <CardDescription>john@example.com</CardDescription>
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
                  <Link to="/pnr" className="flex items-center space-x-2 p-2 rounded-md bg-railway-50 text-railway-700">
                    <Search className="h-5 w-5" />
                    <span>PNR Status</span>
                  </Link>
                  <Link to="/payment" className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <User className="h-5 w-5" />
                    <span>Payment History</span>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">PNR Status</h1>
              <p className="text-gray-600">Check the status of your booking with PNR number</p>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Enter PNR Number</CardTitle>
                <CardDescription>
                  Enter your 10-digit PNR number to check booking status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Ticket size={16} className="text-gray-400" />
                      </div>
                      <Input
                        placeholder="Enter 10-digit PNR number"
                        value={pnrNumber}
                        onChange={(e) => setPnrNumber(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <CustomButton type="submit" isLoading={isSearching}>
                      <Search size={16} className="mr-2" />
                      Check Status
                    </CustomButton>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {searchResult && (
              <Card className="animate-fade-in">
                <CardHeader className="bg-green-50 border-b border-green-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{searchResult.train.name}</CardTitle>
                      <CardDescription className="text-green-700">{searchResult.train.number}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600 mb-1">
                        {searchResult.booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        PNR: {searchResult.booking.pnr}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Departure</p>
                      <p className="text-xl font-bold">{searchResult.train.departureTime}</p>
                      <p className="text-sm font-medium">{searchResult.train.source}</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-xs text-gray-500 mb-1">{searchResult.train.duration}</div>
                      <div className="relative w-full flex items-center justify-center">
                        <div className="w-full h-0.5 bg-railway-200"></div>
                        <div className="absolute w-2 h-2 rounded-full bg-railway-600 left-0"></div>
                        <div className="absolute w-2 h-2 rounded-full bg-railway-600 right-0"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{searchResult.train.distance} km</div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Arrival</p>
                      <p className="text-xl font-bold">{searchResult.train.arrivalTime}</p>
                      <p className="text-sm font-medium">{searchResult.train.destination}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-railway-600" />
                      {searchResult.booking.journeyDate}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1 text-railway-600" />
                      Expected Arrival: On Time
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Passenger Details</h4>
                    {searchResult.booking.passengers.map((passenger: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PnrStatus;
