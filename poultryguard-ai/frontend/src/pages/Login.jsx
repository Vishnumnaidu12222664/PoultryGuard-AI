import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Mail, Lock, CheckCircle, Github, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import loginImg from '../assets/login_bg.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(email, password);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError('Authentication failed. Please verify your secure credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 vh-100 overflow-hidden">
      <div className="row g-0 h-100">
        {/* Left Side: Visuals */}
        <div className="col-lg-7 d-none d-lg-block position-relative">
          <div 
            className="h-100 w-100" 
            style={{ 
              backgroundImage: `url(${loginImg})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              filter: 'brightness(0.6)'
            }}
          />
          <div className="position-absolute top-50 start-50 translate-middle text-white text-center w-75 animate-fade-in">
            <div className="bg-accent d-inline-block p-4 rounded-circle mb-4 animate-float shadow-lg">
                <ShieldCheck size={64} className="text-dark" strokeWidth={2.5} />
            </div>
            <h1 className="display-3 fw-extrabold mb-3" style={{ letterSpacing: '-2px' }}>PoultryGuard<span className="text-accent">AI</span></h1>
            <p className="lead opacity-75 fw-medium">Advanced Biosafety Monitoring & Disease Intelligence</p>
            <div className="d-flex justify-content-center gap-4 mt-5">
               <div className="text-center">
                  <h4 className="fw-bold mb-0">99.2%</h4>
                  <small className="opacity-50">Visual Accuracy</small>
               </div>
               <div className="vr opacity-25"></div>
               <div className="text-center">
                  <h4 className="fw-bold mb-0">RAG-V4</h4>
                  <small className="opacity-50">Knowledge Base</small>
               </div>
               <div className="vr opacity-25"></div>
               <div className="text-center">
                  <h4 className="fw-bold mb-0">&lt;2s</h4>
                  <small className="opacity-50">Response Time</small>
               </div>
            </div>
          </div>
          <div className="position-absolute bottom-0 start-0 p-5 text-white opacity-50 small">
            SYSTEM NODE: BRN-AGRO-72 // SECURE CONNECTION ACTIVE
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="col-lg-5 col-12 d-flex align-items-center justify-content-center bg-primary p-5" style={{ backgroundColor: '#0F172A' }}>
          <div className="w-100 animate-fade-in" style={{ maxWidth: '420px', animationDelay: '0.2s' }}>
            <div className="mb-5">
              <h2 className="fw-extrabold text-white display-6 mb-2">Welcome Back</h2>
              <p className="text-muted">Enter your secure credentials to access the command center.</p>
            </div>

            {error && (
              <div className="alert alert-danger border-0 glass-card bg-danger bg-opacity-10 text-danger p-3 rounded-3 d-flex align-items-center gap-2 mb-4 animate-pulse-warning">
                <CheckCircle size={18} />
                <small className="fw-bold">{error}</small>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-extrabold text-muted mb-2 tracking-widest">NETWORK IDENTIFIER (EMAIL)</label>
                <div className="input-group">
                  <span className="input-group-text bg-secondary border-slate-700"><Mail size={18} className="text-info" /></span>
                  <input 
                    type="email" 
                    className="form-control bg-secondary border-slate-700 p-3 text-white" 
                    placeholder="name@poultryguard.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between">
                   <label className="form-label small fw-extrabold text-muted mb-2 tracking-widest">ACCESS KEY (PASSWORD)</label>
                   <a href="#" className="text-decoration-none small fw-bold text-info">Forgot?</a>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-secondary border-slate-700"><Lock size={18} className="text-info" /></span>
                  <input 
                    type="password" 
                    className="form-control bg-secondary border-slate-700 p-3 text-white" 
                    placeholder="••••••••"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="mb-4 form-check">
                <input type="checkbox" className="form-check-input bg-secondary border-slate-700" id="remember" />
                <label className="form-check-label small fw-medium text-muted" htmlFor="remember">Keep session persistent on this node</label>
              </div>

              <button 
                type="submit" 
                className="btn btn-premium w-100 py-3 mb-4 shadow-lg d-flex align-items-center justify-content-center gap-2" 
                disabled={loading}
              >
                {loading ? 'AUTHENTICATING...' : (
                  <>ACCESS COMMAND CENTER <ArrowRight size={18} /></>
                )}
              </button>

              <div className="text-center mb-4 position-relative">
                 <span className="text-muted small px-3 bg-primary position-relative" style={{ zIndex: 1, backgroundColor: '#0F172A' }}>OR SECURE SSO</span>
                 <hr className="mt-n2 opacity-25 border-slate-700" style={{ position: 'relative', top: '-10px' }} />
              </div>

              <div className="row g-2">
                <div className="col-6">
                   <button type="button" className="btn btn-outline-premium w-100 py-2 d-flex align-items-center justify-content-center gap-2 border-1">
                      <Globe size={16} /> Google
                   </button>
                </div>
                <div className="col-6">
                   <button type="button" className="btn btn-outline-premium w-100 py-2 d-flex align-items-center justify-content-center gap-2 border-1">
                      <Github size={16} /> GitHub
                   </button>
                </div>
              </div>

              <p className="text-center mt-5 small text-muted">
                Need node access? <a href="#" className="fw-bold text-success text-decoration-none">Contact Network Admin</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
