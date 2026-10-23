// AI explanation engine — generates medical explanations of quantum results.
// Uses deterministic templating based on result structure (no external API calls
// required, but structured to accept OpenAI/Claude when keys are configured).

import type { DiagnosisResult, VQEResult, QSVMResult, QCNNResult } from '@/quantum/engine';

export interface AIExplanation {
  summary: string;
  details: string[];
  recommendation: string;
  disclaimer: string;
}

export function explainDiagnosis(result: DiagnosisResult): AIExplanation {
  const { disease, confidence, matchedSymptoms, matchRatio } = result;
  return {
    summary: `Based on Grover's search amplification across ${result.qubits} qubits, the quantum oracle identified ${disease.name} (${disease.icd11_code ?? 'ICD-11'}) as the most probable diagnosis with ${confidence}% confidence.`,
    details: [
      `The algorithm performed ${result.groverIterations} Grover iterations over a search space of ${Math.pow(2, result.qubits)} possible disease states, achieving quadratic speedup over classical search.`,
      `Matched symptoms: ${matchedSymptoms.join(', ')} (${Math.round(matchRatio * 100)}% overlap with the disease profile).`,
      `Disease category: ${disease.category}. Severity classification: ${disease.severity}.`,
      disease.description,
    ],
    recommendation:
      confidence > 80
        ? 'High-confidence match. Recommend clinical correlation and confirmatory laboratory testing.'
        : confidence > 60
          ? 'Moderate confidence. Consider differential diagnosis and additional symptom evaluation.'
          : 'Low confidence. Broaden symptom input or consult specialist for comprehensive evaluation.',
    disclaimer:
      'This quantum-assisted analysis is for educational and research purposes only and does not constitute medical advice. Always consult a qualified healthcare professional.',
  };
}

export function explainVQE(result: VQEResult, drugName: string, proteinName: string): AIExplanation {
  return {
    summary: `VQE simulation converged after ${result.iterations} iterations, estimating a binding energy of ${result.bindingEnergy} kcal/mol between ${drugName} and ${proteinName}.`,
    details: [
      `The variational circuit used ${result.qubits} qubits with ${result.hamiltonianTerms} Hamiltonian terms in the molecular Hamiltonian.`,
      `Affinity score: ${result.affinityScore}/100. ${result.affinityScore > 70 ? 'Strong binding affinity detected.' : result.affinityScore > 40 ? 'Moderate binding affinity.' : 'Weak binding affinity — consider structural optimization.'}`,
      `Convergence ${result.converged ? 'achieved' : 'not fully achieved'} within the iteration budget.`,
      `Negative binding energy indicates thermodynamically favorable binding interaction.`,
    ],
    recommendation:
      result.affinityScore > 70
        ? 'Promising drug-target interaction. Proceed to molecular dynamics simulation and in-vitro validation.'
        : 'Suboptimal binding. Consider lead optimization or alternative compound scaffolds.',
    disclaimer:
      'VQE results are simulated for educational demonstration. Real drug discovery requires extensive laboratory validation and clinical trials.',
  };
}

export function explainQSVM(result: QSVMResult, bacterium: string, antibiotic: string): AIExplanation {
  return {
    summary: `QSVM classification predicts ${bacterium} is ${result.resistant ? 'RESISTANT' : 'SUSCEPTIBLE'} to ${antibiotic} with ${result.confidence}% confidence.`,
    details: [
      `The quantum kernel was evaluated ${result.kernelEvaluations} times using ${result.qubits} qubits with a ${result.featureMap.join(' + ')} feature map.`,
      `Model accuracy on validation set: ${result.accuracy}%. Support vectors identified: ${result.supportVectors}.`,
      result.resistant
        ? `Resistance mechanisms detected: beta-lactamase production, efflux pumps, or target modifications may reduce drug efficacy.`
        : `No significant resistance markers detected. Standard dosing should be effective.`,
    ],
    recommendation: result.resistant
      ? `Consider alternative antibiotics: vancomycin, linezolid, or daptomycin. Perform phenotypic susceptibility testing to confirm.`
      : `${antibiotic} remains an effective treatment option. Monitor for emerging resistance patterns.`,
    disclaimer:
      'QSVM predictions are educational simulations. Clinical antibiotic stewardship requires standardized AST testing per CLSI/EUCAST guidelines.',
  };
}

export function explainQCNN(result: QCNNResult, modality: string): AIExplanation {
  const activeModality = result.detectedModality ? result.detectedModality.toUpperCase() : modality.toUpperCase();
  const mismatchNote = result.modalityMismatch
    ? ` Note: Scan auto-identified as ${result.detectedModality.toUpperCase()} (${result.prediction}) despite ${modality.toUpperCase()} tab selection.`
    : '';

  return {
    summary: `QCNN analysis of the ${activeModality} image predicts: ${result.prediction} with ${result.confidence}% confidence.${mismatchNote}`,
    details: [
      `Quantum convolutional network used ${result.qubits} qubits across ${result.layers} parametrized layers.`,
      `Quantum model accuracy: ${result.quantumAccuracy}% vs classical CNN baseline: ${result.classicalAccuracy}% — a ${result.speedup}x training speedup.`,
      `The attention heatmap highlights regions of highest diagnostic significance.`,
      result.prediction.includes('Normal')
        ? 'No abnormal findings detected in the analyzed image.'
        : 'Abnormal pathology/lesion detected. Recommend specialist review and correlative imaging.',
    ],
    recommendation:
      result.prediction.includes('Normal')
        ? 'No immediate action required. Maintain routine screening schedule.'
        : 'Flag for radiologist review. Consider additional imaging or laboratory correlation.',
    disclaimer:
      'QCNN imaging analysis is for research demonstration only. Clinical diagnosis requires board-certified radiologist interpretation.',
  };
}
