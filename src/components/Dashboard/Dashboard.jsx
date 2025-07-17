import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Camera, 
  Heart, 
  MessageCircle, 
  LogOut, 
  User, 
  Settings,
  Globe,
  BarChart3,
  Cloud
} from 'lucide-react';
import SoilAnalysis from './SoilAnalysis';
import CropDiseaseDetection from './CropDiseaseDetection';
import AnimalHealthDiagnosis from './AnimalHealthDiagnosis';
import AIVideoChat from './AIVideoChat';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('soil');
  const [language, setLanguage] = useState('en');
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

  const tabs = [
    { id: 'soil', label: 'Soil Analysis', icon: Cloud, color: 'bg-amber-500' },
    { id: 'crop', label: 'Crop Disease', icon: Leaf, color: 'bg-green-500' },
    { id: 'animal', label: 'Animal Health', icon: Heart, color: 'bg-blue-500' },
    { id: 'chat', label: 'AI Consultation', icon: MessageCircle, color: 'bg-purple-500' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'soil':
        return <SoilAnalysis language={language} />;
      case 'crop':
        return <CropDiseaseDetection language={language} />;
      case 'animal':
        return <AnimalHealthDiagnosis language={language} />;
      case 'chat':
        return <AIVideoChat language={language} />;
      default:
        return <SoilAnalysis language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-800">AgriAI Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {currentUser?.displayName || currentUser?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <nav className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Features</h2>
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${tab.color}`}>
                      <tab.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Stats Card */}
              <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6" />
                  <h3 className="font-semibold">Your Impact</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-100">Scans completed</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-100">Crops analyzed</span>
                    <span className="font-semibold">43</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-100">Success rate</span>
                    <span className="font-semibold">94%</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;