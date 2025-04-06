import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CreditCard, CheckCircle, Calendar, Train as TrainIcon, Clock, MapPin, User } from "lucide-react";

const PaymentProcess = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    // Get booking data from localStorage
    const storedBooking = localStorage.getItem('currentBooking');
    if (!storedBooking) {
      toast({
        title: "No booking found",
        description: "Please start a new booking",
        variant: "destructive",
      });
      navigate('/search');
      return;
    }
    
    try {
      setBookingData(JSON.parse(storedBooking));
    } catch (error) {
      console.error("Error parsing booking data:", error);
      navigate('/search');
    }
  }, [navigate]);

  // Mock payment process
  const processPayment = () => {
    setIsProcessing(true);
    setActiveStep(2);
    
    // Simulate API call for payment processing
    setTimeout(() => {
      setActiveStep(3);
      
      setTimeout(() => {
        setPaymentComplete(true);
        
        // Generate PNR and store booking in history
        const date = new Date();
        const formattedBooking = {
          id: `book${Date.now()}`,
          pnr: bookingData.pnr || `PNR${Math.floor(1000000 + Math.random() * 9000000)}`,
          bookingDate: date.toISOString().split('T')[0],
          journeyDate: bookingData.date,
          status: 'confirmed',
          totalFare: bookingData.fare,
          passengers: bookingData.passengers,
          seatClass: bookingData.class,
          trainId: bookingData.train.id,
          train: bookingData.train  // Include the train data for local storage
        };
        
        // Use simulateSuccessfulPayment to store the booking and trigger events
        simulateSuccessfulPayment(formattedBooking);
        
        // Clear current booking
        localStorage.removeItem('currentBooking');
        
        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed",
        });
        
        setIsProcessing(false);
      }, 2000);
    }, 2000);
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-railway-600 border-railway-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Payment Process</h1>
          <p className="text-gray-600">Complete your payment to confirm your booking</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Section */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Steps</CardTitle>
                <CardDescription>
                  Secure payment process to confirm your booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step indicators */}
                  <div className="flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}>
                        {activeStep > 1 ? <CheckCircle size={16} /> : 1}
                      </div>
                      <span className="text-xs mt-1">Review</span>
                    </div>
                    
                    <div className="flex-1 flex items-center mx-2">
                      <div className={`h-0.5 w-full ${activeStep >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}>
                        {activeStep > 2 ? <CheckCircle size={16} /> : 2}
                      </div>
                      <span className="text-xs mt-1">Payment</span>
                    </div>
                    
                    <div className="flex-1 flex items-center mx-2">
                      <div className={`h-0.5 w-full ${activeStep >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}>
                        {activeStep > 3 ? <CheckCircle size={16} /> : 3}
                      </div>
                      <span className="text-xs mt-1">Confirmation</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Step content */}
                  {!paymentComplete ? (
                    <>
                      {activeStep === 1 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Review Your Booking</h3>
                          
                          <div className="bg-railway-50 p-4 rounded-md">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-bold">{bookingData.train.name}</h3>
                              <span className="text-sm text-gray-600">{bookingData.train.number}</span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Departure</p>
                                <p className="text-base font-bold">{bookingData.train.departureTime}</p>
                                <p className="text-sm">{bookingData.train.source}</p>
                              </div>
                              
                              <div className="flex flex-col items-center justify-center">
                                <div className="text-xs text-gray-500 mb-1">{bookingData.train.duration}</div>
                                <div className="relative w-full flex items-center justify-center">
                                  <div className="w-full h-0.5 bg-railway-200"></div>
                                  <div className="absolute w-2 h-2 rounded-full bg-railway-600 left-0"></div>
                                  <div className="absolute w-2 h-2 rounded-full bg-railway-600 right-0"></div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Arrival</p>
                                <p className="text-base font-bold">{bookingData.train.arrivalTime}</p>
                                <p className="text-sm">{bookingData.train.destination}</p>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </div>
                              <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {
                                  bookingData.class === 'sleeper' ? 'Sleeper Class' :
                                  bookingData.class === 'ac3Tier' ? 'AC 3 Tier' :
                                  bookingData.class === 'ac2Tier' ? 'AC 2 Tier' : 'AC First Class'
                                }
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Passenger Details</h4>
                            {bookingData.passengers.map((passenger: any, index: number) => (
                              <div key={index} className="mb-2 p-3 border rounded-md">
                                <div className="flex items-center">
                                  <User size={14} className="mr-2 text-gray-500" />
                                  <div>
                                    <span className="font-medium">{passenger.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                      ({passenger.age} yrs, {passenger.gender})
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Contact Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 border rounded-md">
                                <div className="text-sm text-gray-500">Email</div>
                                <div>{bookingData.contactEmail}</div>
                              </div>
                              <div className="p-3 border rounded-md">
                                <div className="text-sm text-gray-500">Phone</div>
                                <div>{bookingData.contactPhone}</div>
                              </div>
                            </div>
                          </div>
                          
                          <CustomButton 
                            onClick={processPayment} 
                            isLoading={isLoading} 
                            className="w-full mt-4"
                          >
                            <CreditCard size={16} className="mr-2" />
                            Pay ₹{bookingData.fare.toFixed(2)}
                          </CustomButton>
                        </div>
                      )}
                      
                      {activeStep === 2 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Processing Payment</h3>
                          <div className="text-center py-8">
                            <div className="w-16 h-16 border-4 border-t-railway-600 border-railway-200 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Please wait while we process your payment...</p>
                            <p className="text-gray-500 text-sm mt-2">Do not refresh or close this page</p>
                          </div>
                        </div>
                      )}
                      
                      {activeStep === 3 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Confirming Booking</h3>
                          <div className="text-center py-8">
                            <div className="w-16 h-16 border-4 border-t-railway-600 border-railway-200 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Finalizing your booking details...</p>
                            <p className="text-gray-500 text-sm mt-2">Generating PNR and ticket</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-4">Your booking has been confirmed</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center">
                        <p className="text-sm text-gray-700">Your PNR Number</p>
                        <p className="text-xl font-bold text-green-700">{bookingData.pnr}</p>
                      </div>
                      
                      <CustomButton 
                        onClick={handleContinue} 
                        className="w-full"
                      >
                        View My Bookings
                      </CustomButton>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="glass sticky top-20">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Train</span>
                    <span>{bookingData.train.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>{new Date(bookingData.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Passengers</span>
                    <span>{bookingData.passengers.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Class</span>
                    <span>
                      {
                        bookingData.class === 'sleeper' ? 'Sleeper' :
                        bookingData.class === 'ac3Tier' ? 'AC 3 Tier' :
                        bookingData.class === 'ac2Tier' ? 'AC 2 Tier' : 'AC First Class'
                      }
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹{bookingData.fare.toFixed(2)}</span>
                  </div>
                  
                  {paymentComplete && (
                    <div className="pt-2">
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle size={14} className="mr-1" />
                        Payment Complete
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentProcess;
