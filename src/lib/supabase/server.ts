/**
 * Supabase Server Clients — Patas do Bem
 * Compatível com Next.js App Router (Server Components, Server Actions e Route Handlers).
 */

import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "@/types/database";
import { getSupabaseConfig } from "./client";

/**
 * Cria o cliente Supabase autenticado no contexto da requisição atual.
 * Lê e atualiza cookies de sessão de forma segura.
 * Retorna null se as credenciais públicas não estiverem configuradas.
 */
export async function createServerSupabaseClient() {
  const config = getSupabaseConfig();

  if (!config.isConfigured || !config.supabaseUrl || !config.supabaseAnonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    config.supabaseUrl,
    config.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Em Server Components de leitura pura, `cookieStore.set` lança exceção esperada.
            // O refresh de cookies de sessão é tratado no middleware.
          }
        },
      },
    }
  );
}

/**
 * Cria o cliente administrativo (Service Role).
 * USO EXCLUSIVO EM ROTAS DE SERVIDOR (Webhooks de pagamento / Jobs).
 * NUNCA importar ou executar este cliente em componentes de cliente!
 */
export function createAdminSupabaseClient() {
  const config = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!config.supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(config.supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
