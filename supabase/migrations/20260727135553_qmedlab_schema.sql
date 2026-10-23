/*
# Q-MedLab Core Schema

Multi-user healthcare SaaS platform for quantum-powered medical simulations.
Each authenticated user owns their experiments, reports, bookmarks, and history.

1. New Tables
- `profiles` — extended user info (role, full_name, institution, avatar) linked to auth.users
- `diseases` — reference catalog of diseases with symptoms (real WHO/ICD-11 style data)
- `drugs` — reference catalog of drugs (sourced from PubChem at runtime)
- `proteins` — reference catalog of proteins (sourced from PDB at runtime)
- `bacteria` — reference catalog for antibiotic resistance module
- `experiments` — user-run quantum experiments across all 4 modules
- `reports` — generated PDF/CSV reports for experiments
- `medical_images` — uploaded medical imaging files metadata
- `quantum_jobs` — quantum job submissions (simulated IBM Quantum)
- `notifications` — user notifications
- `bookmarks` — user-saved experiments/items
- `history` — user activity log
- `leaderboard` — aggregated user scoring for gamification

2. Security
- RLS enabled on every table.
- Owner-scoped CRUD on user-owned tables via auth.uid() = user_id.
- Reference catalog tables (diseases, drugs, proteins, bacteria) are readable by all authenticated users.
- profiles table: each user reads/updates own profile.
*/

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'researcher' CHECK (role IN ('admin','researcher','student','clinician')),
  institution text,
  avatar_url text,
  bio text,
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Diseases reference catalog (real WHO/ICD-11 style data)
CREATE TABLE IF NOT EXISTS diseases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icd11_code text,
  category text,
  symptoms text[] NOT NULL,
  severity text CHECK (severity IN ('mild','moderate','severe','critical')),
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "diseases_read_all" ON diseases;
CREATE POLICY "diseases_read_all" ON diseases FOR SELECT TO authenticated USING (true);

-- Drugs reference catalog (PubChem-sourced at runtime, cached here)
CREATE TABLE IF NOT EXISTS drugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  pubchem_cid integer,
  formula text,
  molecular_weight numeric,
  smiles text,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "drugs_read_all" ON drugs;
CREATE POLICY "drugs_read_all" ON drugs FOR SELECT TO authenticated USING (true);

-- Proteins reference catalog (PDB-sourced at runtime)
CREATE TABLE IF NOT EXISTS proteins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  pdb_id text,
  organism text,
  function text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE proteins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "proteins_read_all" ON proteins;
CREATE POLICY "proteins_read_all" ON proteins FOR SELECT TO authenticated USING (true);

-- Bacteria reference catalog for antibiotic resistance
CREATE TABLE IF NOT EXISTS bacteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  gram_stain text CHECK (gram_stain IN ('positive','negative','acid-fast')),
  resistance_mechanisms text[],
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bacteria ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bacteria_read_all" ON bacteria;
CREATE POLICY "bacteria_read_all" ON bacteria FOR SELECT TO authenticated USING (true);

-- Experiments (user-owned)
CREATE TABLE IF NOT EXISTS experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  module text NOT NULL CHECK (module IN ('diagnosis','drug_discovery','antibiotic','imaging')),
  algorithm text NOT NULL,
  title text NOT NULL,
  input_data jsonb NOT NULL,
  result_data jsonb NOT NULL,
  confidence numeric,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','running','completed','failed')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "experiments_select_own" ON experiments;
CREATE POLICY "experiments_select_own" ON experiments FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "experiments_insert_own" ON experiments;
CREATE POLICY "experiments_insert_own" ON experiments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "experiments_update_own" ON experiments;
CREATE POLICY "experiments_update_own" ON experiments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "experiments_delete_own" ON experiments;
CREATE POLICY "experiments_delete_own" ON experiments FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_experiments_user ON experiments(user_id);
CREATE INDEX IF NOT EXISTS idx_experiments_module ON experiments(module);

-- Reports (user-owned)
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  experiment_id uuid REFERENCES experiments(id) ON DELETE CASCADE,
  title text NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('pdf','csv','json')),
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reports_select_own" ON reports;
CREATE POLICY "reports_select_own" ON reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "reports_insert_own" ON reports;
CREATE POLICY "reports_insert_own" ON reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "reports_delete_own" ON reports;
CREATE POLICY "reports_delete_own" ON reports FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user ON reports(user_id);

-- Medical images (user-owned metadata)
CREATE TABLE IF NOT EXISTS medical_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  experiment_id uuid REFERENCES experiments(id) ON DELETE SET NULL,
  filename text NOT NULL,
  modality text NOT NULL CHECK (modality IN ('mri','ct','xray')),
  file_size bigint,
  mime_type text,
  storage_path text,
  prediction jsonb,
  heatmap jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE medical_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "images_select_own" ON medical_images;
CREATE POLICY "images_select_own" ON medical_images FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "images_insert_own" ON medical_images;
CREATE POLICY "images_insert_own" ON medical_images FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "images_update_own" ON medical_images;
CREATE POLICY "images_update_own" ON medical_images FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "images_delete_own" ON medical_images;
CREATE POLICY "images_delete_own" ON medical_images FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Quantum jobs (user-owned)
CREATE TABLE IF NOT EXISTS quantum_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  experiment_id uuid REFERENCES experiments(id) ON DELETE SET NULL,
  backend text NOT NULL DEFAULT 'ibmq_qasm_simulator',
  algorithm text NOT NULL,
  qubits integer NOT NULL,
  shots integer NOT NULL DEFAULT 1024,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','completed','failed','cancelled')),
  result jsonb,
  queue_position integer,
  execution_time_ms integer,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE quantum_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "qjobs_select_own" ON quantum_jobs;
CREATE POLICY "qjobs_select_own" ON quantum_jobs FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "qjobs_insert_own" ON quantum_jobs;
CREATE POLICY "qjobs_insert_own" ON quantum_jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "qjobs_update_own" ON quantum_jobs;
CREATE POLICY "qjobs_update_own" ON quantum_jobs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_qjobs_user ON quantum_jobs(user_id);

-- Notifications (user-owned)
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notif_select_own" ON notifications;
CREATE POLICY "notif_select_own" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "notif_insert_own" ON notifications;
CREATE POLICY "notif_insert_own" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notif_update_own" ON notifications;
CREATE POLICY "notif_update_own" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notif_delete_own" ON notifications;
CREATE POLICY "notif_delete_own" ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);

-- Bookmarks (user-owned)
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  experiment_id uuid REFERENCES experiments(id) ON DELETE CASCADE,
  label text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bm_select_own" ON bookmarks;
CREATE POLICY "bm_select_own" ON bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "bm_insert_own" ON bookmarks;
CREATE POLICY "bm_insert_own" ON bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "bm_delete_own" ON bookmarks;
CREATE POLICY "bm_delete_own" ON bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- History (user activity log)
CREATE TABLE IF NOT EXISTS history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hist_select_own" ON history;
CREATE POLICY "hist_select_own" ON history FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "hist_insert_own" ON history;
CREATE POLICY "hist_insert_own" ON history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
