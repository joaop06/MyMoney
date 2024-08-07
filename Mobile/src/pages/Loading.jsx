/**
 * ***** Tela de Login e Cadastro *****
 * 
 *  - Autenticação do usuário.
 *  - Opções de login via e-mail/senha, Google ou Facebook.
 * 
*/
import Users from '../Data/Users';
import MMKV from '../utils/MMKV/MMKV';

import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Colors } from '../utils/Stylization';
import { useNavigation } from '@react-navigation/native';

/**
 * Componentes
*/
import Text from '../components/Text';
import Title from '../components/Title';
import Input from '../components/Input';
import Button from '../components/Button';
import Container from '../components/Container';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';



const config = { headerShown: false };
const Loading = () => {
    const navigation = useNavigation()


    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [requestLogin, setRequestLogin] = useState(null)
    const [verifyingSession, setVerifyingSession] = useState(true)
    const [actionButtonName, setActionButtonName] = useState('Acessar')
    const [showCredentialEntry, setShowCredentialEntry] = useState(false)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [nameUser, setNameUser] = useState('')


    const setValue = (value, state, temporary = false, time = 2500) => {
        state(value)
        if (temporary) {
            setTimeout(() => state(null), time)
        }
    }

    const startSession = async () => {
        if (actionButtonName === 'Acessar') {
            if (isLoggedIn) {
                navigation.navigate('Main');

            } else {
                setValue(true, setShowCredentialEntry)
                setValue('Entrar', setActionButtonName)
            }

        } else if (actionButtonName === 'Entrar') {

            /** 
             * Simulação aleatória de erro
             * Aqui ficará a Requisição de Login
             */
            if (!username || !password) {
                return setValue(
                    { error: true, message: 'Preencha os campos corretamente' },
                    setRequestLogin,
                    true
                )
            }

            const { success, user } = await Users.login(username, password)
            setNameUser(user?.name || '')

            if (success) {
                setValue(true, setIsLoggedIn);
                await MMKV.set('userId', user.id);
                await MMKV.set('lastLoggedInUser', username);

            } else {
                setValue(
                    { error: true, message: 'Usuário e/ou Senha incorretos' },
                    setRequestLogin,
                    true
                )
            }
        }
    }



    useEffect(() => { }, [verifyingSession])
    useEffect(() => {
        (async () => {
            const lastLoggedInUser = await MMKV.find('lastLoggedInUser')
            const isLogged = await Users.verifyIsLoggedIn(lastLoggedInUser)

            setValue(isLogged, setIsLoggedIn)
            return isLogged
        })()
    }, [])


    /**
     * Verifica o estado do Login do Usuário
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setValue(false, setVerifyingSession);
            if (isLoggedIn && actionButtonName !== 'Acessar') {
                navigation.navigate('Main');
            }
        }, 500);

        return () => clearTimeout(timer);

    }, [isLoggedIn, navigation])

    return (
        <Container style={{ justifyContent: 'space-between' }}>

            <Title style={{ marginTop: 50 }}>{!isLoggedIn ? 'Olá!' : `Olá, ${nameUser}!`}</Title>
            <Text>{isLoggedIn ? 'Seja Bem-vindo!' : 'Bem-vindo de volta! Faça seu Login'}</Text>

            <Container style={styles.credentialContainer}>
                {showCredentialEntry && (
                    <>
                        <Input
                            label="Usuário"
                            placeholder="Digite seu usuário"
                            onChangeValue={(value) => setValue(value, setUsername)}
                            style={[styles.input.default, requestLogin?.error && styles.input.error]}
                        />
                        <Input
                            label="Senha"
                            secureTextEntry={true}
                            placeholder="Digite sua senha"
                            onChangeValue={(value) => setValue(value, setPassword)}
                            style={[styles.input.default, requestLogin?.error && styles.input.error]}
                        />

                        <Text
                            style={{ color: Colors.red }}
                        >
                            {requestLogin?.message || ''}
                        </Text>

                        <Text style={{ fontSize: 14 }}>Ainda não possui conta? <Text onPress={() => navigation.navigate('SignUp')} style={{ color: Colors.blue, fontSize: 14 }}>Cadastre-se</Text></Text>
                    </>
                )}

            </Container>
            <Button style={{ button: styles.actionButton }} onPress={startSession}>{actionButtonName}</Button >

        </Container>
    );
}

const styles = StyleSheet.create({
    actionButton: {
        marginBottom: 50,
        width: ScreenWidth * 0.8
    },
    credentialContainer: {
        paddingBottom: 100,
        justifyContent: 'center',
    },
    input: {
        default: {
            marginTop: 10,
        },
        error: {
            // borderColor: Colors.red
        },
    },
})

export default { name: 'Loading', screen: Loading, config }
