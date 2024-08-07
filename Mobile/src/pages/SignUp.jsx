import Text from '../components/Text';
import Title from '../components/Title';
import Input from '../components/Input';
import Button from '../components/Button';
import Container from '../components/Container';

import { useState } from 'react';
import Users from '../Data/Users';
import { StyleSheet } from 'react-native';
import { Colors } from "../utils/Stylization";
import { ScreenWidth } from '../utils/Dimensions';
import { useNavigation } from '@react-navigation/native';


const config = {
    title: 'Cadastro',
    headerTitleStyle: { color: Colors.blue },
    headerStyle: { backgroundColor: Colors.grey_lighten }
};


const SignUp = () => {
    const navigation = useNavigation();
    const [requestSignUp, setRequestSignUp] = useState(null);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const setValue = (value, state, temporary = false, time = 3500) => {
        state(value)
        if (temporary) {
            setTimeout(() => state(null), time)
        }
    }

    const registerUser = async () => {
        if (!name || !username || !password) {
            return setValue(
                { error: true, message: 'Preencha os campos corretamente' },
                setRequestSignUp,
                true
            )
        }

        try {
            await Users.create({ name, username, password })
            navigation.navigate('Loading')

        } catch (e) {
            console.error(e)
            return setValue(
                { error: true, message: e.message },
                setRequestSignUp,
                true
            )
        }
    }


    return (
        <Container style={styles.credentialContainer}>

            <Container style={styles.inputsContainer}>
                <Input
                    label="Nome"
                    placeholder="Primeiro Nome"
                    onChangeValue={setName}
                    style={[styles.input.default, requestSignUp?.error && styles.input.error]}
                />
                <Input
                    label="Usuário"
                    onChangeValue={setUsername}
                    placeholder="Informe seu usuário"
                    style={[styles.input.default, requestSignUp?.error && styles.input.error]}
                />
                <Input
                    label="Senha"
                    secureTextEntry={true}
                    onChangeValue={setPassword}
                    placeholder="Digite sua senha"
                    style={[styles.input.default, requestSignUp?.error && styles.input.error]}
                />

                <Text
                    style={{ marginTop: 25, color: Colors.red }}
                >
                    {requestSignUp?.message || ''}
                </Text>
            </Container>

            <Button style={{ button: styles.registerButton }} onPress={registerUser}>Cadastrar</Button >

        </Container>
    );
}

const styles = StyleSheet.create({
    credentialContainer: {
        paddingBottom: 100,
        justifyContent: 'space-between',
    },
    inputsContainer: {

    },
    input: {
        default: {
            marginTop: 10,
        },
    },
    registerButton: {
        width: ScreenWidth * 0.8
    },
})

export default { name: 'SignUp', screen: SignUp, config };