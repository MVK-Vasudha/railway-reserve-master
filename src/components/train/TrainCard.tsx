
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight, Clock, Calendar, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { Train, formatPrice } from "@/utils/mockData";

interface TrainCardProps {
  train: Train;
  journeyDate: string;
}

const TrainCard = ({ train, journeyDate }: TrainCardProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const formattedDate = journeyDate ? format(new Date(journeyDate), "EEE, dd MMM yyyy") : "";
  
  const handleBooking = (seatType: string) => {
    navigate(`/booking/${train.id}?date=${journeyDate}&seatType=${seatType}`);
  };

  const getStatusClass = (seats: number) => {
    if (seats === 0) return "text-red-500";
    if (seats < 50) return "text-orange-500";
    return "text-green-600";
  };

  const getStatusText = (seats: number) => {
    if (seats === 0) return "Not Available";
    if (seats < 10) return "Few Left";
    if (seats < 50) return `${seats} Available`;
    return "Available";
  };

  return (
    <div className="glass rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{train.name}</h3>
            <p className="text-sm text-gray-500">{train.number}</p>
          </div>
          <div className="bg-railway-50 text-railway-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {train.days.includes("Daily") ? "Daily" : train.days.join(", ")}
          </div>
        </div>

        {/* Journey Details */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Departure</p>
            <p className="text-xl font-bold">{train.departureTime}</p>
            <p className="text-sm font-medium">{train.source}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs text-gray-500 mb-1">{train.duration}</div>
            <div className="relative w-full flex items-center justify-center">
              <div className="w-full h-0.5 bg-railway-200"></div>
              <ArrowRight className="absolute text-railway-600" size={18} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{train.distance} km</div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Arrival</p>
            <p className="text-xl font-bold">{train.arrivalTime}</p>
            <p className="text-sm font-medium">{train.destination}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center mt-4 text-sm text-gray-600 gap-4">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1 text-railway-600" />
            {formattedDate}
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1 text-railway-600" />
            {train.duration}
          </div>
        </div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 text-railway-700 hover:text-railway-800 hover:bg-railway-50"
        >
          {expanded ? (
            <span className="flex items-center">
              Hide seats <ChevronUp className="ml-2 h-4 w-4" />
            </span>
          ) : (
            <span className="flex items-center">
              View seats & fares <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>

      {/* Expanded Section */}
      {expanded && (
        <div className="bg-gray-50/80 p-4 border-t border-gray-200">
          <h4 className="font-medium text-sm mb-3">Available Classes</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {train.availableSeats.sleeper > 0 && (
              <div className="bg-white rounded-md p-3 shadow-sm border border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium">Sleeper</span>
                  <span className={getStatusClass(train.availableSeats.sleeper)}>
                    {getStatusText(train.availableSeats.sleeper)}
                  </span>
                </div>
                <div className="mt-2 font-bold">{formatPrice(train.fare.sleeper)}</div>
                <CustomButton 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => handleBooking("sleeper")}
                >
                  Book Now
                </CustomButton>
              </div>
            )}
            
            {train.availableSeats.ac3Tier > 0 && (
              <div className="bg-white rounded-md p-3 shadow-sm border border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium">AC 3 Tier</span>
                  <span className={getStatusClass(train.availableSeats.ac3Tier)}>
                    {getStatusText(train.availableSeats.ac3Tier)}
                  </span>
                </div>
                <div className="mt-2 font-bold">{formatPrice(train.fare.ac3Tier)}</div>
                <CustomButton 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => handleBooking("ac3Tier")}
                >
                  Book Now
                </CustomButton>
              </div>
            )}
            
            {train.availableSeats.ac2Tier > 0 && (
              <div className="bg-white rounded-md p-3 shadow-sm border border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium">AC 2 Tier</span>
                  <span className={getStatusClass(train.availableSeats.ac2Tier)}>
                    {getStatusText(train.availableSeats.ac2Tier)}
                  </span>
                </div>
                <div className="mt-2 font-bold">{formatPrice(train.fare.ac2Tier)}</div>
                <CustomButton 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => handleBooking("ac2Tier")}
                >
                  Book Now
                </CustomButton>
              </div>
            )}
            
            {train.availableSeats.acFirstClass > 0 && (
              <div className="bg-white rounded-md p-3 shadow-sm border border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium">AC First Class</span>
                  <span className={getStatusClass(train.availableSeats.acFirstClass)}>
                    {getStatusText(train.availableSeats.acFirstClass)}
                  </span>
                </div>
                <div className="mt-2 font-bold">{formatPrice(train.fare.acFirstClass)}</div>
                <CustomButton 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => handleBooking("acFirstClass")}
                >
                  Book Now
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainCard;
