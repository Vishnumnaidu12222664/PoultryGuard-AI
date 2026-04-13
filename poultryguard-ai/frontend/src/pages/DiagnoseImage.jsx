import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { 
  Camera, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  ChevronRight, 
  ArrowRight,
  Activity,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
  Info,
  Maximize2,
  X
} from 'lucide-react';
import { diagnoseService } from '../services/api';

const DiagnoseImage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setShowWebcam(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const submitDiagnosis = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(image);
      const blob = await res.blob();
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      const diagnosis = await diagnoseService.uploadImage(1, file);
      setResult(diagnosis.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="animate-fade-in text-center mb-5 mt-2">
        <div className="d-inline-block bg-primary bg-opacity-10 p-2 rounded-pill mb-3">
           <span className="badge bg-primary rounded-pill px-3 py-1">GEN-3 VISION ENGINE</span>
        </div>
        <h1 className="display-4 fw-extrabold text-white mb-2" style={{ letterSpacing: '-2px' }}>Intelligent Visual Diagnosis</h1>
        <p className="text-info fw-bold small text-uppercase tracking-widest">Autonomous pathology scanning via EfficientNet-V2 Neural Pipeline</p>
      </div>
      
      <div className="row g-4 justify-content-center">
        {/* Input Panel */}
        <div className="col-lg-6">
          <div className="glass-card overflow-hidden h-100 shadow-lg border-0">
            <div className="p-4 bg-primary bg-opacity-10 border-bottom border-primary border-opacity-10">
               <h5 className="mb-0 fw-extrabold d-flex align-items-center gap-2">
                  <Camera className="text-primary" /> Capturing Interface
               </h5>
            </div>
            <div className="card-body p-4 text-center">
              {showWebcam ? (
                <div className="position-relative animate-fade-in">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-100 rounded-4 shadow-lg mb-3 border border-primary border-4"
                  />
                  <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-4 shadow-lg py-3 btn-premium" onClick={handleCapture}>
                      <Camera size={20} /> CAPTURE NODE
                    </button>
                    <button className="btn btn-dark rounded-circle p-3" onClick={() => setShowWebcam(false)}>
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
            <div className={`p-4 rounded-4 border-2 border-dashed transition-all h-100 d-flex flex-column justify-content-center align-items-center mb-0 ${!image ? 'py-5 border-primary border-opacity-25' : ''}`} style={{ minHeight: '400px', backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
                  {image ? (
                    <div className="position-relative w-100 animate-fade-in">
                      <img src={image} alt="Capture" className="img-fluid rounded-4 shadow-lg mb-3 border border-slate-700 border-4" style={{ maxHeight: '380px', objectFit: 'contain' }} />
                      <button className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-3 shadow" style={{ width: '40px', height: '40px' }} onClick={() => setImage(null)}>
                        <X size={20} />
                      </button>
                      <div className="position-absolute bottom-0 end-0 m-3">
                         <span className="badge bg-primary rounded-pill shadow px-3 py-2 opacity-75">CAPTURED_FRAME // 1024x1024</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="bg-secondary rounded-circle p-5 d-inline-block shadow-lg mb-4 hover-lift">
                        <ImageIcon size={64} className="text-info" strokeWidth={1.5} />
                      </div>
                      <h3 className="fw-extrabold mb-2">Awaiting Input Source</h3>
                      <p className="text-muted px-5 mb-4 max-w-sm mx-auto">Upload high-resolution images of the flock, fecal matter, or individual symptoms for real-time AI cross-referencing.</p>
                      
                      <div className="d-flex justify-content-center gap-3">
                        <button className="btn btn-premium px-5 py-3 shadow-lg" onClick={() => setShowWebcam(true)}>
                          <Zap size={18} /> OPEN CAMERA
                        </button>
                        <label className="btn btn-outline-premium px-5 py-3 mb-0 cursor-pointer shadow-sm">
                          <Upload size={18} /> LOCAL UPLOAD
                          <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {image && !loading && (
              <div className="p-4 bg-secondary bg-opacity-50 border-top border-slate-700">
                <button className="btn btn-primary btn-premium w-100 py-3 shadow-lg fs-5" onClick={submitDiagnosis}>
                  EXECUTE AI PATHOLOGY SCAN <ArrowRight size={22} className="ms-2" />
                </button>
              </div>
            )}
            {loading && (
              <div className="p-5 bg-secondary bg-opacity-50 border-top border-slate-700 text-center animate-pulse">
                <div className="d-flex flex-column align-items-center justify-content-center gap-3">
                  <div className="spinner-grow text-info" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                  <h5 className="fw-extrabold text-info mb-0 mt-2">PROCESSING NEURAL VECTORS...</h5>
                  <p className="text-muted x-small tracking-widest fw-bold">LATENCY: &lt;500ms // MODEL: EF-V2</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-lg-5">
          {result ? (
            <div className="glass-card overflow-hidden h-100 shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className={`p-4 text-white d-flex justify-content-between align-items-center bg-${result.disease === 'Healthy' ? 'success' : 'danger'} shadow`}>
                <div>
                  <h4 className="mb-0 fw-extrabold tracking-tight">ANALYSIS RESULTS</h4>
                  <small className="opacity-75 tracking-widest fw-bold x-small">NODE_SYNC_SUCCESS // {new Date().toLocaleTimeString()}</small>
                </div>
                <div className="bg-white bg-opacity-25 p-3 rounded-circle shadow-inner">
                  {result.disease === 'Healthy' ? <CheckCircle size={32} strokeWidth={3} /> : <AlertCircle size={32} strokeWidth={3} />}
                </div>
              </div>
              <div className="card-body p-4 pt-5">
                <div className="mb-5 text-center">
                   <small className="text-muted fw-bold tracking-widest d-block mb-1">PROBABLE PATHOGEN:</small>
                   <h1 className="display-4 fw-extrabold text-white mb-2" style={{ letterSpacing: '-3px' }}>{result.disease}</h1>
                   <span className={`badge px-4 py-2 rounded-pill fs-6 bg-${result.severity === 'severe' ? 'danger' : result.disease === 'Healthy' ? 'success' : 'warning'} text-white shadow-sm`}>
                     {result.severity.toUpperCase()} ALERT LEVEL
                   </span>
                </div>
                
                <div className="mb-5">
                  <div className="d-flex justify-content-between align-items-end mb-3">
                    <div className="d-flex align-items-center gap-2">
                       <Zap size={20} className="text-info" />
                       <span className="text-muted fw-bold small tracking-wider">AI CONFIDENCE INDEX</span>
                    </div>
                    <span className="fw-extrabold text-info display-6" style={{ fontSize: '1.5rem' }}>{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="progress rounded-pill bg-dark shadow-inner" style={{ height: '14px' }}>
                    <div 
                      className={`progress-bar bg-success rounded-pill progress-bar-striped progress-bar-animated`} 
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 rounded-4 border-start border-4 border-primary shadow-sm mb-4" style={{ backgroundColor: 'rgba(51, 65, 85, 0.2)' }}>
                  <h6 className="fw-extrabold mb-3 d-flex align-items-center gap-2 text-info">
                    <ShieldCheck size={18} className="text-info" /> RECOMMENDED CLINICAL PROTOCOL:
                  </h6>
                  <p className="text-muted small mb-0 lh-lg fw-medium">{result.action}</p>
                </div>

                <div className="alert border-0 glass-card bg-info bg-opacity-5 p-3 rounded-3 d-flex align-items-start gap-2">
                   <Info size={18} className="text-info mt-1" />
                   <p className="small mb-0 text-muted">A copy of this diagnosis has been saved to your clinical history and synchronized with the <strong>Disease Map</strong> module for regional tracking.</p>
                </div>
              </div>
              <div className="p-4 bg-secondary bg-opacity-50 border-top border-slate-700">
                 <button className="btn btn-outline-premium w-100 py-3 rounded-pill fw-bold" onClick={() => setResult(null)}>
                   INITIALIZE NEW SCAN BATCH
                 </button>
              </div>
            </div>
          ) : (
            <div className="glass-card shadow-sm h-100 d-flex flex-column justify-content-center align-items-center text-center p-5 animate-fade-in border-0 border-dashed border-2 border-primary border-opacity-20" style={{ animationDelay: '0.4s' }}>
              <div className="opacity-25">
                <Activity size={100} className="mb-4 text-info animate-pulse" strokeWidth={1} />
                <h3 className="fw-extrabold">Awaiting Analysis</h3>
                <p className="fw-bold text-muted small tracking-widest">TRANSMIT DATA FRAME TO REVEAL AI PATHOLOGY INSIGHTS</p>
              </div>
              <div className="mt-5 w-100">
                 <div className="p-3 mb-2 rounded-3 bg-secondary bg-opacity-30 border-slate-700 border text-start d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-dark p-2 border border-slate-700"><Maximize2 size={16} /></div>
                    <small className="fw-bold">FRAME_RESOLUTION: AUTO</small>
                 </div>
                 <div className="p-3 rounded-3 bg-secondary bg-opacity-30 border-slate-700 border text-start d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-dark p-2 border border-slate-700"><Zap size={16} /></div>
                    <small className="fw-bold">LATENCY_OPTIMIZATION: ACTIVE</small>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="row mt-5 animate-fade-in" style={{ animationDelay: '0.8s' }}>
         <div className="col-12">
            <div className="glass-card p-4 d-flex align-items-center gap-4 bg-secondary bg-opacity-30">
               <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-none d-md-block border border-slate-700">
                  <Info size={24} className="text-info" />
               </div>
               <div>
                  <h6 className="fw-bold mb-1">Diagnostic Protocol Disclaimer</h6>
                  <p className="small text-muted mb-0">This AI diagnostic is a supplemental tool. For critical outbreaks, always consult with a certified veterinarian or regional laboratory node. Data is anonymized for regional health tracking.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DiagnoseImage;
