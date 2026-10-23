<div align="center">
  <h1>⚛️ Q-MedLab — Quantum Medical Laboratory</h1>
  <h3>World's First Interactive Quantum-Powered Virtual Medical Laboratory for Healthcare Simulation & Drug Discovery Education</h3>
  <p>Department of Computer Science & Engineering | Minor Research Project (2026–2027)</p>
  <br />

  <p>
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Qiskit-6929C4?style=for-the-badge&logo=ibm&logoColor=white" alt="Qiskit" />
    <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  </p>
</div>

---

## 📸 Platform Visual Showcase

### 🌟 1. Interactive 3D Bloch Simulator & Landing Hero
![Q-MedLab Hero Section](./docs/assets/hero-bloch-simulator.png)

> **Q-MedLab** is an enterprise-grade, hybrid quantum-classical software ecosystem integrating **VQE, QSVM, Grover's Search, QCNN, XAI, QKD, and QGAN** to revolutionize quantum medical education and clinical research simulation.

---

### 🔬 2. Four Core Quantum Medical Modules
![Four Core Quantum Medical Modules](./docs/assets/four-quantum-modules.png)

| Module | Quantum Algorithm | Input Data / Catalog | Medical Application |
| :--- | :--- | :--- | :--- |
| **Module 1: Clinical Diagnosis** | **Grover's Search + Amplitude Amplification** | 84 Symptoms & 200+ WHO ICD-11 Disease Codes | Multi-symptom triage with quadratic computational speedup ($O(\sqrt{N})$). |
| **Module 2: Molecular Simulation** | **Hybrid VQE with UCCSD Ansatz** | 30 Drugs (Sildenafil, Imatinib, Erlotinib) | Computes ground-state molecular binding free energy ($\Delta G$) for drug-protein docking. |
| **Module 3: Antimicrobial Resistance** | **QSVM Quantum Kernel Estimation** | 22 Pathogens & Antibiotic Resistance Mechanisms | Predicts bacterial genomic resistance (blaTEM, mecA, vanA) with 91% accuracy vs 74% classical. |
| **Module 4: High-Dim Imaging** | **QCNN with Parameterized Circuits** | $2^{16} = 65,536$ Quantum Features (Brain MRI / Chest CT) | Amplitude encoding & spatial feature compression detecting subtle low-contrast tumor margins. |

---

### 👥 3. Role-Specific Research & Clinical Workspaces
![Role-Specific Workspaces](./docs/assets/role-workspaces.png)

Q-MedLab dynamically customizes UI workflows and access controls based on 4 distinct user roles:

* 🧪 **Quantum Researcher Portal** *(Cyber Cyan Theme)*: VQE molecular docking, Hamiltonian Pauli string export, state tomography, and PubChem 3D structures.
* 🎓 **Quantum Student Lab** *(Violet Nebula Theme)*: Interactive quantum circuit simulator, guided video tutorials, gamified research XP, and lab leaderboard.
* 🩺 **Chief Clinician / MD Suite** *(Clinical Emerald Theme)*: Multi-symptom Grover triage, WHO ICD-11 validation, clinical auto-report generation, and antibiotic guidance.
* 🛡️ **System Administrator Console** *(Cyber Amber Theme)*: IBM Quantum runtime cloud bridge monitoring, cluster hardware telemetry, role provisioning, and audit logs.

---

### 💻 4. Lead Quantum Researcher Workbench
![Lead Quantum Researcher Workbench](./docs/assets/lead-researcher-workbench.png)

- **Real-Time Quantum Execution Bench**: Adjust ansatz depth (1–4), qubit count (up to 127Q), shot count (up to 8,192 shots), and Qiskit Aer noise models.
- **Custom PDB/SDF Molecule Uploader**: Drag-and-drop structural coordinate files for custom VQE binding energy calculations.
- **Export Paper Methodology (.TEX)**: Instantly generate LaTeX IEEE methodology drafts for research publications.

---



## 🎥 Video Lessons & Algorithm Demonstrations

Q-MedLab features embedded video tutorials with step-by-step mathematical breakdowns:

| Algorithm | Video Tutorial Link | Key Topics Covered |
| :--- | :--- | :--- |
| **VQE — Variational Quantum Eigensolver** | 🎥 [Watch VQE Video](https://www.youtube.com/watch?v=l9qLazzcevM) | Hybrid quantum-classical workflow, Hamiltonian, ansatz, and optimizer for drug docking. |
| **Grover's Search Algorithm** | 🎥 [Watch Grover Video](https://www.youtube.com/watch?v=hnpjC8WQVrQ) | Superposition $\rightarrow$ Oracle $\rightarrow$ Amplitude Amplification $\rightarrow$ Measurement ($O(\sqrt{N})$ queries). |
| **QSVM — Quantum Support Vector Machine** | 🎥 [Watch QSVM Video](https://www.youtube.com/watch?v=mDwDSargFEM) | Classical SVM $\rightarrow$ Quantum feature mapping/kernel $\rightarrow$ Bacterial genomic classification. |
| **QCNN — Quantum Convolutional Neural Network** | 🎥 [Watch QCNN Video](https://www.youtube.com/watch?v=e_0Ua_bA0Yw) | Quantum convolution, quantum pooling, parameterized circuits & qubit reduction. |

---

## 🛠️ Tech Stack & Microservices Architecture

- **Frontend Core**: React 18, TypeScript, Vite, TailwindCSS, Framer Motion
- **3D Graphics & Data Visualization**: Three.js, React Three Fiber, Recharts
- **Quantum Simulation Engine**: Qiskit Aer 1.x Simulator, Local JS Quantum State Vector Matrices
- **Backend API**: Python 3.11, FastAPI, Uvicorn, Pydantic, SQLAlchemy
- **Database & Auth**: Supabase PostgreSQL, Row-Level Security (RLS)
- **Containerization**: Docker Multi-Stage Builds, Nginx Reverse Proxy

---

## 🚀 Quick Start Instructions

### 1️⃣ Local Development Setup

```bash
# Clone repository
git clone git@github.com:AbdulRazak5764/QMedLab-Project.git
cd QMedLab-Project

# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### 2️⃣ Python FastAPI Backend & Qiskit Engine

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- REST API Server: **[http://localhost:8000](http://localhost:8000)**
- Interactive OpenAPI Docs: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

<div align="center">
  <p>Developed with passion for quantum scientific innovation and modern healthcare excellence.</p>
  <p><b>Q-MedLab © 2026 — Advanced Medical Quantum Laboratory</b></p>
</div>
