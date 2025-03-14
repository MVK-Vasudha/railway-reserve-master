
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "@/hooks/use-toast";
import { X, Check, User, Lock, Mail, UserPlus } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLoginEmail("");
      setLoginPassword("");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setIsLoggingIn(false);
      setIsRegistering(false);
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!loginEmail || !loginPassword) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }
      
      onLogin(loginEmail, loginPassword);
      toast({
        title: "Success",
        description: "You have been logged in successfully",
        variant: "default",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        setIsRegistering(false);
        return;
      }
      
      if (registerPassword !== registerConfirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setIsRegistering(false);
        return;
      }
      
      onRegister(registerName, registerEmail, registerPassword);
      toast({
        title: "Success",
        description: "Account created successfully! You can now login.",
        variant: "default",
      });
      setActiveTab("login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onEscapeKeyDown={onClose}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Welcome to RailReserve
          </DialogTitle>
          <p className="text-center text-gray-600 text-sm">
            Sign in to your account or create a new one
          </p>
        </DialogHeader>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-sm">Login</TabsTrigger>
            <TabsTrigger value="register" className="text-sm">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 mt-2">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-railway-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <CustomButton
                type="submit"
                className="w-full mt-6"
                isLoading={isLoggingIn}
              >
                <Check className="mr-2 h-4 w-4" /> Login
              </CustomButton>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4 mt-2">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="reg-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <CustomButton
                type="submit"
                className="w-full mt-6"
                isLoading={isRegistering}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Create Account
              </CustomButton>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
