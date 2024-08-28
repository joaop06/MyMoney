/**
 * ***** Tela de Dashboard/Home *****
 * 
 *  - Saldo atual.
 *  - Resumo das finanças do mês.
 *  - Gráficos de entradas e saídas.
 *  - Alertas de gastos altos e de proximidade ao valor recebido no salário do mês.
 */
import moment from 'moment';
import Users from '../../Data/Users';
import MMKV from '../../utils/MMKV/MMKV';
import Releases from '../../Data/Releases';

import { Colors, Components } from '../../utils/Stylization';
import React, { useCallback, useEffect, useState } from 'react';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StyleSheet, BackHandler, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Carousel from 'react-native-snap-carousel';

/** Components */
import Text from '../../components/Text';
import Alert from '../../components/Alert';
import Title from '../../components/Title';
import Header from '../../components/Header';
import Container from '../../components/Container';

const mapDaysWeek = {
    "Sunday": "Domingo",
    "Saturday": "Sábado",
    "Friday": "Sexta-feira",
    "Tuesday": "Terça-feira",
    "Monday": "Segunda-feira",
    "Thursday": "Quinta-feira",
    "Wednesday": "Quarta-feira",
};

var navigation
const config = {
    title: 'Resumo',
    headerShown: false,
    tabBarIcon: () => <MaterialCommunityIcons
        name="home-outline"
        color={navigation?.isFocused() ? Colors.blue : Colors.grey}
        size={navigation?.isFocused() ? ScreenHeight * 0.04 : ScreenHeight * 0.035}
    />
};

const Tab = createMaterialTopTabNavigator();
const { screen: Rents, name: NameRents } = require('./Rents');
const { screen: Spending, name: NameSpending } = require('./Spending');


let selectedMonth = moment().month();
export const fetchData = async (
    typeRelease,
    setDataReleases = () => { },
    setTotalRelease = () => { }
) => {
    if (
        process.env.FETCH_DATA_IN_PROGRESS != true &&
        process.env.LAST_FETCH_DATA !== typeRelease
    ) {
        try {
            process.env.FETCH_DATA_IN_PROGRESS = true

            let { rows } = await Releases.find({
                type: typeRelease,
                userId: await MMKV.find('userId'),
            })
            // Filtra os lançamentos do mês selecionado
            rows = rows.filter(release => moment(release.dateRelease).month() === selectedMonth)


            let totalRentsValue = 0.00
            const releasesGrouped = rows.reduce((acc, curr) => {

                const dateRelease = moment.parseZone(curr.dateRelease ?? curr.createdAt);

                const date = dateRelease.format('DD/MM')
                const title = mapDaysWeek[dateRelease.format('dddd')]

                const existDate = acc.findIndex(item => item.date === date)
                if (existDate > -1) {
                    acc[existDate].dataList.push(curr)
                    acc[existDate].value += curr.value

                } else {
                    acc.push({
                        date,
                        title,
                        dataList: [curr],
                        value: curr.value,
                    })
                }

                totalRentsValue += curr.value
                return acc
            }, [])

            setDataReleases(releasesGrouped)
            setTotalRelease(totalRentsValue)
            process.env.LAST_FETCH_DATA = typeRelease

        } catch (e) {
            console.error(e)

        } finally {
            process.env.FETCH_DATA_IN_PROGRESS = false
        }
    }
}


const Home = (data) => {
    navigation = useNavigation();
    const totalBalance = data.route?.params?.totalBalance;
    const [firstUserName, setFirstUserName] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [balance, setBalance] = useState(totalBalance || 0.00);

    const onMonthChange = (month) => {
        selectedMonth = month
    }

    const getName = async () => {
        let firstName = await MMKV.find('firstUserName');
        firstName = firstName.split(' ')
        setFirstUserName(firstName[0])
    }
    useEffect(() => {
        if (firstUserName == '') getName()

        const getTotalBalance = async () => {
            const { rows: [userData] } = await Users.find({ id: await MMKV.find('userId') })
            setBalance(userData.totalBalance)
        }
        if (!totalBalance || totalBalance == 0) getTotalBalance()

        return () => { }
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

                <Header
                    balance={balance}
                    currentMonth={selectedMonth}
                    firstUserName={firstUserName}
                    onMonthChange={onMonthChange}
                />

                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: Colors.blue, // Cor do texto da aba ativa
                        tabBarPressColor: Colors.blue_lighten_2, // Cor de fundo ao pressionar a aba
                        tabBarInactiveTintColor: Colors.grey_darken, // Cor do texto da aba inativa
                        tabBarLabelStyle: { fontSize: ScreenWidth * 0.03 }, // Tamanho da fonte do texto das abas
                        tabBarStyle: { backgroundColor: Colors.grey_lighten_2 }, // Cor de fundo da barra de abas
                        tabBarIndicatorStyle: {
                            height: 3, // Altura do indicador
                            backgroundColor: Colors.blue, // Cor do indicador abaixo da aba ativa
                        },
                    }}
                    style={styles.containerTab}>
                    <Tab.Screen
                        name={NameRents}
                        component={Rents}
                        options={{
                            tabBarLabel: NameRents,
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="currency-usd" color={color} size={ScreenHeight * 0.025} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name={NameSpending}
                        component={Spending}
                        options={{
                            tabBarLabel: NameSpending,
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="currency-usd-off" color={color} size={ScreenHeight * 0.025} />
                            ),
                        }}
                    />
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
    containerTab: {
        width: ScreenWidth * 0.95,
        height: ScreenHeight * 0.5,
        maxHeight: ScreenHeight * 0.7,
        backgroundColor: Colors.transparent,
    },
});

export default { name: 'Home', screen: Home, config };