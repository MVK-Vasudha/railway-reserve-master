import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchForm from "@/components/train/SearchForm";
import { Calendar, Clock, MapPin, Train as TrainIcon, ArrowRight, User, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { availableTrains } from "@/utils/trainData";

const TrainSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trains, setTrains] = useState<any[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    sortBy: "departure",
    classFilter: "all"
  });
  const [expandedFilters, setExpandedFilters] = useState(false);

  const source = searchParams.get("source") || "";
  const destination = searchParams.get("destination") || "";
  const dateString = searchParams.get("date") || "";
  const date = dateString ? new Date(dateString) : new Date();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTrains(availableTrains);
      setIsLoading(false);
    }, 1000);
  }, [source, destination, dateString]);

  const handleSelectSeat = (trainId: string, seatClass: string) => {
    setSelectedTrain(trainId);
    setSelectedClass(seatClass);
  };

  const handleContinue = () => {
    if (!selectedTrain || !selectedClass) {
      toast({
        title: "Selection Required",
        description: "Please select a train and seat class to continue",
        variant: "destructive"
      });
      return;
    }

    navigate(`/booking?train=${selectedTrain}&class=${selectedClass}&date=${dateString}`);
  };

  const toggleFilters = () => {
    setExpandedFilters(!expandedFilters);
  };

  const applySortBy = (sortType: string) => {
    let sortedTrains = [...trains];
    
    if (sortType === "departure") {
      sortedTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else if (sortType === "duration") {
      sortedTrains.sort((a, b) => {
        const durationA = parseInt(a.duration.split("h")[0]);
        const durationB = parseInt(b.duration.split("h")[0]);
        return durationA - durationB;
      });
    } else if (sortType === "price") {
      sortedTrains.sort((a, b) => a.coaches.sleeper.fare - b.coaches.sleeper.fare);
    }
    
    setFilter({ ...filter, sortBy: sortType });
    setTrains(sortedTrains);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <SearchForm />
        </div>
        
        <div className="mb-4">
          <h1 className="text-2xl font-bold">
            Trains from {source} to {destination}
          </h1>
          <p className="text-gray-600">
            {format(date, "EEEE, MMMM d, yyyy")} • {trains.length} trains found
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:block">
            <Card className="glass sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Filter size={16} className="mr-2" />
                    Filters & Sorting
                  </div>
                  <button 
                    onClick={toggleFilters} 
                    className="md:hidden text-gray-500"
                  >
                    {expandedFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className={`space-y-4 ${expandedFilters ? 'block' : 'hidden md:block'}`}>
                <div>
                  <h3 className="font-medium text-sm mb-2">Sort by</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => applySortBy("departure")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filter.sortBy === "departure" 
                          ? "bg-railway-50 text-railway-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Departure Time
                    </button>
                    <button
                      onClick={() => applySortBy("duration")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filter.sortBy === "duration" 
                          ? "bg-railway-50 text-railway-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Journey Duration
                    </button>
                    <button
                      onClick={() => applySortBy("price")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filter.sortBy === "price" 
                          ? "bg-railway-50 text-railway-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Price (Low to High)
                    </button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Train Class</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setFilter({ ...filter, classFilter: "all" })}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filter.classFilter === "all" 
                          ? "bg-railway-50 text-railway-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      All Classes
                    </button>
                    <button
                      onClick={() => setFilter({ ...filter, classFilter: "sleeper" })}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filter.classFilter === "sleeper" 
                          ? "bg-railway-50 text-railway-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Sleeper
                    </button>
                    <button
                      onClick={() => setFilter({ ...filter, classFilter: "ac3Tier" })}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filter.classFilter === "ac3Tier" 
                          ? "bg-railway-50 text-railway-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      AC 3 Tier
                    </button>
                    <button
                      onClick={() => setFilter({ ...filter, classFilter: "ac2Tier" })}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filter.classFilter === "ac2Tier" 
                          ? "bg-railway-50 text-railway-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      AC 2 Tier
                    </button>
                    <button
                      onClick={() => setFilter({ ...filter, classFilter: "acFirstClass" })}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filter.classFilter === "acFirstClass" 
                          ? "bg-railway-50 text-railway-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      AC First Class
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3 space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-t-railway-600 border-railway-200 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for trains...</p>
              </div>
            ) : (
              trains.map((train) => (
                <Card key={train.id} className={`overflow-hidden ${
                  selectedTrain === train.id ? 'ring-2 ring-railway-500' : ''
                }`}>
                  <CardContent className="p-0">
                    <div className="bg-railway-50 p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg">{train.name}</h3>
                          <p className="text-sm text-gray-500">{train.number}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs bg-railway-100 text-railway-800 px-2 py-1 rounded-full">
                            Runs on: {train.days.join(", ")}
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
                      
                      <Separator className="my-4" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
                        <div 
                          className={`border rounded-md p-3 cursor-pointer transition-all ${
                            train.coaches.sleeper.available === 0 
                              ? 'opacity-50 cursor-not-allowed' 
                              : selectedTrain === train.id && selectedClass === 'sleeper'
                                ? 'border-railway-500 bg-railway-50'
                                : 'hover:border-railway-300'
                          }`}
                          onClick={() => train.coaches.sleeper.available > 0 && handleSelectSeat(train.id, 'sleeper')}
                        >
                          <div className="text-sm font-medium">Sleeper</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {train.coaches.sleeper.available > 0 
                                ? `${train.coaches.sleeper.available} available` 
                                : 'Not available'}
                            </span>
                            <span className="font-bold">₹{train.coaches.sleeper.fare}</span>
                          </div>
                        </div>
                        
                        <div 
                          className={`border rounded-md p-3 cursor-pointer transition-all ${
                            train.coaches.ac3Tier.available === 0 
                              ? 'opacity-50 cursor-not-allowed' 
                              : selectedTrain === train.id && selectedClass === 'ac3Tier'
                                ? 'border-railway-500 bg-railway-50'
                                : 'hover:border-railway-300'
                          }`}
                          onClick={() => train.coaches.ac3Tier.available > 0 && handleSelectSeat(train.id, 'ac3Tier')}
                        >
                          <div className="text-sm font-medium">AC 3 Tier</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {train.coaches.ac3Tier.available > 0 
                                ? `${train.coaches.ac3Tier.available} available` 
                                : 'Not available'}
                            </span>
                            <span className="font-bold">₹{train.coaches.ac3Tier.fare}</span>
                          </div>
                        </div>
                        
                        <div 
                          className={`border rounded-md p-3 cursor-pointer transition-all ${
                            train.coaches.ac2Tier.available === 0 
                              ? 'opacity-50 cursor-not-allowed' 
                              : selectedTrain === train.id && selectedClass === 'ac2Tier'
                                ? 'border-railway-500 bg-railway-50'
                                : 'hover:border-railway-300'
                          }`}
                          onClick={() => train.coaches.ac2Tier.available > 0 && handleSelectSeat(train.id, 'ac2Tier')}
                        >
                          <div className="text-sm font-medium">AC 2 Tier</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {train.coaches.ac2Tier.available > 0 
                                ? `${train.coaches.ac2Tier.available} available` 
                                : 'Not available'}
                            </span>
                            <span className="font-bold">₹{train.coaches.ac2Tier.fare}</span>
                          </div>
                        </div>
                        
                        <div 
                          className={`border rounded-md p-3 cursor-pointer transition-all ${
                            train.coaches.acFirstClass.available === 0 
                              ? 'opacity-50 cursor-not-allowed' 
                              : selectedTrain === train.id && selectedClass === 'acFirstClass'
                                ? 'border-railway-500 bg-railway-50'
                                : 'hover:border-railway-300'
                          }`}
                          onClick={() => train.coaches.acFirstClass.available > 0 && handleSelectSeat(train.id, 'acFirstClass')}
                        >
                          <div className="text-sm font-medium">AC First Class</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {train.coaches.acFirstClass.available > 0 
                                ? `${train.coaches.acFirstClass.available} available` 
                                : 'Not available'}
                            </span>
                            <span className="font-bold">₹{train.coaches.acFirstClass.fare}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {selectedTrain && selectedClass && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
                <div className="container mx-auto flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Selected Train</div>
                    <div className="font-bold">
                      {trains.find(t => t.id === selectedTrain)?.name} • {
                        selectedClass === 'sleeper' ? 'Sleeper' :
                        selectedClass === 'ac3Tier' ? 'AC 3 Tier' :
                        selectedClass === 'ac2Tier' ? 'AC 2 Tier' : 'AC First Class'
                      }
                    </div>
                  </div>
                  <CustomButton onClick={handleContinue}>
                    Continue to Book
                    <ArrowRight size={16} className="ml-2" />
                  </CustomButton>
                </div>
              </div>
            )}
            
            {trains.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrainIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trains found</h3>
                <p className="text-gray-500 mb-6">No trains available for the selected route and date.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TrainSearch;
