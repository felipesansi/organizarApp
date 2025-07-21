import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabase';
import colors from '@/constants/colors';
import { useAuth } from '../contexts/AuthContext';

export default function IndexScreen() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const verificarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        router.replace('/(painel)/perfil/page');
      } else {
        setUser(null);
        router.replace('/(auth)/login/page');
      }
    };

    verificarSessao();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
