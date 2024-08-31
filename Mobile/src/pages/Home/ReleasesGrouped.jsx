import moment from 'moment';
require('moment/locale/pt-br');
moment.locale('pt-br');

import List from '../../components/List';
import Text from '../../components/Text';
import { StyleSheet } from "react-native";
import { useEffect, useState } from 'react';
import Categories from '../../Data/Categories';
import { Colors } from '../../utils/Stylization';
import Container from '../../components/Container';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';
import CardReleaseGrouped from '../../components/CardReleaseGrouped';


const config = { headerShown: false };

const ReleasesGrouped = ({ route: { params } }) => {
    const [categoriesLabel, setCategoriesLabel] = useState([])

    /**
     * Busca os nomes das categorias
     */
    const fetchCategoriesLabel = async () => {
        try {
            const { rows } = await Categories.find()
            const categories = rows.map(item => {
                return { id: item.id, label: item.label }
            })
            setCategoriesLabel(categories)

        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        fetchCategoriesLabel()
    }, [])


    let { date, dataList, totalValue, type } = params
    totalValue = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const renderItem = ({ item }) => (
        <CardReleaseGrouped item={{ ...item, subtitle: item.label }} navigateTo={{ name: 'EditRelease', data: item }} />
    )

    return (
        <Container style={styles.container}>
            <Container style={styles.containerTitle}>
                <Text style={styles.title}>{totalValue}</Text>
                <Text style={styles.subtitle}>{type} {moment(date).format('D [de] MMMM [de] YYYY')}</Text>
            </Container>

            <List
                data={dataList}
                style={styles.list}
                renderItem={renderItem}
            />
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
    },
    containerTitle: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: ScreenWidth * 0.5,
        maxHeight: ScreenHeight * 0.1,
        marginTop: ScreenHeight * 0.05,
        backgroundColor: Colors.transparent,
    },
    title: {
        color: Colors.blue,
        fontSize: ScreenWidth * 0.04,
    },
    subtitle: {
        color: Colors.black,
        fontSize: ScreenWidth * 0.035,
    },
    list: {
        maxHeight: ScreenHeight * 0.75,
        marginBottom: ScreenHeight * 0.045,
    }
})


export default { name: 'ReleasesGrouped', screen: ReleasesGrouped, config };
