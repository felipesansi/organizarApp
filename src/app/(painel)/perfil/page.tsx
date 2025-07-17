import{View,Text, StyleSheet} from 'react-native';

export default function Perfil(){
    return(
        <View style={styles.container}> 
            <Text>Perfil Page</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {    
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: 'black',
    }
    });