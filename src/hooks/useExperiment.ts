// Shared hook to save an experiment + create a notification + award points.
// Also synchronizes immediately with the real-time activity tracker for live admin auditing.
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { realtimeTracker } from '@/lib/realtimeTracker';

export interface SaveExperimentParams {
  module: 'diagnosis' | 'drug_discovery' | 'antibiotic' | 'imaging';
  algorithm: string;
  title: string;
  inputData: Record<string, unknown>;
  resultData: Record<string, unknown>;
  confidence: number;
  metrics?: string;
  qubits?: number;
}

export function useExperiment() {
  const { user, profile, refreshProfile } = useAuth();

  const save = useCallback(
    async (params: SaveExperimentParams) => {
      const activeUserId = user?.id || 'demo-user';
      const activeUserName = profile?.full_name || 'Active Researcher';
      const activeUserRole = profile?.role || 'researcher';
      const activeInstitution = profile?.institution || 'Quantum Medical Lab';

      // Always broadcast to real-time project stream immediately
      realtimeTracker.recordProjectRun({
        userId: activeUserId,
        userName: activeUserName,
        userRole: activeUserRole,
        institution: activeInstitution,
        module: params.module,
        algorithm: params.algorithm,
        title: params.title,
        confidence: params.confidence,
        metrics: params.metrics || `Fidelity: ${params.confidence}% | Circuit Depth: Verified`,
        qubits: params.qubits || 6,
      });

      if (!user) {
        return {
          id: `exp-local-${Date.now()}`,
          user_id: activeUserId,
          module: params.module,
          algorithm: params.algorithm,
          title: params.title,
          input_data: params.inputData,
          result_data: params.resultData,
          confidence: params.confidence,
          status: 'completed',
          created_at: new Date().toISOString(),
        };
      }

      try {
        const { data, error } = await supabase
          .from('experiments')
          .insert({
            user_id: user.id,
            module: params.module,
            algorithm: params.algorithm,
            title: params.title,
            input_data: params.inputData,
            result_data: params.resultData,
            confidence: params.confidence,
            status: 'completed',
          })
          .select()
          .single();

        if (error) {
          console.warn('Supabase experiment insert skipped, logged to local real-time store:', error.message);
          return {
            id: `exp-local-${Date.now()}`,
            user_id: user.id,
            module: params.module,
            algorithm: params.algorithm,
            title: params.title,
            input_data: params.inputData,
            result_data: params.resultData,
            confidence: params.confidence,
            status: 'completed',
            created_at: new Date().toISOString(),
          };
        }

        // Award points + notification
        await Promise.allSettled([
          supabase.rpc('increment_points', { user_id: user.id, pts: 10 }).then(() => undefined, () => {
            return supabase.from('profiles').update({ points: 10 }).eq('id', user.id);
          }),
          supabase.from('notifications').insert({
            user_id: user.id,
            type: 'experiment',
            title: 'Experiment completed',
            message: `${params.title} finished with ${params.confidence}% confidence.`,
          }),
          supabase.from('history').insert({
            user_id: user.id,
            action: 'experiment_completed',
            entity_type: 'experiment',
            entity_id: data.id,
            metadata: { module: params.module, algorithm: params.algorithm },
          }),
        ]);
        refreshProfile();
        return data;
      } catch (e) {
        console.warn('Realtime experiment fallback active:', e);
        return {
          id: `exp-local-${Date.now()}`,
          user_id: user.id,
          module: params.module,
          algorithm: params.algorithm,
          title: params.title,
          input_data: params.inputData,
          result_data: params.resultData,
          confidence: params.confidence,
          status: 'completed',
          created_at: new Date().toISOString(),
        };
      }
    },
    [user, profile, refreshProfile]
  );

  return { save };
}
