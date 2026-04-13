import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  IndianRupee, 
  TrendingDown, 
  Users, 
  Calendar, 
  FileDown, 
  ShieldAlert, 
  BarChart3, 
  ArrowUpRight,
  Zap,
  ChevronRight,
  Info,
  RefreshCw
} from 'lucide-react';
import { predictionService } from '../services/api';

const EconomicPredictor = () => {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await predictionService.predictEconomicLoss({
        farm_id: 1,
        disease: data.disease,
        flock_size: parseInt(data.flock_size),
        days_since_detection: parseInt(data.days),
        treatment_status: data.treatment === 'true',
        revenue_per_bird: parseFloat(data.revenue),
        currency: data.currency
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="animate-fade-in text-center mb-5 mt-2">
        <div className="d-inline-block bg-success bg-opacity-10 p-2 rounded-pill mb-3 border border-success border-opacity-20">
           <span className="badge bg-success rounded-pill px-3 py-1 text-white">FISCAL_RISK_LOGIC v2.1</span>
        </div>
        <h1 className="display-4 fw-extrabold text-white mb-2" style={{ letterSpacing: '-2px' }}>Economic Impact Forecast</h1>
        <p className="text-info fw-bold small text-uppercase tracking-widest">Predictive financial mortality modeling for Indian Poultry Sectors</p>
      </div>
      
      <div className="row g-5 justify-content-center">
        {/* Config Panel */}
        <div className="col-lg-5">
          <div className="glass-card overflow-hidden h-100 shadow-xl border-slate-700">
            <div className="p-4 bg-primary text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#0F172A', borderBottom: '1px solid #334155' }}>
              <h5 className="mb-0 fw-extrabold d-flex align-items-center gap-2">
                 <BarChart3 className="text-success" /> CONFIGURATION_NODE
              </h5>
              <Zap size={18} className="text-success animate-pulse" />
            </div>
            <div className="card-body p-4 bg-secondary bg-opacity-40">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="form-label small fw-extrabold text-white mb-2 tracking-widest">TARGET PATHOGEN PROFILE</label>
                  <select className="form-select bg-primary border-slate-700 py-3 fw-bold text-white shadow-none" {...register('disease')}>
                    <option value="Newcastle Disease">Newcastle Disease (Viral v-H5N1)</option>
                    <option value="Coccidiosis">Coccidiosis (Bacterial Log-7)</option>
                    <option value="Fowl Pox">Fowl Pox (Viral P-342)</option>
                    <option value="Salmonella">Salmonella (Infection S-10)</option>
                  </select>
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label small fw-extrabold text-white mb-2 tracking-widest">FLOCK CAPACITY</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary border-slate-700"><Users size={18} className="text-success" /></span>
                      <input type="number" className="form-control bg-primary border-slate-700 py-3 fw-bold text-white shadow-none" defaultValue="10000" {...register('flock_size')} />
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-extrabold text-white mb-2 tracking-widest">DETECTION_LAG (DAYS)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary border-slate-700"><Calendar size={18} className="text-success" /></span>
                      <input type="number" className="form-control bg-primary border-slate-700 py-3 fw-bold text-white shadow-none" defaultValue="4" {...register('days')} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary bg-opacity-50 rounded-4 border-2 border-dashed border-slate-700 mb-4">
                  <label className="form-label small fw-extrabold text-info mb-3 tracking-widest">CLINICAL INTERVENTION STATUS</label>
                  <div className="d-flex gap-5">
                    <div className="form-check custom-radio">
                      <input className="form-check-input bg-dark border-slate-600" type="radio" value="true" {...register('treatment')} id="t1" />
                      <label className="form-check-label fw-extrabold small text-success" htmlFor="t1">DEPLOYED</label>
                    </div>
                    <div className="form-check custom-radio">
                      <input className="form-check-input bg-dark border-slate-600" type="radio" value="false" {...register('treatment')} id="t2" defaultChecked />
                      <label className="form-check-label fw-extrabold small text-danger" htmlFor="t2">INACTIVE</label>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-5">
                  <div className="col-8">
                    <label className="form-label small fw-extrabold text-white mb-2 tracking-widest">EST. UNIT VALUE (₹ PER BIRD)</label>
                    <div className="input-group">
                       <span className="input-group-text bg-primary border-slate-700"><IndianRupee size={18} className="text-success" /></span>
                       <input type="number" step="1" className="form-control bg-primary border-slate-700 py-3 fw-bold text-white shadow-none" defaultValue="450" {...register('revenue')} />
                    </div>
                  </div>
                  <div className="col-4">
                    <label className="form-label small fw-extrabold text-white mb-2 tracking-widest">CURRENCY</label>
                    <select className="form-select bg-primary border-slate-700 py-3 fw-bold text-white shadow-none" {...register('currency')}>
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-premium w-100 py-4 shadow-lg text-uppercase tracking-widest fs-6" disabled={loading}>
                  {loading ? (
                    <div className="d-flex align-items-center gap-2 text-white">
                       <RefreshCw className="animate-spin" size={20} /> CALCULATING FINANCES...
                    </div>
                  ) : (
                    <span className="text-white">EXECUTE RISK PROJECTION <ArrowUpRight size={22} className="ms-2" /></span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-lg-7">
          {result ? (
            <div className="animate-fade-in h-100 d-flex flex-column">
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="glass-card shadow-lg bg-danger border-0 rounded-4 p-5 text-center position-relative overflow-hidden group border-danger border-opacity-50">
                    <div className="position-relative z-1 text-white">
                       <TrendingDown size={40} className="mx-auto mb-3 text-white opacity-80" />
                       <h1 className="display-4 fw-extrabold mb-0 text-white" style={{ letterSpacing: '-2px' }}>{result.projected_deaths.toLocaleString()}</h1>
                       <small className="tracking-widest fw-bold text-white opacity-90">PROJECTED MORTALITY COUNT</small>
                    </div>
                    <div className="position-absolute top-0 end-0 p-3 opacity-10 transform scale-150 rotate-12 text-white">
                       <Users size={100} />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="glass-card shadow-lg border-slate-700 rounded-4 p-5 text-center position-relative overflow-hidden" style={{ backgroundColor: '#111827' }}>
                    <div className="position-relative z-1">
                       <IndianRupee size={40} className="mx-auto mb-3 text-success opacity-80" />
                       <h1 className="display-4 fw-extrabold mb-0 text-success" style={{ letterSpacing: '-2px' }}>
                         ₹{result.revenue_loss.toLocaleString()}
                       </h1>
                       <small className="text-white opacity-70 tracking-widest fw-bold uppercase">FORECASTED REVENUE LOSS</small>
                    </div>
                    <div className="position-absolute bottom-0 start-0 p-3 opacity-10 text-white">
                       <BarChart3 size={100} strokeWidth={1} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card shadow-xl rounded-4 overflow-hidden border-slate-700 flex-grow-1">
                <div className="p-4 border-bottom border-slate-700 d-flex justify-content-between align-items-center bg-primary" style={{ backgroundColor: '#0F172A' }}>
                   <h5 className="fw-extrabold mb-0 text-white tracking-tight">SCENARIO_SEVERITY_METER</h5>
                   <span className="badge bg-danger rounded-pill px-4 py-2 animate-pulse-warning text-white fw-bold">CRITICAL IMPACT LEVEL</span>
                </div>
                <div className="p-5 bg-secondary bg-opacity-30 flex-grow-1">
                  <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-end mb-3">
                      <span className="small text-info fw-extrabold tracking-widest uppercase">LOSS SATURATION SCALE</span>
                      <span className="fw-extrabold text-white display-5" style={{ fontSize: '2rem' }}>{result.percent_loss.toFixed(1)}%</span>
                    </div>
                    <div className="progress rounded-pill bg-primary shadow-inner" style={{ height: '24px', backgroundColor: '#0B1120' }}>
                      <div 
                        className={`progress-bar bg-danger progress-bar-striped progress-bar-animated shadow-sm`} 
                        style={{ width: `${result.percent_loss}%` }}
                      ></div>
                    </div>
                  </div>

                    <div className="p-4 bg-danger bg-opacity-20 border border-danger border-opacity-40 rounded-4 d-flex align-items-center gap-4 mb-5 shadow-inner">
                      <div className="bg-danger p-3 rounded-circle text-white shadow-lg border border-white border-opacity-30">
                         <ShieldAlert size={32} />
                      </div>
                      <div>
                         <h6 className="fw-extrabold text-white mb-1 tracking-tight" style={{ color: '#FFFFFF !important' }}>COST OF INACTION WARNING:</h6>
                         <p className="small text-white mb-0 fw-bold leading-relaxed" style={{ color: '#FFFFFF !important', opacity: 1 }}>Neural prediction suggests mortality risks in Indian environments escalate volatility by <strong>15%</strong> every 48 hours without treatment.</p>
                      </div>
                    </div>

                  <button className="btn btn-outline-premium w-100 py-3 d-flex align-items-center justify-content-center gap-3 rounded-pill fw-bold border-2">
                    <FileDown size={20} /> <span className="text-white">DOWNLOAD CLINICAL FISCAL REPORT (PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center text-center p-5 animate-fade-in border-0 border-dashed border-2 border-slate-700 border-opacity-50" style={{ animationDelay: '0.4s' }}>
              <div className="opacity-20">
                <IndianRupee size={150} className="mb-4 text-white" strokeWidth={1} />
                <h2 className="fw-extrabold text-white mb-2">Awaiting Analysis Parameters</h2>
                <p className="px-5 fw-bold tracking-widest text-info uppercase small">TRANSMIT FISCAL DATA TO INITIALIZE PROJECTION ENGINE</p>
              </div>
              <div className="mt-5 w-100 d-flex flex-column gap-2 opacity-80">
                 <div className="p-3 bg-primary bg-opacity-30 border border-slate-700 rounded-3 text-start d-flex align-items-center gap-3">
                    <Info size={16} className="text-info" /> <small className="fw-bold tracking-widest x-small text-white">REGRESSION_MODEL: PATHOGEN-X (INDIA_VARIANT)</small>
                 </div>
                 <div className="p-3 bg-primary bg-opacity-30 border border-slate-700 rounded-3 text-start d-flex align-items-center gap-3">
                    <Zap size={16} className="text-success" /> <small className="fw-bold tracking-widest x-small text-white">ACCURACY_TOLERANCE: 0.1%</small>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EconomicPredictor;
