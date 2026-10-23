import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Role = 'admin' | 'researcher' | 'student' | 'clinician';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  institution: string | null;
  avatar_url: string | null;
  bio: string | null;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Experiment {
  id: string;
  user_id: string;
  module: 'diagnosis' | 'drug_discovery' | 'antibiotic' | 'imaging';
  algorithm: string;
  title: string;
  input_data: Record<string, unknown>;
  result_data: Record<string, unknown>;
  confidence: number | null;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
}

export interface QuantumJob {
  id: string;
  user_id: string;
  experiment_id: string | null;
  backend: string;
  algorithm: string;
  qubits: number;
  shots: number;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  result: Record<string, unknown> | null;
  queue_position: number | null;
  execution_time_ms: number | null;
  created_at: string;
  completed_at: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Disease {
  id: string;
  name: string;
  icd11_code: string | null;
  category: string;
  symptoms: string[];
  severity: string;
  description: string;
}

export interface Drug {
  id: string;
  name: string;
  pubchem_cid: number | null;
  formula: string | null;
  molecular_weight: number | null;
  smiles: string | null;
  description: string | null;
}

export interface Protein {
  id: string;
  name: string;
  pdb_id: string | null;
  organism: string | null;
  function: string | null;
}

export interface Bacterium {
  id: string;
  name: string;
  gram_stain: string;
  resistance_mechanisms: string[];
}
