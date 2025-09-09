import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-vinotel-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-vinotel-primary font-bold text-lg">V</span>
              </div>
              <span className="text-2xl font-bold">VINOTEL</span>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">
              Your trusted partner for luxury Vinotel branch bookings worldwide. Experience comfort, elegance, and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                  Search Hotels
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-vinotel-secondary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-vinotel-secondary" />
                <span className="text-gray-200">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-vinotel-secondary" />
                <span className="text-gray-200">support@vinotel.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-vinotel-secondary mt-0.5" />
                <span className="text-gray-200">
                  123 Luxury Avenue<br />
                  New York, NY 10001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-200 text-sm">
            &copy; 2024 Vinotel. All rights reserved. | Designed with ❤️ for luxury travelers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;