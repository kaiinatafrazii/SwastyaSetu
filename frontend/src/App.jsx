import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import EmergencyHome from './pages/EmergencyHome';
import FirstAidLibrary from './pages/FirstAidLibrary';
import EmergencyGuide from './pages/EmergencyGuide';
import Helplines from './pages/Helplines';
import Hospitals from './pages/Hospitals';
import AIAssistant from './pages/AIAssistant';
import Dashboard from './pages/Dashboard';
import AboutSafety from './pages/AboutSafety';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<EmergencyHome />} />
          <Route path="/library" element={<FirstAidLibrary />} />
          <Route path="/guide/:id" element={<EmergencyGuide />} />
          <Route path="/helplines" element={<Helplines />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/about" element={<AboutSafety />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
