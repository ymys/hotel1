import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-vinotel-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-2xl font-bold text-vinotel-primary">VINOTEL</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-vinotel-primary transition-colors">
              Home
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-vinotel-primary transition-colors">
              Search Hotels
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-vinotel-primary transition-colors">
              My Bookings
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button onClick={() => navigate('/register')}>
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-vinotel-primary"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-vinotel-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="text-gray-700 hover:text-vinotel-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Search Hotels
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-vinotel-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Bookings
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button variant="ghost" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button onClick={() => { navigate('/register'); setIsMenuOpen(false); }}>
                  Sign Up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;