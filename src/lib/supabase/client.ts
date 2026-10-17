/**
 * Supabase Browser Client — Patas do Bem
 * Utiliza @supabase/ssr com tipagem Database estrita para Client Components.
 */

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

export interface SupabaseConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    supabaseUrl,
    supabaseAnonKey,
    isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  };
}

/**
 * Cria uma instância tipada do cliente Supabase para navegadores.
 * Retorna null com segurança quando as variáveis de ambiente não estiverem configuradas.
 */
export function createBrowserSupabaseClient() {
  const config = getSupabaseConfig();

  if (!config.isConfigured || !config.supabaseUrl || !config.supabaseAnonKey) {
    return null;
  }

  return createBrowserClient<Database>(
    config.supabaseUrl,
    config.supabaseAnonKey
  );
}
