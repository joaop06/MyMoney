import List from '../../components/List';
import Text from '../../components/Text';
import { StyleSheet } from "react-native";
import Title from '../../components/Title';
import { Colors } from '../../utils/Stylization';
import Container from '../../components/Container';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';
import CardRelease from '../../components/CardRelease';


const config = { headerShown: false };

const ReleasesGrouped = ({ route: { params } }) => {
    let { date, dataList, totalValue, type } = params
    const iconName = type === 'Despesas' ? 'currency-usd-off' : 'currency-usd'

    totalValue = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const renderItem = ({ item }) => (
        <CardRelease item={{ ...item, iconName }} navigateTo={{ name: 'EditRelease', data: item }} />
    )

    return (
        <Container style={styles.container}>
            <Container style={styles.containerTitle}>
                <Text style={styles.title}>{type} {date}:</Text>
                <Text style={{ ...styles.title, color: Colors.black }}>{totalValue}</Text>
            </Container>

            <List style={styles.list} data={dataList} renderItem={renderItem} />
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
    },
    containerTitle: {
        flexDirection: 'row',
        width: ScreenWidth * 0.5,
        maxHeight: ScreenHeight * 0.15,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    title: {
        color: Colors.blue,
        fontSize: ScreenWidth * 0.04,
    },
    list: {
        maxHeight: ScreenHeight * 0.75,
        marginBottom: ScreenHeight * 0.045,
    }
})


export default { name: 'ReleasesGrouped', screen: ReleasesGrouped, config };
