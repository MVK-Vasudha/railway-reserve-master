import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Train as TrainIcon, Calendar, Clock, MapPin, User, Plus, Minus, CreditCard, CheckCircle } from "lucide-react";
import { availableTrains } from "@/utils/trainData";

type PassengerFormData = {
  name: string;
  age: string;
  gender: "male" | "female" | "other";
};

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trainId = searchParams.get("train") || "";
  const seatClass = searchParams.get("class") || "";
  const dateString = searchParams.get("date") || "";
  
  const [passengers, setPassengers] = useState<PassengerFormData[]>([
    { name: "", age: "", gender: "male" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  const selectedTrain = availableTrains.find(t => t.id === trainId);
  const date = dateString ? new Date(dateString) : new Date();
  
  if (!selectedTrain) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <div className="text-center">
            <TrainIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Train Not Found</h2>
            <p className="text-gray-600 mb-8">We couldn't find the train you selected.</p>
            <Link to="/search">
              <CustomButton>Search Trains Again</CustomButton>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const fareDetails = selectedTrain.coaches[seatClass as keyof typeof selectedTrain.coaches];
  
  const handlePassengerChange = (index: number, field: keyof PassengerFormData, value: string) => {
    const newPassengers = [...passengers];
    newPassengers[index] = {
      ...newPassengers[index],
      [field]: value
    };
    setPassengers(newPassengers);
  };
  
  const addPassenger = () => {
    if (passengers.length >= 6) {
      toast({
        title: "Maximum Passengers",
        description: "You can book for a maximum of 6 passengers at once",
        variant: "destructive"
      });
      return;
    }
    
    setPassengers([...passengers, { name: "", age: "", gender: "male" }]);
  };
  
  const removePassenger = (index: number) => {
    if (passengers.length <= 1) {
      toast({
        title: "Required",
        description: "At least one passenger is required",
        variant: "destructive"
      });
      return;
    }
    
    const newPassengers = [...passengers];
    newPassengers.splice(index, 1);
    setPassengers(newPassengers);
  };

  const calculateTotalFare = () => {
    const baseFare = fareDetails.fare * passengers.length;
    const convenienceFee = 25;
    const gst = baseFare * 0.05; // 5% GST
    
    return {
      baseFare,
      convenienceFee,
      gst,
      total: baseFare + convenienceFee + gst
    };
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name.trim() || !p.age.trim() || !p.gender) {
        toast({
          title: "Missing Information",
          description: `Please fill all details for Passenger ${i + 1}`,
          variant: "destructive"
        });
        return;
      }
      
      const age = parseInt(p.age);
      if (isNaN(age) || age <= 0 || age > 120) {
        toast({
          title: "Invalid Age",
          description: `Please enter a valid age for Passenger ${i + 1}`,
          variant: "destructive"
        });
        return;
      }
    }
    
    if (!contactEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a contact email",
        variant: "destructive"
      });
      return;
    }
    
    if (!contactPhone.trim() || contactPhone.length < 10) {
      toast({
        title: "Missing Information",
        description: "Please provide a valid contact phone number",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const bookingData = {
        train: selectedTrain,
        class: seatClass,
        date: dateString,
        passengers,
        contactEmail,
        contactPhone,
        fare: calculateTotalFare().total,
        pnr: `PNR${Math.floor(Math.random() * 10000000000)}`
      };
      
      localStorage.setItem('currentBooking', JSON.stringify(bookingData));
      
      navigate("/payment-process");
      
      setIsLoading(false);
    }, 1500);
  };
  
  const fare = calculateTotalFare();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Passenger Details</h1>
          <p className="text-gray-600">
            Fill in the passenger details to complete your booking
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Train Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-railway-50 p-4 rounded-md mb-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold">{selectedTrain.name}</h3>
                      <span className="text-sm text-gray-600">{selectedTrain.number}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="text-base font-bold">{selectedTrain.departureTime}</p>
                        <p className="text-sm">{selectedTrain.source}</p>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-xs text-gray-500 mb-1">{selectedTrain.duration}</div>
                        <div className="relative w-full flex items-center justify-center">
                          <div className="w-full h-0.5 bg-railway-200"></div>
                          <div className="absolute w-2 h-2 rounded-full bg-railway-600 left-0"></div>
                          <div className="absolute w-2 h-2 rounded-full bg-railway-600 right-0"></div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Arrival</p>
                        <p className="text-base font-bold">{selectedTrain.arrivalTime}</p>
                        <p className="text-sm">{selectedTrain.destination}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {
                          seatClass === 'sleeper' ? 'Sleeper Class' :
                          seatClass === 'ac3Tier' ? 'AC 3 Tier' :
                          seatClass === 'ac2Tier' ? 'AC 2 Tier' : 'AC First Class'
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Passenger Information</CardTitle>
                    <CustomButton 
                      type="button"
                      onClick={addPassenger}
                      variant="outline"
                      size="sm"
                      className="flex items-center text-xs"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Passenger
                    </CustomButton>
                  </div>
                  <CardDescription>
                    Add details for all passengers (maximum 6)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Passenger {index + 1}</h3>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removePassenger(index)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center"
                          >
                            <Minus size={14} className="mr-1" />
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Full Name</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <User size={14} className="text-gray-400" />
                            </div>
                            <Input
                              id={`name-${index}`}
                              value={passenger.name}
                              onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                              placeholder="Passenger name"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`age-${index}`}>Age</Label>
                          <Input
                            id={`age-${index}`}
                            value={passenger.age}
                            onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                            placeholder="Age"
                            type="number"
                            min="1"
                            max="120"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`gender-${index}`}>Gender</Label>
                          <select
                            id={`gender-${index}`}
                            value={passenger.gender}
                            onChange={(e) => handlePassengerChange(index, 'gender', e.target.value as any)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    We'll send your booking confirmation and updates to these contacts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="youremail@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Your contact number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="glass sticky top-20">
              <CardHeader>
                <CardTitle>Fare Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Fare</span>
                    <span>₹{fare.baseFare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{seatClass === 'sleeper' ? 'Sleeper' : seatClass === 'ac3Tier' ? 'AC 3 Tier' : seatClass === 'ac2Tier' ? 'AC 2 Tier' : 'AC First Class'} × {passengers.length}</span>
                    <span>₹{fareDetails.fare} × {passengers.length}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span>₹{fare.convenienceFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{fare.gst.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹{fare.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <CustomButton 
                  onClick={handleSubmit}
                  className="w-full"
                  isLoading={isLoading}
                >
                  <CreditCard size={16} className="mr-2" />
                  Proceed to Payment
                </CustomButton>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingForm;
