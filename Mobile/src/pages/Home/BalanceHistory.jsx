import 'moment/locale/pt';
import moment from 'moment';
import MMKV from '../../utils/MMKV/MMKV';
import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Stylization';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TotalBalanceLogs from '../../Data/TotalBalanceLogs';
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
    const [dataMonths, setDataMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = await MMKV.find('userId');
                const history = await TotalBalanceLogs.historyTotalBalance(userId);

                // console.log('Base de Dados dos meses: ', history)
                setDataMonths(history)
                setSelectedMonth(history.find(item => item.currentMonth))

            } catch (e) {
                console.error(`Erro ao buscar histórico de Saldo Total: `, e);
            }
        };
        fetchData();
    }, []);

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
                    {selectedMonth.currentMonth ? 'Saldo atual é de:' : 'Saldo em '}

                    <Text style={styles.monthSelectedDate}>
                        {selectedMonth.currentMonth ? null : moment(selectedMonth?.lastDate).format('DD/MM/YYYY')}
                    </Text>
                </Text>

                <Title style={styles.balanceSelectedTitle}>
                    {(selectedMonth?.balance || 0.00).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Title>



                <Container style={styles.containerList}>
                    {dataMonths.map((month, index) => (
                        <LinearGradient
                            key={index}
                            colors={[Colors.transparent, month?.month?.number === selectedMonth?.month?.number ? Colors.blue_lighten_3 : Colors.blue_lighten_1]}
                        >
                            <Button
                                style={styles.itemContainer}
                                onPress={() => setSelectedMonth(month)}
                            >
                                <Text style={styles.month}>{month.currentMonth ? 'Hoje' : month?.month?.name}</Text>
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
