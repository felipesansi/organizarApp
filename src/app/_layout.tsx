import {Stack} from 'expo-router';
export default function MainLayout(){
  return(
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="(painel)/perfil/page" options={{headerShown: false}} />
     <Stack.Screen name="(auth)/cadastro/page" options={{headerShown: false}} />
 
    </Stack>
  )
}