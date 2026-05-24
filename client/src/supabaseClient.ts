import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isPlaceholder = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('your-project-url') || 
  supabaseAnonKey.includes('your-anon-key-placeholder');

if (isPlaceholder) {
  console.warn(
    'Supabase: Se detectaron credenciales vacías o placeholders. Por favor, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo client/.env'
  );
}

// Inicializar el cliente (usando fallbacks para evitar caídas en tiempo de compilación si no hay credenciales)
export const supabase = createClient(
  isPlaceholder ? 'https://placeholder-project-url.supabase.co' : supabaseUrl,
  isPlaceholder ? 'placeholder-key-value' : supabaseAnonKey
);
