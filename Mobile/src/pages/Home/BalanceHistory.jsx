import moment from 'moment';
import 'moment/locale/pt';
moment.locale('pt');


import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Stylization';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Div from '../../components/Div';
import List from '../../components/List';
import Text from '../../components/Text';
import Title from '../../components/Title';
import Button from '../../components/Button';
import Container from '../../components/Container';


const config = { headerShown: false };

const BalanceHistory = () => {
    const data = [
        { id: 0, month: 'Mai', balance: 0.01 },
        { id: 1, month: 'Jun', balance: 105.00 },
        { id: 2, month: 'Jul', balance: 241.09 },
        { id: 3, month: 'Ago', balance: 1818.72, current: true }, // Mês atual
        { id: 5, month: 'Set', balance: 1820.15 },
        { id: 6, month: 'Out', balance: 1833.20 },
        { id: 4, month: 'Nov', balance: 1844.07 },
    ];
    const [selectedMonth, setSelectedMonth] = useState(data.find(item => item.current))


    return (
        <Container style={styles.container}>
            <Div>
                <Div style={styles.containerButtonClose}>
                    <Button
                        style={styles.buttonClose}
                        navigateTo={{ name: 'Home' }}
                    >
                        <MaterialCommunityIcons
                            name="close"
                            color={Colors.white}
                            size={ScreenHeight * 0.025}
                        />
                    </Button>
                </Div>

                <Text style={styles.monthSelectedTitle}>
                    {selectedMonth.current ? 'Saldo atual:' : 'Saldo em '}
                    <Text style={{ color: Colors.white }}>{moment(selectedMonth.month, 'MMM').endOf('month').format('DD/MM/YYYY')}</Text>
                </Text>

                <Title style={styles.balanceSelectedTitle}>
                    {selectedMonth.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Title>



                <Container style={styles.containerList}>
                    {/* <List
                    horizontal
                    data={data}
                    pagingEnabled
                    style={styles.list}
                    decelerationRate="fast"
                    snapToAlignment="center"
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Div style={styles.itemContainer}>
                            <Text style={styles.month}>{item.month}</Text>
                            <Text style={styles.balance}>{`R$ ${item.balance.toFixed(2)}`}</Text>
                        </Div>
                    )}
                /> */}

                    {data.map((month, index) => (
                        <Button
                            style={styles.itemContainer}
                            onPress={() => setSelectedMonth(month)}
                        >
                            <Text style={styles.month}>{month.month}</Text>
                            {/* <Text style={styles.balance}>{`R$ ${month.balance.toFixed(2)}`}</Text> */}
                        </Button>
                    ))}
                </Container>
            </Div>


            <Div style={{ height: ScreenHeight * 0.5 }}>
                <Text style={{ justifyContent: 'center' }}>Gráfico em breve</Text>
            </Div>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        alignItems: 'center',
        backgroundColor: Colors.blue,
        justifyContent: 'flex-start',
        maxHeight: ScreenHeight * 0.5,
    },
    containerButtonClose: {
        width: ScreenWidth,
        alignItems: 'flex-start',
        backgroundColor: Colors.transparent,
    },
    buttonClose: {
        button: {
            minWidth: ScreenWidth * 0.1,
            minHeight: ScreenHeight * 0.05,
            backgroundColor: Colors.transparent,
        }
    },
    monthSelectedTitle: {
        fontWeight: '400',
        color: Colors.white,
    },
    balanceSelectedTitle: {
        color: Colors.white,
    },
    containerList: {
        // maxWidth: ScreenWidth * 0.9,
        flexDirection: 'row',
        backgroundColor: Colors.transparent,

    },
    itemContainer: {
        button: {
            minWidth: ScreenWidth * 0.15,
            width: ScreenWidth * 0.1,
            maxWidth: ScreenWidth * 0.1,
            height: ScreenHeight * 0.3,
            maxHeight: ScreenHeight * 0.3,
            borderRadius: 1,
            backgroundColor: Colors.blue_lighten_1,
            padding: ScreenHeight * 0.01,
            borderColor: Colors.white,
            // marginHorizontal: ScreenHeight * 0.008,
            alignItems: 'center',
            borderRightWidth: 1,
            borderBottomWidth: 1,
        }
    },
    month: {
        color: Colors.white,
        fontSize: ScreenWidth * 0.032,
    },
    balance: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.white,
    },
});













export default { name: 'BalanceHistory', screen: BalanceHistory, config };
