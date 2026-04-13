import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Activity, 
  Play, 
  Info, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  ChevronRight, 
  ShieldAlert,
  Search,
  Database
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { predictionService } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const OutbreakPredictor = () => {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const position = [12.9716, 77.5946];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await predictionService.predictOutbreak({
        farm_id: 1,
        flock_size: parseInt(data.flock_size),
        infected_count: parseInt(data.infected_count)
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? {
    labels: result.daily_data.map(d => `Day ${d.day}`),
    datasets: [
      {
        label: 'Infected Population',
        data: result.daily_data.map(d => d.infected),
        borderColor: '#d64545',
        backgroundColor: 'rgba(214, 69, 69, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Healthy (Susceptible)',
        data: result.daily_data.map(d => d.susceptible),
        borderColor: '#102a43',
        backgroundColor: 'rgba(16, 42, 67, 0.05)',
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { family: 'Inter', weight: '600' }, color: '#334e68' } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#627d98' } },
      x: { grid: { display: false }, ticks: { color: '#627d98' } }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="animate-fade-in text-center mb-5 mt-2">
        <div className="d-inline-block bg-danger bg-opacity-10 p-2 rounded-pill mb-3">
           <span className="badge bg-danger rounded-pill px-3 py-1">SIR_EPIDEMIC_ENGINE v3.2</span>
        </div>
        <h1 className="display-4 fw-extrabold text-primary mb-2" style={{ letterSpacing: '-2px' }}>Spread Dynamics Predictor</h1>
        <p className="text-muted fw-bold small text-uppercase tracking-widest">Simulating transmission vectors & herd immunity via compartmental SIR models</p>
      </div>
      
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="glass-card overflow-hidden h-100 shadow-xl border-0">
            <div className="p-4 bg-dark text-white d-flex justify-content-between align-items-center">
               <h5 className="mb-0 fw-extrabold d-flex align-items-center gap-2">
                 <Play className="text-accent" /> SIMULATION_CORE
               </h5>
               <Zap size={18} className="text-accent" />
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label small fw-extrabold text-muted mb-2 tracking-widest">FLOCK CAPACITY (N)</label>
                  <input type="number" className="form-control bg-light border-2 py-3 fw-bold" {...register('flock_size')} defaultValue="5000" />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-extrabold text-muted mb-2 tracking-widest">PATIENT_0 DETECTION (I)</label>
                  <input type="number" className="form-control bg-light border-2 py-3 fw-bold" {...register('infected_count')} defaultValue="5" />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-extrabold text-muted mb-2 tracking-widest">TRANSMISSION RISK (BETA)</label>
                  <select className="form-select bg-light border-2 py-3 fw-bold" {...register('ventilation')}>
                    <option value="low">Controlled Environment (Low)</option>
                    <option value="medium">Standard Ventilation (Mid)</option>
                    <option value="high">Open Range / High Density (High)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-premium w-100 py-3 shadow-lg fs-6" disabled={loading}>
                  {loading ? (
                    <div className="d-flex align-items-center gap-2">
                       <Database className="animate-spin" size={18} /> PROCESSING PHYSICS...
                    </div>
                  ) : (
                    <>EXECUTE SIMULATION <ChevronRight size={18} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {result && (
            <div className="glass-card shadow-lg mt-4 border-0 border-start border-4 border-danger animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <ShieldAlert className="text-danger" size={24} />
                  <h6 className="fw-extrabold mb-0 text-dark">TRANSMISSION INSIGHTS</h6>
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-4 text-center hover-lift">
                      <small className="text-muted d-block fw-bold tracking-widest x-small mb-1">PEAK_EXPOSURE</small>
                      <h3 className="fw-extrabold mb-0 text-dark">Day {result.peak_day}</h3>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-4 text-center hover-lift">
                      <small className="text-muted d-block fw-bold tracking-widest x-small mb-1">TOTAL_REACH</small>
                      <h3 className="fw-extrabold mb-0 text-danger">{result.total_affected}</h3>
                    </div>
                  </div>
                  <div className="col-12 mt-4">
                    <div className="p-4 bg-danger bg-opacity-10 text-danger rounded-4 text-center border border-danger border-opacity-10">
                      <small className="d-block mb-1 fw-extrabold tracking-widest">BASIC REPRODUCTION RATE (R0)</small>
                      <h1 className="fw-extrabold mb-0 display-4" style={{ letterSpacing: '-2px' }}>{result.r0_value.toFixed(2)}</h1>
                      <div className="mt-2 small fw-bold">
                         {result.r0_value > 1 ? 'EPIDEMIC_EXPANSION_LIKELY' : 'DECAY_PHASE_ACTIVE'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-8">
          <div className="glass-card overflow-hidden mb-4 animate-fade-in shadow-xl border-0" style={{ animationDelay: '0.3s' }}>
             <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
               <h5 className="mb-0 fw-extrabold text-primary d-flex align-items-center gap-2">
                  <TrendingUp /> EPIDEMIOLOGICAL CURVE
               </h5>
               <Search size={18} className="text-muted opacity-50" />
             </div>
             <div className="p-4 bg-white bg-opacity-50" style={{ height: '400px' }}>
                {chartData ? (
                  <Line options={chartOptions} data={chartData} />
                ) : (
                  <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted bg-light rounded-4 border-2 border-dashed">
                    <Activity size={80} className="mb-3 opacity-10 animate-pulse" strokeWidth={1} />
                    <p className="fw-extrabold tracking-widest small">TRANSMIT PARAMS TO GENERATE DATA_STREAM</p>
                  </div>
                )}
             </div>
          </div>

          <div className="glass-card overflow-hidden animate-fade-in shadow-lg border-0" style={{ animationDelay: '0.5s' }}>
            <div className="p-4 border-bottom bg-white">
               <h5 className="mb-0 fw-extrabold text-primary d-flex align-items-center gap-2">
                  <Info /> LOCALIZED SPATIAL RISK
               </h5>
            </div>
            <div className="p-0 position-relative" style={{ height: '320px' }}>
               <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} className="grayscale-map">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <CircleMarker center={position} radius={30} pathOptions={{ color: '#d64545', fillColor: '#d64545', fillOpacity: 0.2 }}>
                    <Popup>ACTIVE_NODE_PERIMETER_RISK</Popup>
                  </CircleMarker>
               </MapContainer>
               <div className="position-absolute bottom-0 start-0 m-3 p-2 bg-dark bg-opacity-75 text-white rounded-3 x-small fw-bold z-3 tracking-widest">
                  LATENCY_SYNCED // GPS_READY
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutbreakPredictor;
