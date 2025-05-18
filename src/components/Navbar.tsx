import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, MessageCircle, User, Search, Bookmark, Settings, TrendingUp } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center font-bold text-xl hover:opacity-80 transition-opacity"
          >
            <MessageCircle className="mr-2" />
            <span>iandu</span>
          </Link>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-full px-4 py-2 pl-10 focus:outline-none focus:border-white transition-colors"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/trending" 
              className="text-gray-300 hover:text-white transition-colors p-2"
              title="Trending"
            >
              <TrendingUp size={20} />
            </Link>
            {user && (
              <>
                <Link 
                  to="/bookmarks" 
                  className="text-gray-300 hover:text-white transition-colors p-2"
                  title="Bookmarks"
                >
                  <Bookmark size={20} />
                </Link>
                <Link 
                  to="/settings" 
                  className="text-gray-300 hover:text-white transition-colors p-2"
                  title="Settings"
                >
                  <Settings size={20} />
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 backdrop-blur-lg bg-opacity-90 border-t border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="search"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:border-white transition-colors"
              />
            </form>
            
            <Link 
              to="/trending" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <TrendingUp size={18} className="mr-2" />
              Trending
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/bookmarks" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bookmark size={18} className="mr-2" />
                  Bookmarks
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={18} className="mr-2" />
                  Settings
                </Link>
                <Link 
                  to="/dashboard" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <>
                <Link 
                  to="/login" 
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;