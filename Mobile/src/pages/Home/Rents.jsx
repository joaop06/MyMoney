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

const Rents = () => {
    const [dataRents, setDataRents] = useState([]);
    const [totalRents, setTotalRents] = useState(0.00);

    const fetchDataRents = async () => {
        let allDataRents = await fetchData('RENTS');
        if (!allDataRents) allDataRents = { data: [], total: 0.00 }

        setDataRents(allDataRents.data)
        setTotalRents(allDataRents.total)
    }

    useEffect(() => {
        fetchDataRents()
    }, []);
    useEffect(() => {
        const interval = setInterval(fetchDataRents, 1500);
        return () => clearInterval(interval)
    }, [dataRents]);

    const renderItem = ({ item }) => {
        const { dataList, date, title, value } = item

        return (
            <CardRelease
                item={{ date: moment(date).format('DD/MM'), title, value }}
                navigateTo={{ name: 'ReleasesGrouped', data: { date, dataList, totalValue: value, type: 'Rendas' } }}
            />
        )
    }

    return (
        <Container style={styles.container}>
            <Text style={styles.totalRentsTitle}>
                {'Rendas Totais: '}
                <Text style={styles.totalRentsValue}>
                    {(totalRents).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
            </Text>

            {dataRents === null || dataRents.length === 0 ?
                <Div style={styles.phantomDiv}>
                    <Text>Nenhuma Renda encontrada</Text>
                </Div>
                :
                <List
                    data={dataRents}
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
    totalRentsTitle: {
        marginTop: ScreenHeight * 0.01,
        marginBottom: ScreenHeight * 0.02,
    },
    totalRentsValue: {
        color: Colors.blue_lighten_1,
        fontSize: ScreenWidth * 0.042,
    },
    phantomDiv: {
        borderRadius: 10,
        width: ScreenWidth * 0.9,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        height: ScreenHeight * 0.55,
        backgroundColor: Colors.transparent,
    },
})

module.exports = { name: 'Rendas', screen: Rents };
