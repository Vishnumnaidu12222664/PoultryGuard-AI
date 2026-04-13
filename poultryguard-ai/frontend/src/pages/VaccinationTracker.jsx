import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Check, Trash2, FileText, Bell, ShieldCheck, Filter, Download, Zap } from 'lucide-react';
import { vaccinationService } from '../services/api';

const VaccinationTracker = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const fetchVaccinations = async () => {
    try {
      const res = await vaccinationService.getAll();
      setVaccinations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      await vaccinationService.update(id, {
        administered_date: new Date().toISOString().split('T')[0],
        status: 'completed'
      });
      fetchVaccinations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this record?')) {
      try {
        await vaccinationService.delete(id);
        fetchVaccinations();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-end mb-5 animate-fade-in">
        <div>
           <div className="d-inline-flex align-items-center gap-2 bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill mb-2 small fw-bold border border-success border-opacity-20">
              <ShieldCheck size={14} /> BIO-DATA COMPLIANCE ACTIVE
           </div>
           <h1 className="display-4 fw-extrabold text-white mb-0" style={{ letterSpacing: '-2px' }}>Vaccination Protocols</h1>
           <p className="text-info fw-bold small tracking-widest text-uppercase">Automated medication tracking & regulatory audit logging</p>
        </div>
        <button className="btn btn-premium px-4 shadow-lg d-flex align-items-center gap-2 py-3">
          <Plus size={20} /> INITIALIZE NEW SCHEDULE
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="row g-4 mb-5">
        {[
          { label: 'Upcoming', val: '4', icon: Calendar, color: 'warning' },
          { label: 'Overdue', val: '1', icon: Bell, color: 'danger' },
          { label: 'Completed', val: '12', icon: Check, color: 'success' },
          { label: 'Audit Logs', val: '8', icon: FileText, color: 'info' }
        ].map((stat, i) => (
          <div className="col-md-3" key={i}>
            <div className={`glass-card p-4 hover-lift border-0 border-top border-4 border-${stat.color} animate-fade-in shadow-xl`} style={{ animationDelay: `${i * 0.1}s`, backgroundColor: '#1E293B' }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <p className="text-white text-opacity-70 small fw-extrabold tracking-widest uppercase mb-0">{stat.label}</p>
                <stat.icon size={24} className={`text-${stat.color} opacity-80`} />
              </div>
              <h1 className="display-5 fw-extrabold mb-0 text-white">{stat.val}</h1>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="glass-card overflow-hidden shadow-2xl border-slate-700 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="card-header bg-primary py-4 px-4 d-flex justify-content-between align-items-center border-bottom border-slate-700" style={{ backgroundColor: '#0F172A' }}>
          <h5 className="mb-0 fw-extrabold text-white d-flex align-items-center gap-2">
             <Filter size={18} className="text-success" /> ACTIVE COMPLIANCE MATRIX
          </h5>
          <div className="d-flex gap-2">
             <button className="btn btn-dark btn-sm rounded-pill px-3 border border-slate-700 fw-bold text-info">Filter Status</button>
             <button className="btn btn-dark btn-sm rounded-pill px-3 border border-slate-700 fw-bold text-info">Batch ID</button>
          </div>
        </div>
        <div className="table-responsive bg-secondary bg-opacity-20">
          <table className="table premium-table align-middle mb-0 text-white">
            <thead style={{ backgroundColor: '#111827' }}>
              <tr className="border-0">
                <th className="px-4 py-3 tracking-widest small fw-extrabold text-info">VACCINE_ID</th>
                <th className="px-4 py-3 tracking-widest small fw-extrabold text-info">TIMESTAMP_DUE</th>
                <th className="px-4 py-3 tracking-widest small fw-extrabold text-info">SECURE_STATUS</th>
                <th className="px-4 py-3 tracking-widest small fw-extrabold text-info">METADATA_NOTES</th>
                <th className="px-4 py-3 tracking-widest small fw-extrabold text-end text-info">SYSTEM_COMMANDS</th>
              </tr>
            </thead>
            <tbody>
              {vaccinations.length > 0 ? vaccinations.map((v) => (
                <tr key={v.id} className="border-slate-800">
                  <td className="px-4 py-4">
                    <div className="d-flex align-items-center gap-2">
                       <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success border border-success border-opacity-20">
                          <Zap size={16} />
                       </div>
                       <span className="fw-extrabold text-white">{v.vaccine_name}</span>
                    </div>
                  </td>
                  <td className="px-4"><code className="text-info fw-bold bg-dark bg-opacity-50 px-2 py-1 rounded">{v.due_date}</code></td>
                  <td className="px-4">
                    <span className={`stat-pill bg-opacity-90 bg-${v.status === 'completed' ? 'success' : v.status === 'overdue' ? 'danger' : 'warning'} text-white fw-bold shadow-sm`}>
                      {v.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 small text-white text-opacity-70 fw-medium">{v.notes || '--- NO_META_LOGGED ---'}</td>
                  <td className="px-4 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      {v.status !== 'completed' && (
                        <button className="btn btn-sm btn-outline-success rounded-circle p-2 shadow-inner border-2" onClick={() => handleMarkComplete(v.id)}>
                          <Check size={16} strokeWidth={3} />
                        </button>
                      )}
                      <button className="btn btn-sm btn-outline-danger rounded-circle p-2 shadow-inner border-2" onClick={() => handleDelete(v.id)}>
                        <Trash2 size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="opacity-25 py-5 text-white">
                       <ShieldCheck size={64} className="mb-3" />
                       <h5 className="fw-extrabold">NO_DATA_LOGGED</h5>
                       <p className="small">The compliance matrix is currently empty for this sector.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-secondary bg-opacity-40 py-4 px-4 text-end border-top border-slate-700">
          <button className="btn btn-premium px-4 d-flex align-items-center gap-2 ms-auto py-3">
            <Download size={18} /> GENERATE REGULATORY PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaccinationTracker;
