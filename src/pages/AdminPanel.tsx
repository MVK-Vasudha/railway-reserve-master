
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Train, Users, CalendarDays, BarChart3, 
  PlusCircle, Search, Edit, Trash, Save
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomButton } from "@/components/ui/custom-button";
import { trainsData, usersData, bookingsData } from "@/utils/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { isAdminUser, addNewTrain, getAllTrains, updatePnrStatus } from "@/utils/events";

const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTrainForm, setShowAddTrainForm] = useState(false);
  const [trains, setTrains] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>(bookingsData);
  const navigate = useNavigate();
  
  // New train form state
  const [newTrain, setNewTrain] = useState({
    name: "",
    number: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    source: "",
    destination: "",
    distance: "",
    coaches: {
      sleeper: { available: 0, fare: 0 },
      ac3Tier: { available: 0, fare: 0 },
      ac2Tier: { available: 0, fare: 0 },
      acFirstClass: { available: 0, fare: 0 }
    },
    days: ["Mon", "Wed", "Fri"]
  });

  // PNR status update state
  const [pnrToUpdate, setPnrToUpdate] = useState("");
  const [newStatus, setNewStatus] = useState("confirmed");
  
  // Check if user is admin on component mount
  useEffect(() => {
    if (!isAdminUser()) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page",
        variant: "destructive"
      });
      navigate("/login");
    }
    
    // Load trains from localStorage or default
    setTrains(getAllTrains());
    
    // Setup event listener for train updates
    const handleTrainUpdate = () => {
      setTrains(getAllTrains());
    };
    
    window.addEventListener("train_updated", handleTrainUpdate);
    
    // Setup event listener for booking updates
    const handleBookingUpdate = () => {
      const userBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
      setBookings([...bookingsData, ...userBookings]);
    };
    
    window.addEventListener("booking_updated", handleBookingUpdate);
    handleBookingUpdate(); // Initial load
    
    return () => {
      window.removeEventListener("train_updated", handleTrainUpdate);
      window.removeEventListener("booking_updated", handleBookingUpdate);
    };
  }, [navigate]);
  
  const handleAddTrain = () => {
    // Validate train data
    if (!newTrain.name || !newTrain.number || !newTrain.source || !newTrain.destination) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate duration if not provided
    if (!newTrain.duration && newTrain.departureTime && newTrain.arrivalTime) {
      // Simple duration calculation for demo
      const dep = newTrain.departureTime.split(":").map(Number);
      const arr = newTrain.arrivalTime.split(":").map(Number);
      let hours = arr[0] - dep[0];
      let mins = arr[1] - dep[1];
      
      if (mins < 0) {
        hours -= 1;
        mins += 60;
      }
      if (hours < 0) hours += 24;
      
      newTrain.duration = `${hours}h ${mins}m`;
    }
    
    // Add the train
    try {
      const addedTrain = addNewTrain(newTrain);
      toast({
        title: "Success",
        description: `Train ${addedTrain.name} (${addedTrain.number}) added successfully`,
      });
      
      // Reset form and hide it
      setNewTrain({
        name: "",
        number: "",
        departureTime: "",
        arrivalTime: "",
        duration: "",
        source: "",
        destination: "",
        distance: "",
        coaches: {
          sleeper: { available: 0, fare: 0 },
          ac3Tier: { available: 0, fare: 0 },
          ac2Tier: { available: 0, fare: 0 },
          acFirstClass: { available: 0, fare: 0 }
        },
        days: ["Mon", "Wed", "Fri"]
      });
      setShowAddTrainForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add train. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdatePnrStatus = () => {
    if (!pnrToUpdate) {
      toast({
        title: "Error",
        description: "Please enter a PNR number",
        variant: "destructive"
      });
      return;
    }
    
    updatePnrStatus(pnrToUpdate, newStatus);
    toast({
      title: "Success",
      description: `PNR ${pnrToUpdate} status updated to ${newStatus}`,
    });
    
    // Reset form
    setPnrToUpdate("");
    setNewStatus("confirmed");
  };
  
  const handleTrainInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewTrain({
      ...newTrain,
      [field]: e.target.value
    });
  };
  
  const handleCoachChange = (e: React.ChangeEvent<HTMLInputElement>, coachType: string, field: 'available' | 'fare') => {
    const value = parseInt(e.target.value) || 0;
    setNewTrain({
      ...newTrain,
      coaches: {
        ...newTrain.coaches,
        [coachType]: {
          ...newTrain.coaches[coachType as keyof typeof newTrain.coaches],
          [field]: value
        }
      }
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-2xl font-bold">Railway Admin Dashboard</CardTitle>
          <CardDescription>Manage trains, users, bookings and view reports</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="trains" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="trains" className="flex items-center gap-2">
            <Train className="h-4 w-4" /> Trains
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> Bookings
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Reports
          </TabsTrigger>
        </TabsList>

        {/* Trains Management Tab */}
        <TabsContent value="trains">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Manage Trains</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search trains..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  className="flex items-center gap-1"
                  onClick={() => setShowAddTrainForm(!showAddTrainForm)}
                >
                  {showAddTrainForm ? "Cancel" : <><PlusCircle className="h-4 w-4" /> Add Train</>}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddTrainForm && (
                <Card className="mb-6 border-dashed border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Add New Train</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Train Name*</label>
                        <Input 
                          placeholder="e.g. Rajdhani Express" 
                          value={newTrain.name}
                          onChange={(e) => handleTrainInputChange(e, 'name')}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Train Number*</label>
                        <Input 
                          placeholder="e.g. 12301" 
                          value={newTrain.number}
                          onChange={(e) => handleTrainInputChange(e, 'number')}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Source Station*</label>
                        <Input 
                          placeholder="e.g. New Delhi" 
                          value={newTrain.source}
                          onChange={(e) => handleTrainInputChange(e, 'source')}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Destination Station*</label>
                        <Input 
                          placeholder="e.g. Mumbai" 
                          value={newTrain.destination}
                          onChange={(e) => handleTrainInputChange(e, 'destination')}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Departure Time</label>
                        <Input 
                          placeholder="e.g. 16:55" 
                          value={newTrain.departureTime}
                          onChange={(e) => handleTrainInputChange(e, 'departureTime')}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Arrival Time</label>
                        <Input 
                          placeholder="e.g. 22:30" 
                          value={newTrain.arrivalTime}
                          onChange={(e) => handleTrainInputChange(e, 'arrivalTime')}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Duration</label>
                        <Input 
                          placeholder="e.g. 5h 35m" 
                          value={newTrain.duration}
                          onChange={(e) => handleTrainInputChange(e, 'duration')}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Distance (km)</label>
                        <Input 
                          placeholder="e.g. 268" 
                          value={newTrain.distance}
                          onChange={(e) => handleTrainInputChange(e, 'distance')}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-3">Coach Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs">Sleeper Seats</label>
                          <Input 
                            type="number" 
                            placeholder="Available seats"
                            value={newTrain.coaches.sleeper.available || ''}
                            onChange={(e) => handleCoachChange(e, 'sleeper', 'available')}
                          />
                          <Input 
                            type="number" 
                            placeholder="Fare"
                            value={newTrain.coaches.sleeper.fare || ''}
                            onChange={(e) => handleCoachChange(e, 'sleeper', 'fare')}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs">AC 3-Tier Seats</label>
                          <Input 
                            type="number" 
                            placeholder="Available seats"
                            value={newTrain.coaches.ac3Tier.available || ''}
                            onChange={(e) => handleCoachChange(e, 'ac3Tier', 'available')}
                          />
                          <Input 
                            type="number" 
                            placeholder="Fare"
                            value={newTrain.coaches.ac3Tier.fare || ''}
                            onChange={(e) => handleCoachChange(e, 'ac3Tier', 'fare')}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs">AC 2-Tier Seats</label>
                          <Input 
                            type="number" 
                            placeholder="Available seats"
                            value={newTrain.coaches.ac2Tier.available || ''}
                            onChange={(e) => handleCoachChange(e, 'ac2Tier', 'available')}
                          />
                          <Input 
                            type="number" 
                            placeholder="Fare"
                            value={newTrain.coaches.ac2Tier.fare || ''}
                            onChange={(e) => handleCoachChange(e, 'ac2Tier', 'fare')}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs">First Class AC Seats</label>
                          <Input 
                            type="number" 
                            placeholder="Available seats"
                            value={newTrain.coaches.acFirstClass.available || ''}
                            onChange={(e) => handleCoachChange(e, 'acFirstClass', 'available')}
                          />
                          <Input 
                            type="number" 
                            placeholder="Fare"
                            value={newTrain.coaches.acFirstClass.fare || ''}
                            onChange={(e) => handleCoachChange(e, 'acFirstClass', 'fare')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleAddTrain} className="flex items-center gap-1">
                        <Save className="h-4 w-4" /> Save Train
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Train Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Arrival</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trains.filter(train => 
                      train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      train.number.toString().includes(searchTerm)
                    ).map((train) => (
                      <TableRow key={train.id}>
                        <TableCell className="font-medium">{train.number}</TableCell>
                        <TableCell>{train.name}</TableCell>
                        <TableCell>{train.source}</TableCell>
                        <TableCell>{train.destination}</TableCell>
                        <TableCell>{train.departureTime}</TableCell>
                        <TableCell>{train.arrivalTime}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the train {train.name} ({train.number}) and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-destructive">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Manage Users</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData.filter(user => 
                      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">#{user.id.toString().padStart(4, '0')}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 
                            user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the user {user.name} and all their booking history.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-destructive">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Management Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Manage Bookings</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by PNR or name..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Update PNR Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">PNR Number</label>
                      <Input 
                        placeholder="Enter PNR number" 
                        value={pnrToUpdate}
                        onChange={(e) => setPnrToUpdate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Status</label>
                      <Select value={newStatus} onValueChange={(value) => setNewStatus(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="waiting">Waiting</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleUpdatePnrStatus} className="flex items-center gap-1">
                        <Save className="h-4 w-4" /> Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PNR Number</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Train</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.filter(booking => 
                      booking.pnr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      booking.userName?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.pnr}</TableCell>
                        <TableCell>{booking.userName}</TableCell>
                        <TableCell>{booking.trainName} ({booking.trainNumber})</TableCell>
                        <TableCell>{booking.journeyDate}</TableCell>
                        <TableCell>{booking.seats?.join(", ")}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            booking.status === 'delayed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            {booking.status !== 'cancelled' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                                    Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will cancel booking {booking.pnr} and initiate a refund based on cancellation policy.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>No, keep it</AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive">Yes, cancel booking</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports and Analytics Tab */}
        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
                <CardDescription>Last 30 days booking revenue</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <div className="h-64 w-full bg-slate-100 flex items-center justify-center rounded-md border">
                  <p className="text-muted-foreground">Revenue chart placeholder</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Booking Statistics</CardTitle>
                <CardDescription>Bookings by status</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <div className="h-64 w-full bg-slate-100 flex items-center justify-center rounded-md border">
                  <p className="text-muted-foreground">Booking stats chart placeholder</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Trains by Booking</CardTitle>
                <CardDescription>Most popular train routes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Train</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Total Bookings</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Avg. Occupancy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: 1, name: "Rajdhani Express", route: "Delhi - Mumbai", bookings: 428, revenue: "₹852,340", occupancy: "92%" },
                        { id: 2, name: "Shatabdi Express", route: "Delhi - Agra", bookings: 352, revenue: "₹523,600", occupancy: "88%" },
                        { id: 3, name: "Duronto Express", route: "Mumbai - Kolkata", bookings: 289, revenue: "₹723,450", occupancy: "85%" },
                        { id: 4, name: "Vande Bharat", route: "Delhi - Varanasi", bookings: 265, revenue: "₹624,800", occupancy: "82%" },
                      ].map((train) => (
                        <TableRow key={train.id}>
                          <TableCell className="font-medium">{train.name}</TableCell>
                          <TableCell>{train.route}</TableCell>
                          <TableCell>{train.bookings}</TableCell>
                          <TableCell>{train.revenue}</TableCell>
                          <TableCell>{train.occupancy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
