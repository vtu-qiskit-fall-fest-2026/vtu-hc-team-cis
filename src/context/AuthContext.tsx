import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, type Profile, type Role } from '@/lib/supabase';
import { realtimeTracker } from '@/lib/realtimeTracker';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string, preferredRole?: Role, preferredName?: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role?: Role, institution?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsRole: (role: Role) => void;
  deleteAccount: (email: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ROLE_DEFAULTS: Record<Role, { name: string; institution: string; bio: string; points: number }> = {
  researcher: {
    name: 'Quantum Researcher',
    institution: 'Quantum Bio-Simulation Institute',
    bio: 'Principal Investigator in Quantum Medical Simulation, VQE Drug Discovery & Hybrid ML.',
    points: 1850,
  },
  student: {
    name: 'Quantum Scholar',
    institution: 'National Institute of Quantum Medicine',
    bio: 'Graduate Scholar exploring Grover search, quantum circuits & VQE energy minimization.',
    points: 720,
  },
  clinician: {
    name: 'Chief Clinician / MD',
    institution: 'Memorial Quantum Clinical Hospital',
    bio: 'Clinical Oncologist & Diagnostic Specialist in Quantum-assisted pathology.',
    points: 2140,
  },
  admin: {
    name: 'System Administrator',
    institution: 'Q-MedLab Cloud Infrastructure',
    bio: 'Quantum hardware cluster administrator managing IBM Quantum Runtime & telemetries.',
    points: 4200,
  },
};

export interface RegisteredAccount {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: Role;
  institution?: string;
  createdAt: string;
}

export const getRegisteredAccounts = (): RegisteredAccount[] => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('qmedlab_registered_accounts') : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRegisteredAccount = (account: RegisteredAccount) => {
  try {
    const list = getRegisteredAccounts().filter(
      (u) => u.email.toLowerCase() !== account.email.toLowerCase()
    );
    list.push(account);
    localStorage.setItem('qmedlab_registered_accounts', JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save account:', e);
  }
};

export const deleteRegisteredAccount = (email: string) => {
  try {
    const list = getRegisteredAccounts().filter(
      (u) => u.email.toLowerCase() !== email.toLowerCase()
    );
    localStorage.setItem('qmedlab_registered_accounts', JSON.stringify(list));
  } catch (e) {
    console.error('Failed to delete account:', e);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('qmedlab_auth_session') : null;
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState<Profile | null>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('qmedlab_auth_profile') : null;
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.error('Profile load error:', error.message);
      return;
    }
    setProfile(data as Profile | null);
  };

  // Fast timeout helper to guarantee 0 lag even if remote Supabase has bad DNS
  const withTimeout = <T,>(promise: Promise<T> | PromiseLike<T>, ms = 150): Promise<T> => {
    return Promise.race([
      Promise.resolve(promise),
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Auth request timeout')), ms)),
    ]);
  };

  useEffect(() => {
    let isMounted = true;

    // Safety timeout: stop loading in max 100ms
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 100);

    withTimeout(supabase.auth.getSession(), 120)
      .then(({ data }) => {
        if (!isMounted) return;
        clearTimeout(timeoutId);
        setSession(data.session);
        if (data.session?.user) {
          withTimeout(loadProfile(data.session.user.id), 150).finally(() => {
            if (isMounted) setLoading(false);
          });
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      if (newSession?.user) {
        (async () => {
          await loadProfile(newSession.user.id);
        })();
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      listener.subscription.unsubscribe();
    };
  }, []);



  const createDemoSession = (
    email: string,
    fullName?: string,
    role: Role = 'researcher',
    institution?: string
  ) => {
    const defaultMeta = ROLE_DEFAULTS[role] || ROLE_DEFAULTS.researcher;
    const resolvedName = fullName || defaultMeta.name;
    const resolvedInstitution = institution || defaultMeta.institution;

    const dummyUser = {
      id: `usr-${role}-${Date.now()}`,
      app_metadata: {},
      user_metadata: { full_name: resolvedName, role, institution: resolvedInstitution },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: email || `${role}@qmedlab.io`,
      phone: '',
      role: 'authenticated',
      updated_at: new Date().toISOString(),
    } as unknown as User;

    const dummyProfile: Profile = {
      id: dummyUser.id,
      email: email || `${role}@qmedlab.io`,
      full_name: resolvedName,
      role: role,
      institution: resolvedInstitution,
      avatar_url: null,
      bio: defaultMeta.bio,
      points: defaultMeta.points,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const sessionObj = {
      access_token: `token-${role}-${Date.now()}`,
      refresh_token: `refresh-${role}-${Date.now()}`,
      expires_in: 86400,
      token_type: 'bearer',
      user: dummyUser,
    } as unknown as Session;

    try {
      localStorage.setItem('qmedlab_auth_session', JSON.stringify(sessionObj));
      localStorage.setItem('qmedlab_auth_profile', JSON.stringify(dummyProfile));
    } catch {}

    setSession(sessionObj);
    setProfile(dummyProfile);
    setLoading(false);

    realtimeTracker.recordUserLogin({
      id: dummyUser.id,
      full_name: resolvedName,
      email: dummyUser.email || email,
      role,
      institution: resolvedInstitution,
    });
  };

  const loginAsRole = (role: Role) => {
    const meta = ROLE_DEFAULTS[role];
    createDemoSession(`${role}@qmedlab.io`, meta.name, role);
  };

  const signIn = async (
    email: string,
    password: string,
    preferredRole?: Role,
    preferredName?: string
  ): Promise<{ error: string | null }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { error: 'Please enter your email address.' };
    }
    if (!password) {
      return { error: 'Please enter your password.' };
    }

    // 1. Try Supabase first if online
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email: cleanEmail, password }),
        200
      );
      if (!error && data.session) {
        setSession(data.session);
        if (data.session.user) {
          await loadProfile(data.session.user.id);
        }
        return { error: null };
      }
    } catch {}

    // 2. Check against real registered accounts in local database
    const registered = getRegisteredAccounts().find((u) => u.email.toLowerCase() === cleanEmail);
    if (registered) {
      if (registered.password !== password) {
        return { error: 'Incorrect password. Please check your password and try again.' };
      }

      // Enforce role-based login gate: Account role MUST match the selected portal/tab role!
      if (preferredRole && registered.role !== preferredRole) {
        const userRoleName = registered.role.toUpperCase();
        const targetRoleName = preferredRole.toUpperCase();
        return {
          error: `Access Denied: This account is registered as ${userRoleName}. You cannot log in via the ${targetRoleName} Portal. Please select the ${userRoleName} login tab or use /login/${registered.role}.`,
        };
      }

      // Valid registered credentials!
      createDemoSession(registered.email, registered.fullName, registered.role, registered.institution);
      return { error: null };
    }

    // 3. Fallback for institutional default role accounts
    const roleDefaultEmails: Record<string, Role> = {
      'researcher@qmedlab.io': 'researcher',
      'student@qmedlab.io': 'student',
      'clinician@qmedlab.io': 'clinician',
      'admin@qmedlab.io': 'admin',
    };

    if (cleanEmail in roleDefaultEmails) {
      const defaultRole = roleDefaultEmails[cleanEmail];
      if (password !== 'password123' && password !== 'admin123' && password.length < 6) {
        return { error: 'Incorrect password for institutional account.' };
      }

      // Enforce role-based login gate for default accounts as well
      if (preferredRole && defaultRole !== preferredRole) {
        return {
          error: `Access Denied: ${cleanEmail} is a ${defaultRole.toUpperCase()} account. You cannot log in via the ${preferredRole.toUpperCase()} Portal. Please select the ${defaultRole.toUpperCase()} login tab.`,
        };
      }

      createDemoSession(cleanEmail, preferredName, defaultRole);
      return { error: null };
    }

    return { error: 'No account found with this email address. Please click Create Account below to register.' };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: Role = 'researcher',
    institution?: string
  ): Promise<{ error: string | null }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }

    // Check if account already exists
    const existing = getRegisteredAccounts().find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { error: 'An account with this email address already exists. Please sign in.' };
    }

    // Try Supabase in background if online
    try {
      await withTimeout(
        supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: fullName, role, institution } },
        }),
        200
      );
    } catch {}

    // Save account to persistent registered database
    const newAccount: RegisteredAccount = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      password: password,
      fullName: fullName.trim() || 'Research Member',
      role,
      institution: institution?.trim() || ROLE_DEFAULTS[role].institution,
      createdAt: new Date().toISOString(),
    };
    saveRegisteredAccount(newAccount);

    // CRITICAL: DO NOT automatically log in or set session!
    // The user must go to the login page and enter their credentials manually.
    return { error: null };
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('qmedlab_auth_session');
      localStorage.removeItem('qmedlab_auth_profile');
    } catch {}
    setSession(null);
    setProfile(null);
    try {
      await withTimeout(supabase.auth.signOut(), 150);
    } catch (e) {
      // Ignore errors in demo mode
    }
  };

  const deleteAccount = (email: string) => {
    deleteRegisteredAccount(email);
    if (session?.user?.email?.toLowerCase() === email.toLowerCase()) {
      signOut();
    }
  };

  const refreshProfile = async () => {
    if (session?.user) await loadProfile(session.user.id);
  };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile, loading, signIn, signUp, signOut, refreshProfile, loginAsRole, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
