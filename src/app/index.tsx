import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabase';
import colors from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';

export default function IndexScreen() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const delayAndVerify = async () => {
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        router.replace('/(painel)/perfil/page');
      } else {
        setUser(null);
        router.replace('/(auth)/login/page');
      }
    };

    delayAndVerify();
  }, []);

  return (
    <View style={styles.container}>
   <Text style = {styles.logo}>App<Text style = {{color:colors.white}}>Organize</Text></Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 24,
    color: colors.green,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
