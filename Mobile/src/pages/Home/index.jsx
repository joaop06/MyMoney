/**
 * ***** Tela de Dashboard/Home *****
 * 
 *  - Saldo atual.
 *  - Resumo das finanças do mês.
 *  - Gráficos de entradas e saídas.
 *  - Alertas de gastos altos e de proximidade ao valor recebido no salário do mês.
 */
import MMKV from '../../utils/MMKV/MMKV';
import { Components } from '../../utils/Stylization';
import { StyleSheet, BackHandler } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/** Components */
import Alert from '../../components/Alert';
import Title from '../../components/Title';
import Container from '../../components/Container';


var navigation
const config = {
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
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const totalBalance = data.route?.params?.totalBalance;
    const [balance, setBalance] = useState(totalBalance || 0.00);

    useEffect(() => {
        const interval = setInterval(async () => {
            setBalance(await MMKV.find('totalBalance'))
        }, 3000)

        return () => clearInterval(interval)
    }, [])


    const showAlert = () => setIsAlertVisible(true);
    const hideAlert = () => setIsAlertVisible(false);

    const handleConfirm = async () => {
        hideAlert();
        await MMKV.set('isLoggedIn', false);
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
        <Container>
            {/* Confirmação de Logout */}
            <Alert isVisible={isAlertVisible} onCancel={hideAlert} onConfirm={handleConfirm} />


            <Title style={styles.balance}>Saldo  {(balance || 0.00).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </Title >

            <Tab.Navigator style={styles.containerTab} onStateChange={state => handleTabChange(state)}>
                <Tab.Screen name={NameSpending} component={Spending} />
                <Tab.Screen name={NameRents} component={Rents} />
            </Tab.Navigator>

        </Container >
    );
}

const styles = StyleSheet.create({
    balance: {
        fontSize: 24,
        marginTop: 25,
        marginBottom: 25,
        fontWeight: 'bold',
    },
    containerTab: {
        height: ScreenHeight,
        width: ScreenWidth
    },
});

export default { name: 'Início', screen: Home, config };