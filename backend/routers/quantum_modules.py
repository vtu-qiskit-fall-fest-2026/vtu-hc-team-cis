"""
REST API Router Endpoints for Quantum Medical Modules
Provides enterprise HTTP controllers for front-end integration and automated API testing.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from backend.services.quantum_services import (
    run_grover_diagnosis, run_vqe_binding, run_qsvm_resistance, run_qcnn_imaging
)
from backend.services.ai_services import (
    generate_diagnosis_explanation, generate_vqe_explanation, generate_qsvm_explanation, generate_qcnn_explanation
)

router = APIRouter(prefix="/quantum", tags=["Quantum Medical Simulation Engine"])

# --- Pydantic Request Models ---
class GroverDiagnosisRequest(BaseModel):
    symptoms: List[str] = Field(..., example=["fever", "cough", "shortness of breath", "fatigue"])
    age: int = Field(35, ge=0, le=120)
    gender: str = Field("male")
    duration: int = Field(7, ge=1)
    diseases_catalog: List[Dict[str, Any]] = Field(..., description="Reference disease database catalog")

class VQERequest(BaseModel):
    drug_name: str = Field(..., example="Remdesivir")
    drug_smiles: str = Field(..., example="CCC(CC)COC(=O)C(C)NP(=O)...")
    protein_name: str = Field(..., example="SARS-CoV-2 Main Protease")
    protein_pdb_id: str = Field("6LU7")

class QSVMRequest(BaseModel):
    bacterium: str = Field(..., example="Staphylococcus aureus")
    antibiotic: str = Field(..., example="Penicillin G")
    mechanisms: List[str] = Field(..., example=["Beta-lactamase production", "mecA PBP2a modification"])

class QCNNRequest(BaseModel):
    modality: str = Field(..., example="mri")
    filename: str = Field("scan_001.dcm")
    file_size: int = Field(5242880)

# --- Endpoints ---

@router.post("/diagnosis", status_code=status.HTTP_200_OK, summary="Module 1: Execute Grover's Algorithm Diagnosis")
async def execute_grover_diagnosis(payload: GroverDiagnosisRequest):
    """Executes Grover's amplitude amplification search circuit over symptomatic inputs."""
    try:
        res = run_grover_diagnosis(payload.symptoms, payload.age, payload.gender, payload.duration, payload.diseases_catalog)
        if "error" in res:
            raise HTTPException(status_code=400, detail=res["error"])
            
        ai_exp = await generate_diagnosis_explanation(
            disease_name=res["disease"]["name"],
            confidence=res["confidence"],
            qubits=res["qubits"],
            iterations=res["groverIterations"],
            matched_symptoms=res["matchedSymptoms"],
            description=res["disease"].get("description", "Standard clinical pathology description.")
        )
        return {"status": "success", "quantum_result": res, "ai_explanation": ai_exp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quantum calculation execution failure: {str(e)}")

@router.post("/drug-discovery", status_code=status.HTTP_200_OK, summary="Module 2: Execute VQE Drug Binding Free Energy")
async def execute_vqe_drug_discovery(payload: VQERequest):
    """Executes Variational Quantum Eigensolver circuit for PubChem compound against PDB macromolecular target."""
    try:
        res = run_vqe_binding(payload.drug_name, payload.drug_smiles, payload.protein_name, payload.protein_pdb_id)
        ai_exp = await generate_vqe_explanation(
            drug_name=payload.drug_name,
            protein_name=payload.protein_name,
            binding_energy=res["bindingEnergy"],
            affinity_score=res["affinityScore"],
            converged=res["converged"],
            qubits=res["qubits"]
        )
        return {"status": "success", "quantum_result": res, "ai_explanation": ai_exp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"VQE simulation error: {str(e)}")

@router.post("/antibiotic-resistance", status_code=status.HTTP_200_OK, summary="Module 3: Execute QSVM Antimicrobial Susceptibility")
async def execute_qsvm_resistance(payload: QSVMRequest):
    """Executes Quantum Support Vector Machine kernel classification on pathogenic bacterial strain mechanisms."""
    try:
        res = run_qsvm_resistance(payload.bacterium, payload.antibiotic, payload.mechanisms)
        ai_exp = await generate_qsvm_explanation(
            bacterium=payload.bacterium,
            antibiotic=payload.antibiotic,
            resistant=res["resistant"],
            confidence=res["confidence"],
            accuracy=res["accuracy"],
            qubits=res["qubits"]
        )
        return {"status": "success", "quantum_result": res, "ai_explanation": ai_exp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QSVM evaluation failure: {str(e)}")

@router.post("/medical-imaging", status_code=status.HTTP_200_OK, summary="Module 4: Execute QCNN Radiographic Screening")
async def execute_qcnn_imaging(payload: QCNNRequest):
    """Executes Quantum Convolutional Neural Network processing for MRI, CT, and X-ray medical scan imaging."""
    try:
        res = run_qcnn_imaging(payload.modality, payload.filename, payload.file_size)
        ai_exp = await generate_qcnn_explanation(
            modality=payload.modality,
            prediction=res["prediction"],
            confidence=res["confidence"],
            speedup=res["speedup"],
            qubits=res["qubits"]
        )
        return {"status": "success", "quantum_result": res, "ai_explanation": ai_exp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QCNN screening error: {str(e)}")
