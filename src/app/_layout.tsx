import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useRouter } from 'expo-router'; // ← Correto aqui

export default function RouterLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

function MainLayout() {
  const { setUser } = useAuth();
  const router = useRouter(); 

  useEffect(() => {
  
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        router.replace('/(painel)/perfil/page');
      } else {
        setUser(null);
        router.replace('/(auth)/login/page');
      }
    });

    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(painel)/perfil/page" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/cadastro/page" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login/page" options={{ headerShown: false }} />
    </Stack>
  );
}
