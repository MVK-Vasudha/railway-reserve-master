
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, Search } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "@/hooks/use-toast";
import { stations } from "@/utils/mockData";

const SearchForm = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    if (!source || !destination || !date) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        variant: "destructive",
      });
      setIsSearching(false);
      return;
    }

    if (source === destination) {
      toast({
        title: "Error",
        description: "Source and destination cannot be the same",
        variant: "destructive",
      });
      setIsSearching(false);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      navigate({
        pathname: "/search",
        search: `?source=${source}&destination=${destination}&date=${format(date, "yyyy-MM-dd")}`,
      });
      setIsSearching(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSearch} className="glass p-6 rounded-xl shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <MapPin size={16} className="mr-1 text-railway-600" /> From
          </label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select origin" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station} value={station}>
                  {station}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <MapPin size={16} className="mr-1 text-railway-600" /> To
          </label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station} value={station}>
                  {station}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <Calendar size={16} className="mr-1 text-railway-600" /> Travel Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-end">
          <CustomButton
            type="submit"
            className="w-full"
            isLoading={isSearching}
          >
            <Search className="mr-2 h-4 w-4" /> Find Trains
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
