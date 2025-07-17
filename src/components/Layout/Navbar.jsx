import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  Menu,
  X,
  User,
  LogOut,
  Home,
  Cloud,
  Heart,
  MessageCircle,
  BarChart3,
  Globe
} from 'lucide-react';

const Navbar = ({ activeSection, setActiveSection, language, setLanguage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'ki', name: 'Kikuyu' },
    { code: 'kln', name: 'Kalenjin' },
    { code: 'kip', name: 'Kipsigis' }
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'soil', label: 'Soil Analysis', icon: Cloud },
    { id: 'crop', label: 'Crop Disease', icon: Leaf },
    { id: 'animal', label: 'Animal Health', icon: Heart },
    { id: 'chat', label: 'AI Consultation', icon: MessageCircle },
    { id: 'yield', label: 'Yield Estimation', icon: Globe } // ✅ Added Yield Estimation
  ];

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-1.5 rounded-lg">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                agri-poa
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-1 justify-center mx-4">
              <div className="flex space-x-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === item.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <div className="relative hidden md:block">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
              </div>

              {/* User Info */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-700 max-w-24 truncate">
                    {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-gray-600 hover:text-green-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
          >
            <div className="p-4">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-1.5 rounded-lg">
                  <Leaf className="text-white w-5 h-5" />
                </div>
                <h1 className="ml-2 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  AgriPOA
                </h1>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === item.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-700 truncate">
                        {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
