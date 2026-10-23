// Live PubChem REST API integration for drug discovery module.
// Docs: https://pubchem.ncbi.nlm.nih.gov/rest/docs.html

export interface PubChemCompound {
  cid: number;
  title: string;
  molecular_formula: string;
  molecular_weight: string;
  canonical_smiles: string;
  inchikey: string;
  iupac_name: string;
  description?: string;
  synonyms?: string[];
}

const BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

// Search compounds by name
export async function searchCompound(name: string): Promise<PubChemCompound | null> {
  try {
    const res = await fetch(`${BASE}/compound/name/${encodeURIComponent(name)}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey,IUPACName/JSON`);
    if (!res.ok) return null;
    const data = await res.json();
    const props = data?.PropertyTable?.Properties?.[0];
    if (!props) return null;
    return {
      cid: props.CID,
      title: name,
      molecular_formula: props.MolecularFormula ?? '',
      molecular_weight: props.MolecularWeight ?? '',
      canonical_smiles: props.CanonicalSMILES ?? '',
      inchikey: props.InChIKey ?? '',
      iupac_name: props.IUPACName ?? '',
    };
  } catch (err) {
    console.error('PubChem search failed:', err);
    return null;
  }
}

// Get compound description
export async function getCompoundDescription(cid: number): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/compound/cid/${cid}/description/JSON`);
    if (!res.ok) return null;
    const data = await res.json();
    const desc = data?.InformationList?.Information?.[0]?.Description;
    return desc ?? null;
  } catch {
    return null;
  }
}

// Get synonyms
export async function getCompoundSynonyms(cid: number): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/compound/cid/${cid}/synonyms/TXT`);
    if (!res.ok) return [];
    const text = await res.text();
    return text.split('\n').filter(Boolean).slice(0, 10);
  } catch {
    return [];
  }
}

// Full compound fetch with description + synonyms
export async function fetchCompoundFull(name: string): Promise<PubChemCompound | null> {
  const base = await searchCompound(name);
  if (!base) return null;
  const [description, synonyms] = await Promise.all([
    getCompoundDescription(base.cid),
    getCompoundSynonyms(base.cid),
  ]);
  return { ...base, description: description ?? undefined, synonyms };
}

// 2D structure image URL (PubChem generates this)
export function compoundImage2D(cid: number): string {
  return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`;
}

// 3D SDF structure URL for 3D viewer
export function compoundSDF3D(cid: number): string {
  return `${BASE}/compound/cid/${cid}/SDF?record_type=3d`;
}
