# Q-MedLab Complete System Engineering Diagrams
This document consolidates formal IEEE and software engineering UML / Mermaid technical specifications for Q-MedLab.

---

## 1. Entity Relationship Diagram (ERD & Supabase Database Schema)

```mermaid
erDiagram
    PROFILES ||--o{ EXPERIMENTS : conducts
    PROFILES ||--o{ BOOKMARKS : bookmarks
    PROFILES ||--o{ NOTIFICATIONS : receives
    EXPERIMENTS ||--o{ QUANTUM_JOBS : executes

    PROFILES {
        uuid id PK
        text email "UNIQUE"
        text full_name
        text institution
        text role "admin | researcher"
        integer points
        text avatar_url
        timestamptz created_at
    }

    EXPERIMENTS {
        uuid id PK
        uuid user_id FK
        text module "diagnosis | drug_discovery | antibiotic | imaging"
        text algorithm "Grover | VQE | QSVM | QCNN"
        text title
        jsonb input_data
        jsonb result_data
        float confidence
        text status "completed | processing"
        timestamptz created_at
    }

    QUANTUM_JOBS {
        uuid id PK
        uuid user_id FK
        uuid experiment_id FK
        text backend "ibmq_guadalupe | aer_simulator"
        text algorithm
        integer qubits
        integer shots
        text status "completed | queued | running"
        integer execution_time_ms
        timestamptz created_at
    }

    DISEASES {
        uuid id PK
        text name "UNIQUE"
        text icd11_code
        text category
        text[] symptoms
        text severity
        text description
    }

    DRUGS {
        uuid id PK
        text name "UNIQUE"
        integer pubchem_cid
        text formula
        float molecular_weight
        text smiles
        text description
    }

    PROTEINS {
        uuid id PK
        text name "UNIQUE"
        text pdb_id
        text organism
        text function
    }

    BACTERIA {
        uuid id PK
        text name "UNIQUE"
        text gram_stain
        text[] resistance_mechanisms
    }
```

---

## 2. Sequence Diagram: Hybrid Quantum Execution Lifecycle (VQE Module 2 Example)

```mermaid
sequenceDiagram
    autonumber
    actor User as Dr. Abdul Razak (Researcher)
    participant UI as React / Vite SPA Client
    participant Nginx as Nginx API Gateway
    participant API as FastAPI Backend Engine
    participant Qiskit as Qiskit / Aer Simulator
    participant DB as Supabase PostgreSQL
    participant AI as AI Synthesizer (OpenAI / Claude)

    User->>UI: Selects Drug (Remdesivir) & Target (6LU7 Protease)
    UI->>DB: Fetch Compound SMILES & PDB Coordinates
    DB-->>UI: Return Verified Structures (or Fallback Catalog)
    UI->>UI: Render Three.js 3D Molecular Interaction Canvas
    User->>UI: Clik "Execute Quantum Simulation"
    UI->>Nginx: POST /api/v1/quantum/drug-discovery (SMILES, PDB)
    Nginx->>API: Forward HTTPS Payload
    API->>Qiskit: Prepare RealAmplitudes Ansatz (Qubits = 8)
    loop Variational Energy Optimization (100 Iterations)
        Qiskit->>Qiskit: Measure Hamiltonian Expectation Value <H>
    end
    Qiskit-->>API: Return Ground State Binding Energy (-11.42 kcal/mol)
    API->>AI: Generate Clinical Explanation (OpenAI GPT-4o / Claude 3.5)
    AI-->>API: Return Structured Medical Recommendation & Disclaimer
    API-->>Nginx: 200 OK (Quantum Telemetry + AI Explanation)
    Nginx-->>UI: Deliver Simulation Results
    UI->>DB: Insert Telemetry into EXPERIMENTS & QUANTUM_JOBS Tables
    UI->>User: Display Convergence Graph, Confidence Meter & AI Report
```

---

## 3. Class Hierarchy & Architectural Components Diagram

```mermaid
classDiagram
    class Application {
        +AuthContext auth
        +ThemeContext theme
        +Router router
        +init()
    }

    class AuthContext {
        +User session
        +Profile profile
        +signIn(email, pass)
        +signUp(email, pass, name)
        +createDemoSession(email)
        +signOut()
    }

    class QuantumService {
        <<FastAPI Service>>
        +run_grover_diagnosis(symptoms, catalog)
        +run_vqe_binding(smiles, pdb)
        +run_qsvm_resistance(bacterium, antibiotic, mechanisms)
        +run_qcnn_imaging(modality, file_size)
    }

    class AIService {
        <<LLM Synthesis>>
        +generate_diagnosis_explanation()
        +generate_vqe_explanation()
        +generate_qsvm_explanation()
        +generate_qcnn_explanation()
    }

    class ExperimentHook {
        <<useExperiment>>
        +save(experimentData)
        +exportPDF(title, sections)
        +exportJSON(data)
    }

    Application --> AuthContext : Dependency Injection
    Application --> ExperimentHook : State Custom Hook
    QuantumService ..> AIService : Async Synthesis Pairing
    ExperimentHook ..> QuantumService : API Invocation
```

---

## 4. Use Case Diagram: User Roles & Platform Interaction Capabilities

```mermaid
graph LR
    subgraph Users & Actors
        Researcher((Principal Investigator / Researcher))
        Student((Academic Scholar / Evaluator))
        Admin((System Administrator))
    end

    subgraph Q-MedLab Production Healthcare Platform
        UC1[Run Grover Quadratic Diagnostic Symptoms Search]
        UC2[Simulate VQE Molecular Binding & View 3D PDB Canvas]
        UC3[Predict Antimicrobial Resistance via QSVM Hilbert Kernel]
        UC4[Screen Radiographic DICOM Scans via QCNN Unitary Pooling]
        UC5[Download Formal PDF / JSON Technical Research Reports]
        UC6[Inspect IBM Quantum Superconducting Cloud Hardware Queues]
        UC7[Activate Seamless Offline Demo Session & Benchmark Catalogs]
    end

    Researcher --> UC1
    Researcher --> UC2
    Researcher --> UC3
    Researcher --> UC4
    Researcher --> UC5
    Researcher --> UC6

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC5
    Student --> UC7

    Admin --> UC6
    Admin --> UC7
```
