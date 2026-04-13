import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import DiagnoseImage from './pages/DiagnoseImage';
import DiagnoseAudio from './pages/DiagnoseAudio';
import OutbreakPredictor from './pages/OutbreakPredictor';
import VetAssistant from './pages/VetAssistant';
import VaccinationTracker from './pages/VaccinationTracker';
import DiseaseMap from './pages/DiseaseMap';
import EconomicPredictor from './pages/EconomicPredictor';
// import Login from './pages/Login';

import CustomCursor from './components/CustomCursor';
import { 
  LayoutDashboard, 
  Camera, 
  Mic, 
  Activity, 
  MessageSquare, 
  ShieldCheck, 
  Map as MapIcon, 
  TrendingDown, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { loading } = useAuth();
  if (loading) return (
    <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-white">
      <div className="spinner-border text-primary mb-3" role="status"></div>
      <h5 className="fw-bold animate-pulse">Initializing Neural Engines...</h5>
    </div>
  );
  return children;
};

const Layout = ({ children }) => {
  const { logout } = useAuth();
  return (
    <>
      <CustomCursor />
      <nav className="navbar navbar-expand-lg main-nav mb-5 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-extrabold text-white d-flex align-items-center gap-2" href="/">
            <div className="bg-success p-1 rounded-circle shadow-sm">
               <ShieldCheck size={28} className="text-primary-dark" strokeWidth={3} style={{ color: '#0F172A' }} />
            </div>
            <div className="d-flex flex-column lh-1">
               <span style={{ letterSpacing: '-1.5px', fontSize: '1.6rem' }}>PoultryGuard<span className="text-info">AI</span></span>
               <small className="fw-bold text-success x-small" style={{ letterSpacing: '2px', fontSize: '0.6rem' }}>BHARAT_EDITION</small>
            </div>
          </a>
          
          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav mx-auto bg-secondary bg-opacity-50 rounded-pill px-4 py-1 gap-2 border border-slate-700">
              <li className="nav-item">
                <a className="nav-link nav-link-premium d-flex align-items-center gap-2" href="/">
                  <LayoutDashboard size={18} className="text-success" /> Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link nav-link-premium d-flex align-items-center gap-2" href="/diagnose-image">
                  <Camera size={18} className="text-success" /> Visual AI
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link nav-link-premium d-flex align-items-center gap-2" href="/diagnose-audio">
                  <Mic size={18} className="text-success" /> Acoustic AI
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link nav-link-premium d-flex align-items-center gap-2" href="/vet-chat">
                  <MessageSquare size={18} className="text-success" /> Vet Assistant
                </a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link nav-link-premium dropdown-toggle d-flex align-items-center gap-2" href="#" id="analyticsDropdown" role="button" data-bs-toggle="dropdown">
                  Analytics
                </a>
                <ul className="dropdown-menu dropdown-menu-dark glass-card border-0 shadow-lg p-2 mt-2">
                  <li><a className="dropdown-item rounded-3 mb-1 d-flex align-items-center gap-2" href="/outbreak"><Activity size={16} className="text-danger" /> Spread Predictor</a></li>
                  <li><a className="dropdown-item rounded-3 mb-1 d-flex align-items-center gap-2" href="/map"><MapIcon size={16} className="text-info" /> Disease Map</a></li>
                  <li><a className="dropdown-item rounded-3 d-flex align-items-center gap-2" href="/economic"><TrendingDown size={16} className="text-warning" /> Risk Forecast</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link nav-link-premium d-flex align-items-center gap-2" href="/vaccinations">
                  <ShieldCheck size={18} className="text-success" /> Compliance
                </a>
              </li>
            </ul>
            
            <button 
              className="btn btn-outline-danger rounded-pill px-4 d-flex align-items-center gap-2 transition-all fw-bold border-2" 
              onClick={logout}
              style={{ fontSize: '0.8rem', borderColor: '#EF4444', color: '#EF4444' }}
            >
              <LogOut size={16} /> LOGOUT
            </button>
          </div>
        </div>
      </nav>
      <div className="bharat-flag-accent"></div>
      <main className="container pb-5">
        {children}
      </main>
      <footer className="container-fluid py-5 mt-auto border-top border-slate-800" style={{ backgroundColor: '#0B1120' }}>
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small gap-3">
          <p className="mb-0">© 2026 PoultryGuard <span className="text-success fw-bold">AI</span> (Bharat). Serving India's Poultry Ecosystem.</p>
          <div className="d-flex gap-4">
             <a href="#" className="text-decoration-none text-muted transition-colors hover:text-cyan-400">Documentation</a>
             <a href="#" className="text-decoration-none text-muted transition-colors hover:text-cyan-400">Security Protocols</a>
             <a href="#" className="text-decoration-none text-muted transition-colors hover:text-cyan-400">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/diagnose-image" element={<ProtectedRoute><Layout><DiagnoseImage /></Layout></ProtectedRoute>} />
          <Route path="/diagnose-audio" element={<ProtectedRoute><Layout><DiagnoseAudio /></Layout></ProtectedRoute>} />
          <Route path="/outbreak" element={<ProtectedRoute><Layout><OutbreakPredictor /></Layout></ProtectedRoute>} />
          <Route path="/vet-chat" element={<ProtectedRoute><Layout><VetAssistant /></Layout></ProtectedRoute>} />
          <Route path="/vaccinations" element={<ProtectedRoute><Layout><VaccinationTracker /></Layout></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><Layout><DiseaseMap /></Layout></ProtectedRoute>} />
          <Route path="/economic" element={<ProtectedRoute><Layout><EconomicPredictor /></Layout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
