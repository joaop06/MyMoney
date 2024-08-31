import moment from "moment";
import { StyleSheet } from "react-native";
import { useEffect, useState } from 'react';
import { Colors } from '../../utils/Stylization';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';

/** Components */
import { fetchData } from './Home';
import Div from '../../components/Div';
import List from '../../components/List';
import Text from '../../components/Text';
import Container from '../../components/Container';
import CardRelease from '../../components/CardRelease';

const Spending = () => {
    const [dataSpending, setDataSpending] = useState(null);
    const [totalSpending, setTotalSpending] = useState(0.00);

    const fetchDataSpending = async () => {
        let allDataSpending = await fetchData('SPENDING');
        if (!allDataSpending) allDataSpending = { data: [], total: 0.00 }

        setDataSpending(allDataSpending?.data || [])
        setTotalSpending(allDataSpending?.total || 0.00)
    }

    useEffect(() => {
        fetchDataSpending()
    }, []);
    useEffect(() => {
        const interval = setInterval(fetchDataSpending, 1500)
        return () => clearInterval(interval)
    }, [dataSpending]);

    const renderItem = ({ item }) => {
        const { dataList, date, title, value } = item

        return (
            <CardRelease
                item={{ date: moment(date).format('DD/MM'), title, value }}
                navigateTo={{ name: 'ReleasesGrouped', data: { date, dataList, totalValue: value, type: 'Despesas' } }}
            />
        )
    }

    return (
        <Container style={styles.container}>
            <Text style={styles.total}>
                Despesas Totais: {(totalSpending).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>

            {dataSpending === null || dataSpending.length === 0 ?
                <Div style={styles.phantomDiv}>
                    <Text>Nenhuma Despesa encontrada</Text>
                </Div>
                :
                <List
                    data={dataSpending}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.date}
                />
            }
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        width: ScreenWidth * 0.95,
        backgroundColor: Colors.transparent,
    },
    total: {
        marginTop: ScreenHeight * 0.01,
        marginBottom: ScreenHeight * 0.02,
    },
    phantomDiv: {
        elevation: 2,
        borderRadius: 10,
        width: ScreenWidth * 0.9,
        height: ScreenHeight * 0.55,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: Colors.grey_lighten_2,
    },
})

module.exports = { name: 'Despesas', screen: Spending };
