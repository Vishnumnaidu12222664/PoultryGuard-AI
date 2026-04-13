import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, Info, ExternalLink, ShieldCheck, Sparkles, Trash2, Globe, Database, Zap } from 'lucide-react';
import { chatService } from '../services/api';

const VetAssistant = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Welcome to the AI Vet Command. I am synchronized with global FAO/WHO poultry medical datasets. Analyze symptoms, query biosecurity protocols, or request treatment logic for your flock.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { 
      role: 'user', 
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatService.sendMessage(sessionId, input);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: res.data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'CRITICAL ERROR: AI Node synchronization failed. Please verify neural network connectivity and backend status.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Chat Main Area */}
        <div className="col-lg-8 h-100">
          <div className="glass-card d-flex flex-column h-100 border-0 shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 bg-primary text-white d-flex justify-content-between align-items-center shadow-lg" style={{ backgroundColor: '#0F172A' }}>
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 bg-success bg-opacity-20 rounded-circle border border-success border-opacity-20">
                   <Bot size={28} className="text-success" />
                </div>
                <div>
                  <h5 className="mb-0 fw-extrabold tracking-tight">Expert AI Vet Assistant</h5>
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle bg-success animate-pulse" style={{ width: '8px', height: '8px' }}></span>
                    <small className="text-muted fw-bold x-small tracking-widest">NODE ACTIVE // RAG_SYNC v4.1</small>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                 <button className="btn btn-dark bg-secondary bg-opacity-50 border-slate-700 text-white rounded-pill px-3 py-1 small hover-lift d-flex align-items-center gap-2" onClick={() => setMessages([messages[0]])}>
                    <Trash2 size={14} /> <span className="d-none d-md-inline">Purge Context</span>
                 </button>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="card-body overflow-auto p-4 flex-grow-1" style={{ backgroundColor: '#0B1120', backgroundImage: 'radial-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
              {messages.map((m, i) => (
                <div key={i} className={`d-flex mb-4 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start animate-fade-in'}`}>
                  <div className={`d-flex max-vw-75 ${m.role === 'user' ? 'flex-row-reverse' : ''} gap-3 align-items-start`}>
                    <div className={`rounded-circle p-2 flex-shrink-0 d-flex align-items-center justify-content-center shadow-lg ${m.role === 'user' ? 'bg-success text-dark' : 'bg-secondary border-slate-700 text-info'}`} style={{ width: '45px', height: '45px' }}>
                      {m.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                    </div>
                    <div className={m.role === 'user' ? 'text-end' : ''}>
                      <div 
                        className={`p-4 rounded-4 shadow-xl ${m.role === 'user' ? 'bg-success text-dark fw-bold' : 'bg-secondary border-slate-700 text-white'}`} 
                        style={{ 
                          maxWidth: '100%', 
                          borderRadius: m.role === 'user' ? '24px 4px 24px 24px' : '4px 24px 24px 24px',
                          border: m.role === 'assistant' ? '1px solid #334155' : 'none'
                        }}
                      >
                        <p className="mb-0 small fw-medium lh-lg" style={{ whiteSpace: 'pre-wrap' }}>{m.content}</p>
                      </div>
                      <div className="mt-2 d-flex align-items-center justify-content-between gap-3 px-1">
                         <small className="text-muted x-small fw-bold opacity-50 uppercase">{m.role === 'user' ? 'FARMER_AUTH' : 'AI_VET_CORE'}</small>
                         <small className="text-muted x-small opacity-50 fw-bold">{m.timestamp}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="d-flex mb-4 animate-fade-in">
                  <div className="d-flex gap-3 align-items-start">
                    <div className="rounded-circle p-2 bg-secondary border-slate-700 text-info d-flex align-items-center justify-content-center shadow-lg" style={{ width: '45px', height: '45px' }}>
                      <Bot size={24} />
                    </div>
                    <div className="p-4 bg-secondary border-slate-700 rounded-4 d-flex align-items-center gap-3 shadow-xl border-start border-4 border-success">
                      <Loader2 className="animate-spin text-success" size={20} />
                      <span className="small text-muted fw-extrabold tracking-widest">SENSING MEDICAL NEURONS...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-top border-slate-800" style={{ backgroundColor: '#0F172A' }}>
              <form onSubmit={handleSend} className="position-relative">
                <div className="input-group overflow-hidden rounded-pill bg-secondary border-slate-700 border-2 shadow-lg p-1">
                  <input 
                    className="form-control border-0 bg-transparent px-4 py-3 text-white shadow-none" 
                    placeholder="Describe symptoms, query dosage, or ask about bio-protocols..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    style={{ fontSize: '0.95rem' }}
                  />
                  <button 
                    className="btn btn-premium rounded-pill p-3 d-flex align-items-center justify-content-center me-1 my-auto shadow-lg" 
                    style={{ width: '56px', height: '52px' }} 
                    type="submit" 
                    disabled={loading || !input.trim()}
                  >
                    <Send size={24} />
                  </button>
                </div>
                <div className="mt-2 px-3 d-flex justify-content-between text-muted x-small fw-bold opacity-50 tracking-widest">
                   <span>AES-256 ENCRYPTED</span>
                   <span>LATENCY: ~1.2s</span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-lg-4 d-flex flex-column gap-4">
          <div className="glass-card p-4 animate-fade-in border-0 shadow-xl" style={{ animationDelay: '0.2s' }}>
            <div className="d-flex align-items-center gap-2 mb-4">
               <div className="bg-success bg-opacity-10 p-2 rounded-3">
                  <ShieldCheck className="text-success" size={24} />
               </div>
               <h6 className="fw-extrabold mb-0">Pathology Core</h6>
            </div>
            <p className="text-muted small mb-4 fw-medium">Neural search active across validated clinical guidelines.</p>
            
            <div className="list-group list-group-flush border-top border-slate-700">
              {[
                'FAO Biosecurity Protocols',
                'OIE Poultry Pathology',
                'Regional Disease Stats'
              ].map((item, idx) => (
                <div key={idx} className="list-group-item bg-transparent px-0 py-3 d-flex align-items-center gap-3 border-slate-800">
                   <div className="bg-success bg-opacity-5 p-2 rounded-circle border border-success border-opacity-10"><Sparkles size={14} className="text-success" /></div>
                   <span className="small fw-bold text-secondary-text" style={{ color: '#CBD5E1' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dark-glass-card p-4 animate-fade-in flex-grow-1 d-flex flex-column overflow-hidden" style={{ animationDelay: '0.4s', backgroundColor: '#111827' }}>
            <h6 className="fw-extrabold mb-4 d-flex align-items-center gap-2 text-white tracking-widest">
               <Globe size={18} className="text-info" /> SYNC_NODES
            </h6>
            <div className="d-flex flex-wrap gap-2 mb-5">
               {['VISION_V4', 'RAG_ENGINE', 'GEO_SURVEY', 'SYMPTOM_DB'].map(tag => (
                 <span key={tag} className="badge bg-secondary border border-slate-700 text-info px-3 py-2 small fw-bold tracking-tight">{tag}</span>
               ))}
            </div>
            <div className="mt-auto bg-primary bg-opacity-30 p-4 rounded-4 border border-slate-700">
               <div className="d-flex align-items-center gap-3 mb-2">
                  <Database size={20} className="text-success" />
                  <h6 className="mb-0 small fw-extrabold text-white">BIO_SECURE ENABLED</h6>
               </div>
               <p className="x-small text-white text-opacity-50 mb-0 fw-medium">Encryption active for all clinical transmissions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetAssistant;
