import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import Navbar from './components/Layout/Navbar';
import HeroSection from './components/Home/HeroSection';
import FeaturesSection from './components/Home/FeaturesSection';
import StatsSection from './components/Home/StatsSection';
import HowItWorksSection from './components/Home/HowItWorksSection';
import TestimonialsSection from './components/Home/TestimonialsSection';
import CTASection from './components/Home/CTASection';
import FooterSection from './components/Home/FooterSection';
import RealTimeDashboard from './components/Dashboard/RealTimeDashboard';
import EnhancedSoilAnalysis from './components/Dashboard/EnhancedSoilAnalysis';
import EnhancedCropDiseaseDetection from './components/Dashboard/EnhancedCropDiseaseDetection';
import AnimalHealthDiagnosis from './components/Dashboard/AnimalHealthDiagnosis';
import AIVideoChat from './components/Dashboard/AIVideoChat';
import ChatFab from './components/Chat/ChatFab';
import YieldEstimation from './components/Dashboard/YieldEstimation';


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />;
};

const MainApp = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [language, setLanguage] = useState('en');

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <HeroSection />
            <FeaturesSection />
            <StatsSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CTASection />
            <FooterSection />
          </>
        );
      case 'dashboard':
        return <RealTimeDashboard language={language} />;
      case 'soil':
        return <EnhancedSoilAnalysis language={language} />;
      case 'crop':
        return <EnhancedCropDiseaseDetection language={language} />;
      case 'animal':
        return <AnimalHealthDiagnosis language={language} />;
      case 'chat':
        return <AIVideoChat language={language} />;
        case 'yield':
  return <YieldEstimation />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        language={language}
        setLanguage={setLanguage}
      />
      <main>
        {renderContent()}
      </main>
      <ChatFab language={language} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;