import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from './Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 gradient-primary rounded-custom flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">EventHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Events
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">
              About
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-indigo-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/events"
              className="block text-gray-700 hover:text-indigo-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 hover:text-indigo-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" size="sm" fullWidth>
                Login
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="sm" fullWidth>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
