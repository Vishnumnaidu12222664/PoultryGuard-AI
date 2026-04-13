# PoultryGuard AI 🐔

PoultryGuard AI is an intelligent poultry disease detection and farm management platform designed for modern livestock farming. It leverages AI/ML for early diagnosis through image and audio analysis, predicts disease outbreaks, and provides economic loss assessments.

## 🚀 Features
- **Photo-Based Diagnosis**: EfficientNetB3 model for classifying Newcastle Disease, Coccidiosis, and more.
- **Audio Analysis**: Whisper + Librosa pipeline to detect respiratory distress in flocks.
- **Outbreak Predictor**: SIR epidemiological modeling for disease spread simulation.
- **AI Vet Assistant**: RAG-powered chatbot (LangChain + GPT-4o) for clinical advice.
- **Vaccination Tracker**: Integrated schedule management with automated SMS reminders.
- **Disease Heatmap**: Leaflet.js visualization of regional health trends.
- **Economic Loss Estimator**: Financial impact projection of mortality events.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Bootstrap 5, Leaflet, Chart.js, Lucide Icons.
- **Backend**: FastAPI (Python 3.11), MySQL 8, SQLAlchemy.
- **Async Processing**: Celery + Redis.
- **AI/ML**: TensorFlow, OpenAI Whisper, LangChain (RAG), Scikit-learn, SciPy.
- **Infrastructure**: Docker, Kubernetes, Nginx, Prometheus/Grafana.

## 📦 Setup & Installation

### Local Development (Docker Compose)
1. Ensure you have Docker and Docker Compose installed.
2. Clone the repository.
3. Add your API keys to `backend/app/core/config.py` (OpenAI, Twilio).
4. Run the full stack:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

### Manual Backend Setup
1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
2. Run backend:
```bash
uvicorn app.main:app --reload
```

### Manual Frontend Setup
1. Install dependencies:
```bash
cd frontend
npm install
```
2. Start dev server:
```bash
npm run dev
```

## 🏗 Kubernetes Deployment
Deploy to Minikube or cloud K8s:
```bash
kubectl apply -f k8s/
```

## 📈 Monitoring
- **Prometheus**: Scrapes `/metrics` from the backend.
- **Grafana**: Pre-configured dashboards for request rates and AI inference latency.

## 🤝 Contribution
1. Fork the repo.
2. Create your feature branch.
3. Commit and push your changes.
4. Open a Pull Request.

---
© 2026 PoultryGuard AI — Intelligent Livestock Management
