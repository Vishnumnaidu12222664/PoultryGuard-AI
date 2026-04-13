from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from .api.routes import auth, diagnose, predict, chat, vaccinations, map, economic
from .core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(diagnose.router, prefix=f"{settings.API_V1_STR}/diagnose", tags=["diagnose"])
app.include_router(predict.router, prefix=f"{settings.API_V1_STR}/predict", tags=["predict"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])
app.include_router(vaccinations.router, prefix=f"{settings.API_V1_STR}/vaccinations", tags=["vaccinations"])
app.include_router(map.router, prefix=f"{settings.API_V1_STR}/map", tags=["map"])
app.include_router(economic.router, prefix=f"{settings.API_V1_STR}/economic", tags=["economic"])

# Initialize Prometheus Instrumentator
Instrumentator().instrument(app).expose(app)

@app.get("/")
def read_root():
    return {"message": "Welcome to PoultryGuard AI API"}
