import { StyleSheet } from "react-native";
import { useEffect, useState } from 'react';
import { Colors } from '../../utils/Stylization';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';

/** Components */
import Div from '../../components/Div';
import List from '../../components/List';
import { fetchData } from './Home';
import Text from '../../components/Text';
import Container from '../../components/Container';
import CardRelease from '../../components/CardRelease';

const Rents = () => {
    const [dataRents, setDataRents] = useState([]);
    const [totalRents, setTotalRents] = useState(0.00);

    const fetchDataRents = async () => {
        const { data, total } = await fetchData('RENTS');
        setDataRents(data)
        setTotalRents(total)
    }

    useEffect(() => {
        fetchDataRents()
    }, []);
    useEffect(() => {
        const interval = setInterval(fetchDataRents, 3000);
        return () => clearInterval(interval)
    }, [dataRents]);

    const renderItem = ({ item }) => {
        const { dataList, date, title, value } = item

        return (
            <CardRelease
                item={{ prefix: date, title, value }}
                navigateTo={{ name: 'ReleasesGrouped', data: { date, dataList, totalValue: value, type: 'Rendas' } }}
            />
        )
    }

    return (
        <Container style={styles.container}>
            <Text style={styles.total}>
                Rendas Totais: {(totalRents).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>

            {dataRents === null || dataRents.length === 0 ?
                <Div style={styles.phantomDiv}>
                    <Text>Nenhuma Renda encontrada</Text>
                </Div>
                :
                <List
                    data={dataRents}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
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

module.exports = { name: 'Rendas', screen: Rents };
