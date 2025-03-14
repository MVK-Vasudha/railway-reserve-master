
import { Link } from "react-router-dom";
import { Train, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-xl font-semibold">
              <Train className="h-6 w-6 text-railway-600" />
              <span>RailReserve</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Your trusted railway reservation platform. Book tickets, check PNR status, and manage your journeys with ease.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-500 hover:text-railway-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-railway-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-railway-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-railway-600 transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-railway-600 transition-colors text-sm">Search Trains</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-railway-600 transition-colors text-sm">My Bookings</Link>
              </li>
              <li>
                <Link to="/pnr" className="text-gray-600 hover:text-railway-600 transition-colors text-sm">PNR Status</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-railway-600 transition-colors text-sm">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-railway-600 transition-colors text-sm">Cancellation Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-railway-600 transition-colors text-sm">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-railway-600 transition-colors text-sm">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-3 text-sm text-gray-600">
                <MapPin size={18} className="flex-shrink-0 text-railway-600 mt-0.5" />
                <span>123 Railway Avenue, Bangalore, Karnataka, 560001</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone size={18} className="flex-shrink-0 text-railway-600" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail size={18} className="flex-shrink-0 text-railway-600" />
                <span>support@railreserve.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} RailReserve. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Designed and developed for college project demonstration only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
