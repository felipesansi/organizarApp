import colors from '@/constants/colors';
import{View,Text, StyleSheet, TextInput, Pressable} from 'react-native';
import { Ionicons} from '@expo/vector-icons'
import { router } from 'expo-router';

export default function cadastrar(){
    return(
        <View style={styles.container}> 
       <Pressable onPress={() => router.back()}>
      <Ionicons 
       name="arrow-back" 
       size={24} 
      color={colors.white} 
       style={{marginLeft: 14, marginTop: 44}} 
  />
</Pressable>

           <View style={styles.header}>
            <Text style = {styles.logo}>App<Text style = {{color:colors.white}}>Organize</Text></Text>
            <Text style = {styles.slogan}>Crie sua conta</Text>
        </View>
        // ----formulário de cadastro ----
        <View style = {styles.form}>
                   
             <Text style={styles.label}>Nome completo:</Text>
             <TextInput placeholder='Digite seu nome completo' style = {styles.input}
             ></TextInput>

             <Text style={styles.label}>email:</Text>
             <TextInput placeholder='Digite seu e-mail' style = {styles.input}
             ></TextInput>


             <Text style ={styles.label}>senha:</Text>
             <TextInput placeholder='Digite sua senha' 
             style = {styles.input}secureTextEntry={true}></TextInput>   
        
           <Pressable style= {styles.button}>
            <Text style={styles.text}>Cadastrar agora</Text>
            </Pressable>
              

            

             </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {    
        flex: 1,
        paddingTop: 44,
        backgroundColor:colors.blue
    },
    
    
    header: {
        paddingRight:14,
        paddingLeft:14,
    },
    logo: {
        fontSize: 24,
        color: colors.green,
        fontWeight: 'bold',
        marginBottom:8,
    },
    slogan: {
        fontSize: 34,
        color: colors.white,
        marginBottom: 3,
    },
    form: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        marginTop: 30,
        paddingTop: 20,
        paddingLeft: 14,    
        paddingRight: 14,
    },
    label: {
        color: colors.blue,
       marginBottom: 4,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: colors.blue,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 20,
        padding : 10,
    },
    button: {
        backgroundColor: colors.green,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    
    text: {
        color: colors.blue,
        fontSize: 18,
        fontWeight: 'bold',
    }, 
   

    });