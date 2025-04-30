
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = ({ isAuthenticated }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm py-4 px-6 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          RoommateMatch
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isAuthenticated ? (
        <>
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-primary transition-colors">
              Find Rooms
            </Link>
            <Link to="/roommates" className="text-gray-700 hover:text-primary transition-colors">
              Find Roommates
            </Link>
            <Link to="/profile/host" className="text-gray-700 hover:text-primary transition-colors">
              Host a Room
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">
              How it Works
            </Link>
            
            <Link to="/matches">
              <Button variant="outline" size="sm">
                Matches
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden fixed top-16 right-0 left-0 bg-white shadow-lg py-2 px-4 z-20">
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/rooms" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Rooms
                </Link>
                <Link 
                  to="/roommates" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Roommates
                </Link>
                <Link 
                  to="/profile/host" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Host a Room
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it Works
                </Link>
                
                <hr className="border-gray-200" />
                
                <Link 
                  to="/matches" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Matches
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/rooms" className="text-gray-700 hover:text-primary transition-colors">
            Find Rooms
          </Link>
          <Link to="/roommates" className="text-gray-700 hover:text-primary transition-colors">
            Find Roommates
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">
            How it Works
          </Link>
          
          <Link to="/login">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="default" size="sm">
              Sign up
            </Button>
          </Link>
        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
