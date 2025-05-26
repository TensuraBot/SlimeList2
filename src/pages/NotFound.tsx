import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Film className="w-20 h-20 text-primary-400 mb-6" />
      
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-xl text-gray-300 mb-8">Oops! Page not found</p>
      
      <p className="text-gray-400 text-center max-w-md mb-8">
        Looks like this page has been isekai'd to another world. Let's get you back to the home page.
      </p>
      
      <Link to="/" className="btn-primary flex items-center">
        <Home size={18} className="mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;