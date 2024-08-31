/**
 * ***** Tela de Login e Cadastro *****
 * 
 *  - Autenticação do usuário.
 *  - Opções de login via e-mail/senha, Google ou Facebook.
 * 
*/
import Users from '../Data/Users';
import Categories from '../Data/Categories';
import MMKV from '../utils/MMKV/MMKV';
import { useState, useEffect } from 'react';
import { Colors } from '../utils/Stylization';
import { StyleSheet, ScrollView } from 'react-native';
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

            try {
                const { success, user } = await Users.login(username, password)

                setNameUser(user?.name)

                if (success) {
                    setTimeout(async () => {
                        setValue(true, setIsLoggedIn);
                        await MMKV.set('userId', user.id);
                        await MMKV.set('firstUserName', user.name);
                        await MMKV.set('lastLoggedInUser', username);
                    }, 250)

                } else {
                    setValue(
                        { error: true, message: 'Usuário e/ou Senha incorretos' },
                        setRequestLogin,
                        true
                    )
                }
            } catch (e) {
                console.error(e)
                setValue(
                    { error: true, message: e.message },
                    setRequestLogin,
                    true
                )
            }
        }
    }

    const verifyIsLoggedIn = async () => {
        const lastLoggedInUser = await MMKV.find('lastLoggedInUser')
        const { firstNameUser, tokenIsExpired: isLogged } = await Users.verifyIsLoggedIn(lastLoggedInUser)

        setValue(isLogged, setIsLoggedIn)
        setValue(firstNameUser, setNameUser)
    }

    useEffect(() => {
        verifyIsLoggedIn()
        return
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Container style={styles.container}>

                <Title style={styles.title}>
                    {isLoggedIn && nameUser !== '' ? `Olá, ${nameUser}!` : 'Olá!'}
                </Title>

                <Text>
                    {isLoggedIn && nameUser !== '' ? 'Bem-vindo de volta! Faça seu Login' : 'Seja Bem-vindo!'}
                </Text>

                <Container style={styles.credentialContainer}>
                    {showCredentialEntry && (
                        <>
                            <Input
                                label="Usuário"
                                autoCapitalize={'none'}
                                placeholder="Digite seu usuário"
                                onChangeValue={(value) => setValue(value, setUsername)}
                                style={[styles.input.default, requestLogin?.error && styles.input.error]}
                            />
                            <Input
                                label="Senha"
                                secureTextEntry={true}
                                autoCapitalize={'none'}
                                placeholder="Digite sua senha"
                                onChangeValue={(value) => setValue(value, setPassword)}
                                style={[styles.input.default, requestLogin?.error && styles.input.error]}
                            />

                            <Text style={styles.messageRequest}>{requestLogin?.message || ''}</Text>

                            <Text style={styles.footerText}>
                                Ainda não possui conta?
                                <Text onPress={() => navigation.navigate('SignUp')} style={styles.footerRegisterText}> Cadastre-se</Text>
                            </Text>
                        </>
                    )}

                </Container>
                <Button style={{ button: styles.actionButton }} onPress={startSession}>{actionButtonName}</Button >

            </Container>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: ScreenWidth * 0.05,
        justifyContent: 'space-between'
    },
    title: {
        marginTop: ScreenHeight * 0.1,
    },
    actionButton: {
        marginBottom: ScreenHeight * 0.1,
    },
    credentialContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: ScreenHeight * 0.1,
    },
    input: {
        default: {
            marginTop: ScreenHeight * 0.02,
        },
        error: {
            borderColor: Colors.red
        },
    },
    messageRequest: {
        color: Colors.red,
        margin: ScreenHeight * 0.02,
        fontSize: ScreenWidth * 0.03,
        backgroundColor: Colors.transparent,
    },
    footerText: {
        color: Colors.grey,
        fontSize: ScreenWidth * 0.03,
    },
    footerRegisterText: {
        color: Colors.blue,
        fontSize: ScreenWidth * 0.03,
    },
})

export default { name: 'Loading', screen: Loading, config }
