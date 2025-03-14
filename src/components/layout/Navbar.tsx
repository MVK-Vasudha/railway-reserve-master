
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Train, User, LogIn } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "My Bookings", href: "/dashboard" },
  { label: "PNR Status", href: "/pnr" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Mock login/logout
  const handleAuth = () => {
    setLoggedIn(!loggedIn);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-semibold"
            >
              <Train className="h-6 w-6 text-railway-600" />
              <span className="hidden md:block">RailReserve</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? "text-railway-700 bg-railway-50"
                      : "text-gray-700 hover:text-railway-600 hover:bg-railway-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            {loggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <CustomButton variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User size={16} />
                    <span>Account</span>
                  </CustomButton>
                </Link>
                <CustomButton onClick={handleAuth} size="sm">Logout</CustomButton>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <CustomButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAuth}
                  className="flex items-center space-x-2"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </CustomButton>
                <CustomButton onClick={handleAuth} size="sm">Register</CustomButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-railway-600 hover:bg-railway-50 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-md animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.href
                    ? "text-railway-700 bg-railway-50"
                    : "text-gray-700 hover:text-railway-600 hover:bg-railway-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {loggedIn ? (
                <div className="flex flex-col space-y-2 px-3">
                  <Link to="/dashboard" className="block" onClick={() => setIsOpen(false)}>
                    <CustomButton variant="ghost" size="sm" className="w-full justify-start">
                      <User size={16} className="mr-2" />
                      My Account
                    </CustomButton>
                  </Link>
                  <CustomButton onClick={handleAuth} size="sm">Logout</CustomButton>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 px-3">
                  <CustomButton 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAuth}
                    className="w-full justify-start"
                  >
                    <LogIn size={16} className="mr-2" />
                    Login
                  </CustomButton>
                  <CustomButton onClick={handleAuth} size="sm">Register</CustomButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
