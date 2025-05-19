import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-md lg:min-w-full">
      <div className="container mx-auto">
        <Link to="/" className="text-white text-2xl font-bold hover:text-blue-200">
          Countries of the World
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;