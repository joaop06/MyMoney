import 'moment/locale/pt';
import moment from 'moment';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Stylization';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


moment.locale('pt');
import Div from '../../components/Div';
import Text from '../../components/Text';
import Title from '../../components/Title';
import Button from '../../components/Button';
import Container from '../../components/Container';


const config = { headerShown: false };

const BalanceHistory = () => {
    const navigation = useNavigation();

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
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons
                            name="close"
                            color={Colors.white}
                            size={ScreenHeight * 0.035}
                        />
                    </Button>
                </Div>

                <Text style={styles.monthSelectedTitle}>
                    {selectedMonth.current ? 'Saldo atual é de:' : 'Saldo em '}

                    <Text style={styles.monthSelectedDate}>
                        {selectedMonth.current ? null : moment(selectedMonth.month, 'MMM').endOf('month').format('DD/MM/YYYY')}
                    </Text>
                </Text>

                <Title style={styles.balanceSelectedTitle}>
                    {selectedMonth.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Title>



                <Container style={styles.containerList}>
                    {data.map((month, index) => (
                        <LinearGradient
                            key={index}
                            colors={[Colors.transparent, month.month === selectedMonth.month ? Colors.blue_lighten_3 : Colors.blue_lighten_1]}
                        >
                            <Button
                                style={styles.itemContainer}
                                onPress={() => setSelectedMonth(month)}
                            >
                                <Text style={styles.month}>{month.current ? 'Hoje' : month.month}</Text>
                            </Button>
                        </LinearGradient>
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
            marginTop: ScreenHeight * 0.02,
            marginLeft: ScreenWidth * 0.02,
            minHeight: ScreenHeight * 0.05,
            backgroundColor: Colors.transparent,
        }
    },
    monthSelectedTitle: {
        fontWeight: '400',
        color: Colors.white,
    },
    monthSelectedDate: {
        color: Colors.white,
    },
    balanceSelectedTitle: {
        color: Colors.white,
    },
    containerList: {
        flexDirection: 'row',
        backgroundColor: Colors.transparent,
    },
    itemContainer: {
        button: {
            borderRadius: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            alignItems: 'center',
            borderBottomWidth: 2,
            width: ScreenWidth * 0.1,
            height: ScreenHeight * 0.3,
            maxWidth: ScreenWidth * 0.1,
            minWidth: ScreenWidth * 0.15,
            padding: ScreenHeight * 0.01,
            maxHeight: ScreenHeight * 0.3,
            borderColor: Colors.grey_lighten_2,
            backgroundColor: Colors.transparent,
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
