import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  AlertTriangle, 
  Map as MapIcon, 
  Shield, 
  Activity, 
  Info,
  Maximize2,
  TrendingDown,
  Layers,
  RefreshCw
} from 'lucide-react';
import L from 'leaflet';
import { mapService } from '../services/api';

// Fallback SVG-based Marker Icon to ensure zero-dependency rendering
const markerSvg = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EF4444" width="32" height="32">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
</svg>
`)}`;

let DefaultIcon = L.icon({
    iconUrl: markerSvg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DiseaseMap = () => {
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutbreaks();
  }, []);

  const fetchOutbreaks = async () => {
    setLoading(true);
    try {
      const res = await mapService.getOutbreaks();
      console.log("Map Outbreaks Data:", res.data);
      setOutbreaks(res.data);
    } catch (err) {
      console.error("Failed to fetch outbreaks:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'severe': return '#EF4444'; // Critical
      case 'medium': return '#F59E0B'; // Warning
      case 'low': return '#22C55E'; // Healthy/Low
      default: return '#38BDF8';
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Search & Stats Header */}
      <div className="row mb-5 animate-fade-in">
        <div className="col-lg-8">
           <div className="d-flex align-items-center gap-2 bg-info bg-opacity-10 text-info px-3 py-1 rounded-pill mb-2 small fw-bold border border-info border-opacity-20 d-inline-flex">
              <Layers size={14} /> NATIONAL_HEALTH_MONITOR v4.0
           </div>
           <h1 className="display-4 fw-extrabold text-white mb-2" style={{ letterSpacing: '-2px' }}>Regional Disease Surveillance</h1>
           <p className="text-white text-opacity-70 fw-bold small tracking-widest text-uppercase">Cross-referencing real-time diagnostic telemetry with geographic farm nodes</p>
        </div>
        <div className="col-lg-4 d-flex align-items-end justify-content-lg-end">
           <div className="glass-card px-4 py-3 d-flex align-items-center gap-3 border-slate-700 bg-secondary bg-opacity-30">
              <Activity className="text-success animate-pulse" />
              <div>
                 <h5 className="mb-0 fw-extrabold text-white">{outbreaks.length}</h5>
                 <small className="text-info x-small fw-bold tracking-widest">ACTIVE HOTSPOTS</small>
              </div>
           </div>
        </div>
      </div>

      <div className="glass-card shadow-2xl border-slate-700 overflow-hidden position-relative animate-fade-in" style={{ height: '700px', animationDelay: '0.2s', backgroundColor: '#0F172A' }}>
        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={5} 
          style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {outbreaks.map((outbreak, idx) => (
            <React.Fragment key={idx}>
              <Marker position={[outbreak.lat, outbreak.lng]}>
                <Popup className="premium-popup">
                  <div className="p-1">
                    <h6 className="fw-extrabold text-white mb-2">{outbreak.disease}</h6>
                    <div className="d-flex flex-column gap-2">
                       <span className={`badge bg-${outbreak.severity === 'severe' ? 'danger' : 'warning'} rounded-pill x-small`}>
                         {outbreak.severity?.toUpperCase()} SEVERITY
                       </span>
                       <small className="text-info fw-bold">LAT: {outbreak.lat.toFixed(4)}</small>
                       <small className="text-info fw-bold">LNG: {outbreak.lng.toFixed(4)}</small>
                    </div>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[outbreak.lat, outbreak.lng]}
                radius={25000} // 25km radius
                pathOptions={{
                  fillColor: getMarkerColor(outbreak.severity),
                  color: getMarkerColor(outbreak.severity),
                  weight: 1,
                  opacity: 0.6,
                  fillOpacity: 0.2
                }}
              />
            </React.Fragment>
          ))}
        </MapContainer>
        
        {/* Map Overlays */}
        <div className="position-absolute bottom-0 start-0 m-4 z-3000 pointer-events-none" style={{ zIndex: 1000 }}>
           <div className="glass-card p-4 border-slate-700 bg-primary bg-opacity-90 shadow-2xl pointer-events-auto" style={{ minWidth: '220px' }}>
              <h6 className="fw-extrabold text-white mb-3 d-flex align-items-center gap-2 small">
                 <Shield size={16} className="text-success" /> SURVEILLANCE LEGEND
              </h6>
              <div className="d-flex flex-column gap-3">
                 <div className="d-flex align-items-center gap-2">
                    <div className="bg-danger rounded-circle shadow-lg" style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.2)' }}></div>
                    <span className="x-small fw-extrabold text-white">SEVERE OUTBREAK</span>
                 </div>
                 <div className="d-flex align-items-center gap-2">
                    <div className="bg-warning rounded-circle shadow-lg" style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.2)' }}></div>
                    <span className="x-small fw-extrabold text-white">MEDIUM ALERT</span>
                 </div>
                 <div className="d-flex align-items-center gap-2">
                    <div className="bg-success rounded-circle shadow-lg" style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.2)' }}></div>
                    <span className="x-small fw-extrabold text-white">CONTROLLED CLUSTER</span>
                 </div>
              </div>
              <hr className="border-slate-700 my-3" />
              <button className="btn btn-outline-info w-100 py-2 x-small fw-bold d-flex align-items-center justify-content-center gap-2" onClick={fetchOutbreaks}>
                 <RefreshCw size={12} /> REFRESH SYNC
              </button>
           </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
         <div className="col-lg-4">
            <div className="glass-card p-4 d-flex align-items-center gap-4 bg-secondary bg-opacity-30 border-slate-700 shadow-xl">
               <div className="bg-danger bg-opacity-10 p-3 rounded-circle border border-danger border-opacity-20 shadow-inner">
                  <AlertTriangle size={24} className="text-danger" />
               </div>
               <div>
                  <h6 className="fw-extrabold mb-1 text-white">Biosecurity Levels</h6>
                  <p className="small text-white text-opacity-60 mb-0 leading-relaxed">Level 4 Strict lockdown active for southern clusters.</p>
               </div>
            </div>
         </div>
         <div className="col-lg-4">
            <div className="glass-card p-4 d-flex align-items-center gap-4 bg-secondary bg-opacity-30 border-slate-700 shadow-xl">
               <div className="bg-info bg-opacity-10 p-3 rounded-circle border border-info border-opacity-20 shadow-inner">
                  <Maximize2 size={24} className="text-info" />
               </div>
               <div>
                  <h6 className="fw-extrabold mb-1 text-white">Spatial Accuracy</h6>
                  <p className="small text-white text-opacity-60 mb-0 leading-relaxed">Cross-referenced with regional GIS nodes within 500m.</p>
               </div>
            </div>
         </div>
         <div className="col-lg-4">
            <div className="glass-card p-4 d-flex align-items-center gap-4 bg-secondary bg-opacity-30 border-slate-700 shadow-xl">
               <div className="bg-success bg-opacity-10 p-3 rounded-circle border border-success border-opacity-20 shadow-inner">
                  <TrendingDown size={24} className="text-success" />
               </div>
               <div>
                  <h6 className="fw-extrabold mb-1 text-white">Transmission Rate</h6>
                  <p className="small text-white text-opacity-60 mb-0 leading-relaxed">Descending (R0: 0.82) due to coordinated response.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DiseaseMap;
