import os
from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Q-MedLab Production Quantum Healthcare Engine"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "2.5.0-PROD"
    
    # CORS Configurations
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"]
    
    # Supabase / Database Connections
    SUPABASE_URL: Optional[str] = os.getenv("VITE_SUPABASE_URL", "https://ynqcxlnkoixwibpewlws.supabase.co")
    SUPABASE_ANON_KEY: Optional[str] = os.getenv("VITE_SUPABASE_ANON_KEY", "")
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/postgres")
    
    # Redis Configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CACHE_ENABLED: bool = True
    
    # IBM Quantum API Configuration
    IBM_QUANTUM_TOKEN: Optional[str] = os.getenv("IBM_QUANTUM_TOKEN", "")
    QISKIT_SIMULATION_BACKEND: str = "qiskit_aer_simulator"
    
    # AI Engine API Keys
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4o"
    CLAUDE_API_KEY: Optional[str] = os.getenv("CLAUDE_API_KEY", "")
    CLAUDE_MODEL: str = "claude-3-5-sonnet-20240620"
    
    # JWT Security Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "qmedlab-super-secret-jwt-signing-key-2026-secure-enterprise")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    class Config:
        case_sensitive = True

settings = Settings()
