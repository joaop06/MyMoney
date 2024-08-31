import Users from '../Data/Users';
import MMKV from '../utils/MMKV/MMKV';
import { Colors } from '../utils/Stylization';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Div from './Div';
import Text from './Text';
import List from './List';
import Title from './Title';
import Button from './Button';
import Container from './Container';


const months = [
    { id: 0, label: 'Janeiro' },
    { id: 1, label: 'Fevereiro' },
    { id: 2, label: 'Março' },
    { id: 3, label: 'Abril' },
    { id: 4, label: 'Maio' },
    { id: 5, label: 'Junho' },
    { id: 6, label: 'Julho' },
    { id: 7, label: 'Agosto' },
    { id: 8, label: 'Setembro' },
    { id: 9, label: 'Outubro' },
    { id: 10, label: 'Novembro' },
    { id: 11, label: 'Dezembro' },
];

const Header = ({
    currentMonth,
    balance = 0.00,
    profilePicture,
    firstUserName = '',
    onMonthChange = () => { },
}) => {
    const navigation = useNavigation();
    const flatListRef = useRef(currentMonth);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [totalBalance, setTotalBalance] = useState(balance);


    const handleMonthPress = (index) => {
        if (index < 0) index = 0
        else if (index > 11) index = 11

        onMonthChange(index);
        setSelectedMonth(index);
        flatListRef.current?.scrollToIndex({ index, animated: true });
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            const totalBalance = await Users.updateTotalBalance(await MMKV.find('userId'))
            setTotalBalance(totalBalance)
        }, 1000);

        return () => clearInterval(interval)
    }, [])


    const setInitialMonth = () => flatListRef?.current?.scrollToIndex({ index: selectedMonth, animated: true });
    useEffect(() => {
        try {
            setTimeout(setInitialMonth, 1000)
        } catch (e) {
            console.error(`Erro ao definir Mês padrão: ${e.message}`)
        }
    }, [])

    const renderItem = ({ item, index }) => (
        <Button
            key={item.id}
            onPress={() => handleMonthPress(index)}
            style={styles.buttonMonth(index, selectedMonth)}
        >
            {item.label}
        </Button>
    )

    return (
        <Container style={styles.container}>
            <Div style={styles.firstLine}>
                <Button
                    style={styles.buttonUserSettings}
                    onPress={() => navigation.navigate('UserSettings')}
                >
                    <Image
                        style={styles.profileImage}
                        source={profilePicture ? { uri: profilePicture } : require('../utils/pictures/default-profile-picture.jpg')}
                    />
                </Button>

                <Div style={styles.titleBalanceContainer}>
                    <Title style={styles.title}>Finanças de {firstUserName}</Title>

                    <Text style={styles.balanceText}>
                        Saldo
                        <Title style={styles.balance}> {(totalBalance || 0.00).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </Title>
                    </Text>
                </Div>

                <Div name="phantomDiv"></Div>
            </Div>



            <Div style={styles.secondLine}>
                <Button
                    style={styles.buttonLeftList}
                    onPress={() => handleMonthPress(selectedMonth - 1)}
                >
                    <MaterialCommunityIcons
                        name="menu-left-outline"
                        color={Colors.blue}
                        size={ScreenHeight * 0.025}
                    />
                </Button>

                <List
                    data={months}
                    horizontal={true}
                    ref={flatListRef}
                    scrollEnabled={false}
                    renderItem={renderItem}
                    style={styles.listMonths}
                    getItemLayout={() => (
                        { length: ScreenWidth * 0.15, offset: ScreenWidth * 0.15, index: selectedMonth }
                    )}
                    onScrollToIndexFailed={(info) => {
                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                        wait.then(() => {
                            flatListRef.current?.scrollToIndex({ index: selectedMonth, animated: true });
                        });
                    }}
                />

                <Button
                    onPress={() => handleMonthPress(selectedMonth + 1)}
                    style={styles.buttonRightList}
                >
                    <MaterialCommunityIcons
                        name="menu-right-outline"
                        color={Colors.blue}
                        size={ScreenHeight * 0.025}
                    />
                </Button>
            </Div>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 0,
        width: ScreenWidth,
        maxHeight: ScreenHeight * 0.15,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    firstLine: {
        flexDirection: 'row',
        width: ScreenWidth * 0.9,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    buttonUserSettings: {
        button: {
            minWidth: ScreenWidth * 0.05,
            backgroundColor: Colors.transparent,
        }
    },
    profileImage: {
        width: ScreenHeight * 0.05,
        height: ScreenHeight * 0.05,
        borderRadius: ScreenHeight * 0.025,
    },
    titleBalanceContainer: {
        marginRight: ScreenHeight * 0.05,
    },
    title: {
        fontWeight: 'bold',
        marginTop: ScreenHeight * 0.01,
    },
    balanceText: {
        marginBottom: ScreenHeight * 0.015,
    },
    balance: {
        fontWeight: 'bold',
        fontSize: ScreenWidth * 0.035,
    },
    secondLine: {
        alignItems: 'center',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        maxWidth: ScreenWidth * 0.6,
        maxHeight: ScreenHeight * 0.1,
        backgroundColor: Colors.transparent,
    },
    buttonLeftList: {
        button: {
            width: ScreenWidth * 0.1,
            minWidth: ScreenWidth * 0.05,
            backgroundColor: Colors.transparent,
        }
    },
    buttonRightList: {
        button: {
            width: ScreenWidth * 0.1,
            minWidth: ScreenWidth * 0.05,
            backgroundColor: Colors.transparent,
        }
    },
    listMonths: {
        elevation: 0,
        backgroundColor: Colors.transparent,
    },
    buttonMonth: (index, selectedMonth) => {
        return {
            button: {
                width: ScreenWidth * 0.15,
                backgroundColor: Colors.transparent,
                marginHorizontal: ScreenWidth * 0.2,
                marginLeft: index === 0 ? 0 : ScreenWidth * 0.03,
                marginRigth: index === 12 ? 0 : ScreenWidth * 0.1,
            },
            text: {
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: ScreenWidth * 0.04,
                color: index == selectedMonth ? Colors.blue : Colors.grey,
            }
        }
    },
});

export default Header;