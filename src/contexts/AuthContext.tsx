import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  username: string | null;
  signIn: (username: string, password: string) => Promise<{ error: any | null }>;
  signUp: (username: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUsername(session?.user?.user_metadata?.username ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUsername(session?.user?.user_metadata?.username ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with username and password
  const signIn = async (username: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: `${username}@slimelist.local`,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Sign up with username and password
  const signUp = async (username: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: `${username}@slimelist.local`,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      // If successful, also create a user profile
      if (!error) {
        // Note: This will be handled by a Supabase trigger in production
        // For now, we'll just return the signup result
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    username,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}