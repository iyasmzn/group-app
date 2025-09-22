/* eslint-disable */

export interface SupabaseIdentity {
  id: string;
  user_id: string;
  identity_data: Record<string, any>;
  provider: string;
  created_at: string;
  last_sign_in_at: string;
  updated_at: string;
}

export interface SupabaseAppMetadata {
  provider?: string;
  providers?: string[];
  [key: string]: any;
}

export interface SupabaseUserMetadata {
  full_name?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface SupabaseUser {
  id: string;
  aud: string;
  role: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata: SupabaseAppMetadata;
  user_metadata: SupabaseUserMetadata;
  identities?: SupabaseIdentity[];
  created_at: string;
  updated_at: string;
}
