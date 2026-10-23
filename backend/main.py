"""
Q-MedLab Production FastAPI Backend Application
Entry point for REST API server, CORS configuration, Swagger OpenAPI docs, and error handling.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.routers import quantum_modules, system

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    **Quantum-Powered Virtual Medical Laboratory for Healthcare Simulation & Drug Discovery Education.**
    Enterprise REST API Backend powering real-time Qiskit simulation kernels, IBM Quantum cloud hooks, and clinical AI synthesizers.
    
    ### Modules Available:
    - **Module 1**: Grover's Amplitude Amplification Disease Diagnosis
    - **Module 2**: Variational Quantum Eigensolver (VQE) Drug Discovery & Molecular Binding
    - **Module 3**: Quantum Support Vector Machine (QSVM) Antibiotic Susceptibility Screening
    - **Module 4**: Quantum Convolutional Neural Network (QCNN) Radiographic Oncology Classification
    """,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React/Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Router Modules
app.include_router(quantum_modules.router, prefix=settings.API_V1_STR)
app.include_router(system.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Root"])
async def root_endpoint():
    """Root endpoint welcoming clients to Q-MedLab API."""
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": "http://localhost:8000/docs",
        "health_check": f"http://localhost:8000{settings.API_V1_STR}/system/health",
        "status": "ONLINE & OPERATIONAL"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
