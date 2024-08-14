/**
 * ***** Tela de Dashboard/Home *****
 * 
 *  - Saldo atual.
 *  - Resumo das finanças do mês.
 *  - Gráficos de entradas e saídas.
 *  - Alertas de gastos altos e de proximidade ao valor recebido no salário do mês.
 */
import Users from '../../Data/Users';
import MMKV from '../../utils/MMKV/MMKV';

import { Colors, Components } from '../../utils/Stylization';
import React, { useCallback, useEffect, useState } from 'react';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';
import { StyleSheet, BackHandler, SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/** Components */
import Text from '../../components/Text';
import Alert from '../../components/Alert';
import Title from '../../components/Title';
import Container from '../../components/Container';


var navigation
const config = {
    title: 'Início',
    headerShown: false,
    tabBarIcon: () => <MaterialCommunityIcons
        name="home"
        size={30}
        color={navigation?.isFocused() ? Components.Icons.focus : Components.Icons.unfocus}
    />
};

const Tab = createMaterialTopTabNavigator();
const { screen: Rents, name: NameRents } = require('./Rents');
const { screen: Spending, name: NameSpending } = require('./Spending');

const Home = (data) => {
    navigation = useNavigation();
    const totalBalance = data.route?.params?.totalBalance;
    const [firstUserName, setFirstUserName] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [balance, setBalance] = useState(totalBalance || 0.00);

    const getName = async () => {
        let firstName = await MMKV.find('firstUserName');
        firstName = firstName.split(' ')
        setFirstUserName(firstName[0])
    }
    getName()

    useEffect(() => {
        const interval = setInterval(async () => {
            if (firstUserName == '') await getName()

            const { rows: [userData] } = await Users.find({ id: await MMKV.find('userId') })
            setBalance(userData.totalBalance)
        }, 500)

        return () => clearInterval(interval)
    }, [])


    const showAlert = () => setIsAlertVisible(true);
    const hideAlert = () => setIsAlertVisible(false);

    const handleConfirm = async () => {
        hideAlert();
        await MMKV.set('lastLoggedInUser', '');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Loading' }]
        });
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                showAlert();
                return true;
            }

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container style={styles.container}>
                {/* Confirmação de Logout */}
                <Alert
                    onCancel={hideAlert}
                    onConfirm={handleConfirm}
                    isVisible={isAlertVisible}
                    content={{ title: 'Deseja Sair?', cancel: 'Cancelar', confirm: 'Sair' }}
                />

                <Title style={styles.title}>Finanças de {firstUserName}</Title>

                <Text style={styles.balanceText}>
                    Saldo
                    <Title style={styles.balance}> {(balance || 0.00).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </Title>
                </Text>

                <Tab.Navigator style={styles.containerTab}>
                    <Tab.Screen name={NameRents} component={Rents} />
                    <Tab.Screen name={NameSpending} component={Spending} />
                </Tab.Navigator>

            </Container>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: ScreenWidth * 0.05,
        justifyContent: 'flex-start',
        backgroundColor: Colors.transparent,
    },
    title: {
        fontWeight: 'bold',
        fontSize: ScreenWidth * 0.06,
        marginTop: ScreenHeight * 0.03,
        marginBottom: ScreenHeight * 0.015,
    },
    balanceText: {
        fontSize: ScreenWidth * 0.045,
    },
    balance: {
        fontWeight: 'bold',
        fontSize: ScreenWidth * 0.05,
        marginTop: ScreenHeight * 0.03,
        marginBottom: ScreenHeight * 0.015,
    },
    containerTab: {
        width: ScreenWidth,
        height: ScreenHeight * 0.5,
        maxHeight: ScreenHeight * 0.7,
        backgroundColor: Colors.transparent,
    },
});

export default { name: 'HomeScreen', screen: Home, config };