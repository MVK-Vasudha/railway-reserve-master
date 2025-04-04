
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminLogin } from "@/utils/events";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (loginType === "admin") {
        // Try admin login
        const success = adminLogin(email, password);
        
        if (success) {
          toast({
            title: "Success",
            description: "You have logged in as admin",
          });
          navigate("/admin");
        } else {
          toast({
            title: "Error",
            description: "Invalid admin credentials",
            variant: "destructive",
          });
        }
      } else {
        // Regular user login
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set login state in localStorage
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", email.split('@')[0]);
        
        toast({
          title: "Success",
          description: "You have logged in successfully",
        });
        
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-railway-600 hover:text-railway-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your RailReserve account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
            <Tabs defaultValue="user" value={loginType} onValueChange={setLoginType} className="w-full mt-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="user">User Login</TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Admin Login
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder={loginType === "admin" ? "admin@railreserve.com" : "you@example.com"}
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {loginType === "admin" && (
                  <p className="text-xs text-muted-foreground">
                    For demo purposes, use admin@railreserve.com / admin123
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-railway-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <CustomButton 
                type="submit" 
                className="w-full mt-6" 
                isLoading={isLoading}
              >
                {loginType === "admin" ? "Sign In as Admin" : "Sign In"}
              </CustomButton>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full border-t border-gray-200 my-2"></div>
            {loginType === "user" && (
              <p className="text-sm text-center text-gray-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-railway-600 hover:underline font-medium">
                  Create an account
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
