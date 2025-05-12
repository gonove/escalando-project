import React, { createContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, specialty?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
