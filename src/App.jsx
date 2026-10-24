import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import UploadVideo from './pages/UploadVideo';
import Analysis from './pages/Analysis';
import Results from './pages/Results';
import About from './pages/About';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Primary Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/results" element={<Results />} />
          <Route path="/how-it-works" element={<About />} />
          <Route path="/about" element={<About />} />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Product Architecture & Medical Disclaimer Footer */}
      <Footer />
    </div>
  );
}

export default App;
