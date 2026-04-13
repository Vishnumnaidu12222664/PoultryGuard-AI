import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Mic, 
  Activity, 
  MessageSquare, 
  Calendar, 
  Map as MapIcon, 
  TrendingDown, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  AlertTriangle,
  Zap,
  ChevronRight,
  Database,
  Search,
  LayoutDashboard
} from 'lucide-react';

const StatCard = ({ title, value, sub, icon: Icon, color, delay }) => (
  <div className="glass-card p-4 hover-lift animate-fade-in" style={{ animationDelay: `${delay}s`, backgroundColor: '#1E293B', border: '1px solid #334155' }}>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className={`p-3 rounded-circle bg-${color} bg-opacity-20`}>
        <Icon size={24} className={`text-${color}`} />
      </div>
      <span className="badge bg-success bg-opacity-20 text-success rounded-pill px-3 py-1 small fw-bold border border-success border-opacity-20">Active</span>
    </div>
    <h3 className="fw-extrabold mb-1 text-white">{value}</h3>
    <p className="text-info small fw-bold mb-0 text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>{title}</p>
    <div className="mt-3 pt-3 border-top border-slate-700 d-flex align-items-center gap-1">
       <TrendingUp size={12} className="text-success" />
       <span className="text-success x-small fw-bold">{sub}</span>
       <span className="text-white text-opacity-50 x-small ms-1">vs last month</span>
    </div>
  </div>
);

const FeatureCard = ({ title, icon: Icon, color, link, description, delay }) => {
  const navigate = useNavigate();
  return (
    <div 
      className="dark-glass-card hover-lift h-100 p-4 animate-fade-in cursor-pointer border-slate-700" 
      onClick={() => navigate(link)}
      style={{ 
        animationDelay: `${delay}s`,
        background: `linear-gradient(135deg, rgba(16, 42, 67, 0.95) 0%, rgba(36, 59, 83, 0.95) 100%)`
      }}
    >
      <div className="d-flex flex-column h-100">
        <div className={`rounded-4 bg-${color} bg-opacity-20 p-3 d-inline-block mb-4 align-self-start shadow-sm border border-${color} border-opacity-10`}>
          <Icon size={28} className={`text-${color}`} />
        </div>
        <h4 className="fw-bold mb-3 text-white">{title}</h4>
        <p className="text-white text-opacity-75 small mb-4 flex-grow-1 leading-relaxed">{description}</p>
        <div className="d-flex align-items-center text-info fw-bold small group mt-auto">
          INITIALIZE MODULE <ChevronRight size={18} className="ms-2 transition-all transform group-hover:translate-x-2" />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const features = [
    { title: 'Visual AI Diagnostic', icon: Camera, color: 'primary', link: '/diagnose-image', description: 'Real-time neural network analysis of poultry physical symptoms and fecal pathology.', delay: 0.1 },
    { title: 'Acoustic Health Sync', icon: Mic, color: 'info', link: '/diagnose-audio', description: 'Advanced frequency analysis to detect respiratory distress and abnormal flock calls.', delay: 0.2 },
    { title: 'Vet Assistant RAG', icon: MessageSquare, color: 'success', link: '/vet-chat', description: 'Expert clinical decision support powered by decentralized poultry health datasets.', delay: 0.3 },
    { title: 'Vaccination Manager', icon: ShieldCheck, color: 'warning', link: '/vaccinations', description: 'Automated biosecurity compliance and medication scheduling for optimized immunity.', delay: 0.4 },
  ];

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <section className="row mb-5 animate-fade-in">
        <div className="col-12">
          <div className="hero-gradient rounded-4 p-5 position-relative overflow-hidden shadow-2xl border-bottom border-success border-4">
             <div className="row align-items-center position-relative z-1">
                <div className="col-lg-7">
                   <div className="badge bg-success text-white fw-bold px-3 py-2 rounded-pill mb-3 animate-pulse-warning border border-white border-opacity-20">
                      BIO-SECURE NODE ACTIVE
                   </div>
                   <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-2px' }}>
                      Command Center <span className="text-success underline">v4.0</span>
                   </h1>
                   <p className="lead text-white text-opacity-90 mb-4 max-w-md fw-medium">
                      Orchestrating autonomous health monitoring across 1.2M nodes. 
                      Neural models are currently synchronized with Bharat regional datasets.
                   </p>
                   <div className="d-flex gap-3 flex-wrap">
                      <button className="btn btn-premium px-4 border-2 shadow-lg"><Zap size={18} /> Run System Scan</button>
                      <button className="btn btn-outline-light rounded-pill px-4 border-2 fw-bold text-white shadow-sm">Access Node Logs</button>
                   </div>
                </div>
                <div className="col-lg-5 d-none d-lg-block text-center">
                   <div className="animate-float position-relative">
                      <div className="bg-secondary bg-opacity-30 p-5 rounded-circle d-inline-block border border-white border-opacity-10 shadow-2xl" style={{ backdropFilter: 'blur(8px)' }}>
                        <Database size={120} className="text-info opacity-30" strokeWidth={1} />
                        <div className="position-absolute top-50 start-50 translate-middle">
                           <Activity size={80} className="text-white opacity-80" />
                        </div>
                      </div>
                   </div>
                </div>
             </div>
             {/* Background accents */}
             <div className="position-absolute top-0 end-0 p-5 opacity-5">
                <Search size={300} strokeWidth={0.5} />
             </div>
          </div>
        </div>
      </section>
      
      {/* Stats Row */}
      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-md-6">
          <StatCard title="Total AI Screenings" value="24,812" sub="+12.5%" icon={Camera} color="primary" delay={0.1} />
        </div>
        <div className="col-lg-3 col-md-6">
          <StatCard title="Healthy Fleet %" value="98.4%" sub="+2.1%" icon={Zap} color="success" delay={0.2} />
        </div>
        <div className="col-lg-3 col-md-6">
          <StatCard title="Risk Coverage" value="₹8.2 Cr" sub="-4.3%" icon={TrendingDown} color="danger" delay={0.3} />
        </div>
        <div className="col-lg-3 col-md-6">
          <StatCard title="Compliance Index" value="100%" sub="0.0%" icon={ShieldCheck} color="warning" delay={0.4} />
        </div>
      </div>

      <div className="row mb-5">
         <div className="col-12 d-flex justify-content-between align-items-end mb-4">
            <div>
               <h2 className="fw-extrabold mb-1 text-white">Core AI Modules</h2>
               <p className="text-info small fw-bold tracking-widest uppercase">SELECT A SPECIALIZED SERVICE TO INITIALIZE DIAGNOSIS</p>
            </div>
            <button className="btn btn-link text-info fw-bold text-decoration-none d-flex align-items-center gap-1 px-0">
               View All Protocols <ArrowRight size={16} />
            </button>
         </div>
         <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-lg-3 col-md-6" key={i}>
                <FeatureCard {...f} />
              </div>
            ))}
         </div>
      </div>

      <div className="row g-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="col-lg-8">
          <div className="glass-card overflow-hidden h-100 border-slate-700">
            <div className="p-4 border-bottom border-slate-700 d-flex justify-content-between align-items-center bg-secondary bg-opacity-50">
                <h5 className="mb-0 fw-extrabold d-flex align-items-center gap-2 text-info uppercase small tracking-widest">
                   <AlertTriangle size={20} className="text-danger" /> Biosecurity Alert Logic
                </h5>
                <div className="d-flex gap-2">
                   <span className="badge bg-danger bg-opacity-20 text-danger rounded-pill px-3 py-1 border border-danger border-opacity-30">CRITICAL</span>
                </div>
            </div>
            <div className="p-4 bg-secondary bg-opacity-20">
               <div className="row g-4">
                  <div className="col-md-6">
                     <div className="p-4 rounded-4 bg-danger bg-opacity-10 border-start border-4 border-danger h-100 shadow-sm">
                        <div className="d-flex align-items-center gap-2 mb-2">
                           <MapIcon size={18} className="text-danger" />
                           <h6 className="fw-bold mb-0 text-white">Regional Threat Detected</h6>
                        </div>
                        <p className="small text-white text-opacity-80 mb-0 leading-relaxed">Higher cluster of Newcastle cases reported within 15km. Current biosecurity protocol: <strong>Strict Quarantine (Level 4)</strong>.</p>
                     </div>
                  </div>
                  <div className="col-md-6">
                     <div className="p-4 rounded-4 bg-info bg-opacity-10 border-start border-4 border-info h-100 shadow-sm">
                        <div className="d-flex align-items-center gap-2 mb-2">
                           <Calendar size={18} className="text-info" />
                           <h6 className="fw-bold mb-0 text-white">Upcoming Immunity Cycle</h6>
                        </div>
                        <p className="small text-white text-opacity-80 mb-0 leading-relaxed">Batch #B20-A is scheduled for Gumboro vaccination in 48 hours. Logic suggests no delays are permitted.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="dark-glass-card p-4 d-flex flex-column h-100 position-relative overflow-hidden border-slate-700 shadow-2xl">
             <div className="position-relative z-1 h-100 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-4">
                   <h5 className="fw-bold mb-0 text-white text-uppercase tracking-widest small">Flock Performance</h5>
                   <TrendingUp size={24} className="text-success" />
                </div>
                <div className="mb-4">
                   <h1 className="fw-extrabold display-4 mb-0 text-white">12,450</h1>
                   <small className="text-info uppercase fw-bold tracking-widest x-small">Active Fleet Capacity</small>
                </div>
                <div className="progress rounded-pill bg-dark bg-opacity-50 mb-5 shadow-inner" style={{ height: '10px' }}>
                   <div className="progress-bar bg-success rounded-pill animate-pulse" style={{ width: '85%' }}></div>
                </div>
                <p className="small text-white text-opacity-80 mb-4 leading-relaxed">
                   System optimization has increased feed conversion efficiency by <strong className="text-success">4.2%</strong> this quarter in Bharat hubs.
                </p>
                <button className="btn btn-premium w-100 mt-auto py-3 fw-bold shadow-lg">
                   GENERATE FULL CLINICAL REPORT
                </button>
             </div>
             {/* Background decorative */}
             <div className="position-absolute bottom-0 end-0 p-3 opacity-10">
                <Users size={120} strokeWidth={1} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
