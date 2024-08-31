import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Container from '../components/Container';

import { useState } from 'react';
import Users from '../Data/Users';
import { Colors } from "../utils/Stylization";
import { ScreenHeight } from '../utils/Dimensions';
import { StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const config = { headerShown: false };

const SignUp = () => {
    const navigation = useNavigation();
    const [requestSignUp, setRequestSignUp] = useState(null);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const setValue = (value, state, temporary = false, time = 3500) => {
        if (typeof value === 'string') value = value.trim()

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
            const fields = `name, username, password`
            const values = `'${name}', '${username}', '${password}'`
            await Users.create(username, { fields, values })

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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

            <Container style={styles.credentialContainer}>

                <Container style={styles.inputsContainer}>
                    <Input
                        label="Nome"
                        placeholder="Primeiro Nome"
                        onChangeValue={(value) => setValue(value, setName)}
                        style={[styles.input.default, requestSignUp?.error && styles.input.error]}
                    />
                    <Input
                        label="Usuário"
                        autoCapitalize="none"
                        placeholder="Informe seu usuário"
                        onChangeValue={(value) => setValue(value, setUsername)}
                        style={[styles.input.default, requestSignUp?.error && styles.input.error]}
                    />
                    <Input
                        label="Senha"
                        secureTextEntry={true}
                        onChangeValue={(value) => setValue(value, setPassword)}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    credentialContainer: {
        paddingBottom: ScreenHeight * 0.15,
        justifyContent: 'space-between',
    },
    inputsContainer: {
        margin: 'auto',
        maxHeight: ScreenHeight * 0.35,
        justifyContent: 'space-around',
        marginBottom: ScreenHeight * 0.1,
    },
    input: {
        default: {
            marginBottom: ScreenHeight * 0.04,
            backgroundColor: Colors.transparent,
        },
    },
    registerButton: {
        marginBottom: ScreenHeight * 0.15,
    },
})

export default { name: 'SignUp', screen: SignUp, config };