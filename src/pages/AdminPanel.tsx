
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Train, Users, CalendarDays, BarChart3, 
  PlusCircle, Search, Edit, Trash
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomButton } from "@/components/ui/custom-button";
import { trainsData, usersData, bookingsData } from "@/utils/mockData";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
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
                <Button className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Add Train
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
                    {trainsData.filter(train => 
                      train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      train.trainNumber.toString().includes(searchTerm)
                    ).map((train) => (
                      <TableRow key={train.id}>
                        <TableCell className="font-medium">{train.trainNumber}</TableCell>
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
                                    This will permanently delete the train {train.name} ({train.trainNumber}) and cannot be undone.
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
                    {bookingsData.filter(booking => 
                      booking.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      booking.userName.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.pnr}</TableCell>
                        <TableCell>{booking.userName}</TableCell>
                        <TableCell>{booking.trainName} ({booking.trainNumber})</TableCell>
                        <TableCell>{booking.journeyDate}</TableCell>
                        <TableCell>{booking.seats.join(", ")}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
