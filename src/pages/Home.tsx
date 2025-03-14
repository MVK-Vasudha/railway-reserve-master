
import { useState } from "react";
import { Link } from "react-router-dom";
import { Train, Map, Clock, Shield, Search, Ticket, BarChart3 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import SearchForm from "@/components/train/SearchForm";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "@/hooks/use-toast";

const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = (email: string, password: string) => {
    console.log("Login:", email, password);
    toast({
      title: "Login Successful",
      description: "Welcome back to RailReserve!",
    });
  };

  const handleRegister = (name: string, email: string, password: string) => {
    console.log("Register:", name, email, password);
    toast({
      title: "Registration Successful",
      description: "Your account has been created successfully!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-railway-950/80 to-railway-900/60 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-slide-down">
              Book Your Railway Journey with Ease
            </h1>
            <p className="text-lg text-white/90 mb-8 animate-slide-down" style={{ animationDelay: "0.1s" }}>
              Experience seamless train ticket booking, PNR status checks, and journey management with our modern reservation platform.
            </p>
            <div className="animate-slide-down" style={{ animationDelay: "0.2s" }}>
              <CustomButton
                size="lg"
                onClick={() => setShowAuthModal(true)}
                className="mr-4"
              >
                Get Started
              </CustomButton>
              <Link to="/search">
                <CustomButton
                  variant="outline"
                  size="lg"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <Search className="mr-2 h-4 w-4" /> Search Trains
                </CustomButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-30">
        <div className="animate-slide-up">
          <SearchForm />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 mt-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-bold mb-4">Why Choose RailReserve</h2>
            <p className="text-gray-600">
              Our platform offers a comprehensive railway reservation experience with cutting-edge features designed for maximum convenience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-glass-hover animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="bg-railway-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Train className="h-6 w-6 text-railway-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book tickets in just a few clicks with our intuitive and user-friendly interface.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-glass-hover animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="bg-railway-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Map className="h-6 w-6 text-railway-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your journey status and get real-time updates on train schedules.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-glass-hover animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="bg-railway-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-railway-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Enjoy peace of mind with our secure payment gateway for all transactions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600">
              Experience a seamless booking process from start to finish.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-railway-100 flex items-center justify-center mx-auto mb-4 relative">
                <Search className="h-8 w-8 text-railway-600" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-railway-600 text-white flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">
                Enter your origin, destination and travel date to find available trains.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-railway-100 flex items-center justify-center mx-auto mb-4 relative">
                <Train className="h-8 w-8 text-railway-600" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-railway-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Select</h3>
              <p className="text-gray-600">
                Choose your preferred train and class based on availability and pricing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-railway-100 flex items-center justify-center mx-auto mb-4 relative">
                <Ticket className="h-8 w-8 text-railway-600" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-railway-600 text-white flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-gray-600">
                Enter passenger details and complete the secure payment process.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-railway-100 flex items-center justify-center mx-auto mb-4 relative">
                <BarChart3 className="h-8 w-8 text-railway-600" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-railway-600 text-white flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track</h3>
              <p className="text-gray-600">
                Manage your bookings and get real-time updates on your journey.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-railway-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Book Your Journey?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have experienced the convenience of our railway reservation system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <CustomButton
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-railway-900 hover:bg-white/90"
            >
              Sign Up Now
            </CustomButton>
            <Link to="/search">
              <CustomButton
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Search Trains
              </CustomButton>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default Home;
