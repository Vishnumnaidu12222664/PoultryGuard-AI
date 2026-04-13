import React, { useState } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { Mic, Download, Play, AlertCircle, Volume2, ShieldAlert, Waves, Info, Zap, ChevronRight, Activity, RefreshCw } from 'lucide-react';
import { diagnoseService } from '../services/api';

const DiagnoseAudio = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const recorderControls = useAudioRecorder();

  const addAudioElement = (blob) => {
    setAudioBlob(blob);
  };

  const submitDiagnosis = async () => {
    if (!audioBlob) return;
    setLoading(true);
    setResult(null);
    try {
      const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });
      const res = await diagnoseService.uploadAudio(1, file);
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
        <div className="d-inline-block bg-info bg-opacity-10 p-2 rounded-pill mb-3 border border-info border-opacity-20">
           <span className="badge bg-info rounded-pill px-3 py-1 text-white">GEN-2 ACOUSTIC SCANNER</span>
        </div>
        <h1 className="display-4 fw-extrabold text-white mb-2" style={{ letterSpacing: '-2px' }}>Acoustic Symptom Analysis</h1>
        <p className="text-info fw-bold small text-uppercase tracking-widest">Frequency-Domain respiratory monitoring & distress call profiling</p>
      </div>
      
      <div className="row g-4 justify-content-center">
        <div className="col-lg-6">
          <div className="glass-card overflow-hidden h-100 shadow-xl border-slate-700">
            <div className="p-4 bg-primary bg-opacity-10 border-bottom border-slate-700" style={{ backgroundColor: '#0F172A' }}>
               <h5 className="mb-0 fw-extrabold d-flex align-items-center gap-2 text-white">
                  <Mic className="text-info" /> REAL-TIME AUDIO FEED
               </h5>
            </div>
            <div className="card-body p-5 text-center bg-secondary bg-opacity-20">
              <div className="mb-5 d-inline-block p-5 rounded-circle bg-info bg-opacity-5 border border-info border-opacity-20 position-relative">
                 <div className="animate-pulse bg-info bg-opacity-10 rounded-circle p-4">
                    <Mic size={64} className="text-info" strokeWidth={1.5} />
                 </div>
                 {recorderControls.isRecording && (
                    <div className="position-absolute top-50 start-50 translate-middle w-100 h-100">
                       <div className="w-100 h-100 border border-4 border-info rounded-circle animate-ping opacity-50"></div>
                    </div>
                 )}
              </div>
              
              <h3 className="fw-extrabold mb-3 text-white">Record Living Environment</h3>
              <p className="text-white text-opacity-70 small mb-5 px-5 mx-auto max-w-sm">Position the capture node near the flock center for 15-20 seconds to profile breathing patterns and abnormal vocalizations.</p>
              
              <div className="d-flex justify-content-center mb-5">
                <div className="glass-card p-4 rounded-pill bg-dark shadow-2xl border-slate-700 scale-110 d-flex align-items-center justify-content-center" style={{ minWidth: '220px', border: '2px solid #334155' }}>
                  <AudioRecorder 
                    onRecordingComplete={addAudioElement}
                    recorderControls={recorderControls}
                    showVisualizer={true}
                  />
                </div>
              </div>

              {audioBlob && (
                <div className="mt-4 p-3 glass-card bg-info bg-opacity-5 rounded-4 animate-fade-in border-info border-opacity-20 w-100 shadow-inner">
                  <div className="d-flex align-items-center justify-content-between mb-2 px-2">
                     <small className="fw-bold text-info x-small tracking-widest">LOCALLY_BUFFERED_WAVEFORM // READY</small>
                     <Zap size={14} className="text-info animate-pulse" />
                  </div>
                  <audio src={URL.createObjectURL(audioBlob)} controls className="w-100 rounded-pill" style={{ filter: 'invert(90%) hue-rotate(180deg)' }} />
                </div>
              )}
            </div>
            <div className="p-4 bg-primary bg-opacity-50 border-top border-slate-700" style={{ backgroundColor: '#0F172A' }}>
              <button 
                className="btn btn-info btn-premium w-100 py-3 fw-bold shadow-lg text-white" 
                onClick={submitDiagnosis}
                disabled={!audioBlob || loading}
              >
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                     <RefreshCw className="animate-spin" size={20} /> ANALYZING SPECTROGRAMS...
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                     EXECUTE ACOUSTIC SYNC <ChevronRight size={20} />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          {result ? (
            <div className={`glass-card overflow-hidden h-100 shadow-xl border-slate-700 animate-fade-in`} style={{ animationDelay: '0.2s' }}>
              <div className={`p-4 text-white d-flex justify-content-between align-items-center bg-${result.urgency === 'high' ? 'danger' : 'warning'} shadow-lg`}>
                <div>
                   <h4 className="mb-0 fw-extrabold tracking-tight">ACOUSTIC PROFILE MATCH</h4>
                   <small className="opacity-75 tracking-widest fw-bold x-small">NODE_SIGNAL_SYNC_SUCCESS</small>
                </div>
                <div className="bg-white bg-opacity-25 p-3 rounded-circle shadow-inner">
                   <Waves size={32} />
                </div>
              </div>
              <div className="card-body p-4 pt-5 bg-secondary bg-opacity-20">
                <div className="d-flex align-items-center mb-5 text-center flex-column">
                  <div className="mb-2 p-3 bg-dark bg-opacity-40 rounded-circle shadow-inner border border-slate-700">
                     <Volume2 size={48} className="text-info" />
                  </div>
                  <h1 className="display-4 fw-extrabold text-white mb-2" style={{ letterSpacing: '-2px' }}>{result.symptom}</h1>
                  <span className={`badge px-4 py-2 rounded-pill fs-6 bg-${result.urgency === 'high' ? 'danger' : 'warning'} text-white shadow-sm fw-bold border border-white border-opacity-20`}>
                    {result.urgency.toUpperCase()} PRIORITY
                  </span>
                </div>

                <div className="row g-4 mb-5">
                  <div className="col-6">
                    <div className="p-4 glass-card bg-primary bg-opacity-30 border-slate-700 text-center hover-lift h-100 d-flex flex-column justify-content-center">
                      <small className="text-info d-block fw-bold tracking-widest mb-2 x-small">PEAK_THRESHOLD</small>
                      <h2 className={`fw-extrabold mb-0 text-${result.urgency === 'high' ? 'danger' : 'warning'}`}>
                        {result.urgency.toUpperCase()}
                      </h2>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-4 glass-card bg-primary bg-opacity-30 border-slate-700 text-center hover-lift h-100 d-flex flex-column justify-content-center">
                      <small className="text-info d-block fw-bold tracking-widest mb-2 x-small">NEURAL_CONFIDENCE</small>
                      <h2 className="fw-extrabold mb-0 text-success">{(result.disease_match * 100).toFixed(1)}%</h2>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary bg-opacity-50 rounded-4 border-start border-4 border-info shadow-xl mb-4 border-slate-700">
                  <h6 className="fw-extrabold mb-3 d-flex align-items-center gap-2 text-info">
                     <ShieldAlert size={18} className="text-info" /> PATHOLOGICAL CLASSIFICATION:
                  </h6>
                  <p className="text-white small mb-0 lh-lg fw-medium">
                    Neural analysis detected respiratory patterns consistent with <strong>Rales</strong> or <strong>Wheezing</strong>. 
                    This biometric signature is strongly associated with <strong>Newcastle Disease</strong> or <strong>Infectious Bronchitis</strong>.
                  </p>
                </div>

                <div className="alert border-0 glass-card bg-danger bg-opacity-5 p-3 rounded-3 d-flex align-items-center gap-3 border border-danger border-opacity-20">
                  <AlertCircle size={24} className="text-danger flex-shrink-0" />
                  <p className="small mb-0 text-white fw-bold">CRITICAL: Ventilation integrity check recommended. Verify ammonia levels immediately.</p>
                </div>
              </div>
              <div className="p-4 bg-primary bg-opacity-50 border-top border-slate-700">
                 <button className="btn btn-outline-premium w-100 py-3 rounded-pill fw-bold" onClick={() => setResult(null)}>
                   RESET ACOUSTIC NODE
                 </button>
              </div>
            </div>
          ) : (
            <div className="glass-card shadow-sm h-100 bg-secondary bg-opacity-20 d-flex flex-column justify-content-center align-items-center text-center p-5 animate-fade-in border-0 border-dashed border-2 border-info border-opacity-20" style={{ animationDelay: '0.4s' }}>
              <div className="opacity-25">
                <Activity size={100} className="mb-4 text-info animate-float" strokeWidth={1} />
                <h3 className="fw-extrabold text-white">Awaiting Audio Transmission</h3>
                <p className="fw-bold text-info small tracking-widest uppercase">CAPTURING ENVIRONMENTAL SPECTROGRAMS...</p>
              </div>
              <div className="mt-5 w-100 d-flex flex-column gap-3">
                 <div className="p-3 rounded-3 bg-primary bg-opacity-30 border border-slate-700 text-start d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-dark p-2 border border-slate-700"><Waves size={16} className="text-info" /></div>
                    <small className="fw-bold text-white uppercase tracking-widest x-small">SPECTRAL_DENSITY: ANALYZING</small>
                 </div>
                 <div className="p-3 rounded-3 bg-primary bg-opacity-30 border border-slate-700 text-start d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-dark p-2 border border-slate-700"><RefreshCw size={16} className="text-success" /></div>
                    <small className="fw-bold text-white uppercase tracking-widest x-small">BITRATE: HIGH_FIDELITY</small>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnoseAudio;
