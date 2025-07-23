import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function RouterLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(painel)/perfil/page" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/cadastro/page" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login/page" options={{ headerShown: false }} />
    </Stack>
  );
}
