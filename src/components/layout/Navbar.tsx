import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Search, List, User, LogOut, Menu, X, Film
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, signOut, username } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/search', label: 'Search', icon: <Search size={20} /> },
    { path: '/my-list', label: 'My List', icon: <List size={20} />, requiresAuth: true },
    { path: '/profile', label: 'Profile', icon: <User size={20} />, requiresAuth: true },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-dark-900 shadow-lg flex-col p-6">
        <Link to="/" className="flex items-center mb-10">
          <Film className="w-8 h-8 text-primary-400" />
          <span className="text-2xl font-bold ml-2 text-white">SlimeList</span>
        </Link>
        
        <div className="flex flex-col space-y-2 flex-grow">
          {navItems.map((item) => {
            if (item.requiresAuth && !user) return null;
            
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? 'bg-primary-400 text-white' 
                    : 'text-gray-300 hover:bg-dark-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-auto">
          {user ? (
            <div className="border-t border-dark-700 pt-4">
              <div className="mb-4 px-4">
                <p className="text-sm text-gray-400">Logged in as</p>
                <p className="font-medium text-white">{username}</p>
              </div>
              <button 
                onClick={() => signOut()} 
                className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-dark-700 rounded-lg"
              >
                <LogOut size={20} className="mr-3" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="border-t border-dark-700 pt-4 space-y-2">
              <Link 
                to="/login" 
                className="flex items-center w-full px-4 py-2 text-white bg-primary-400 hover:bg-primary-500 rounded-lg justify-center"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="flex items-center w-full px-4 py-2 text-primary-400 border border-primary-400 hover:bg-primary-400 hover:text-white rounded-lg justify-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
      
      {/* Mobile Navbar (Top) */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 bg-dark-900 shadow-md z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center">
            <Film className="w-6 h-6 text-primary-400" />
            <span className="text-xl font-bold ml-2 text-white">SlimeList</span>
          </Link>
          
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-gray-300 hover:bg-dark-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="bg-dark-900 absolute w-full p-4 shadow-lg animate-fade-in">
            {navItems.map((item) => {
              if (item.requiresAuth && !user) return null;
              
              return (
                <Link 
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-4 py-3 rounded-lg transition-colors mb-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-primary-400">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            {user ? (
              <>
                <div className="border-t border-dark-700 my-2 pt-2">
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-400">Logged in as</p>
                    <p className="font-medium text-white">{username}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }} 
                  className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-dark-700 rounded-lg"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="border-t border-dark-700 my-2 pt-2 flex space-x-2 px-4">
                <Link 
                  to="/login" 
                  className="flex-1 py-2 text-center text-white bg-primary-400 hover:bg-primary-500 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="flex-1 py-2 text-center text-primary-400 border border-primary-400 hover:bg-primary-400 hover:text-white rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
      
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-900 shadow-md z-10">
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.slice(0, 4).map((item) => {
            if (item.requiresAuth && !user) return null;
            
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 ${
                  isActive(item.path) 
                    ? 'text-primary-400' 
                    : 'text-gray-400'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
          
          {!user && (
            <Link 
              to="/login"
              className="flex flex-col items-center p-2 text-gray-400"
            >
              <User size={20} />
              <span className="text-xs mt-1">Login</span>
            </Link>
          )}
        </div>
      </nav>
      
      {/* Content padding for fixed navbars */}
      <div className="lg:pl-64 pt-14 pb-16 lg:pb-0 min-h-screen">
        {/* Main content will be rendered here */}
      </div>
    </>
  );
};

export default Navbar;