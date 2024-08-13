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
    // const iconName = type === 'Despesas' ? 'elevation-decline' : 'finance'
    const iconName = type === 'Despesas' ? 'currency-usd-off' : 'currency-usd'

    totalValue = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const renderItem = ({ item }) => (
        <CardRelease item={{ ...item, iconName }} navigateTo={{ name: 'EditRelease', data: item }} />
    )

    return (
        <Container style={styles.container}>
            <Container style={styles.title}>
                <Title style={{ fontSize: 20 }}>{type} {date}:</Title>

                <Text style={{ fontSize: 18 }}>{totalValue}</Text>
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
        justifyContent: 'space-between'
    },
    title: {
        marginBottom: 30,
        flexDirection: 'row',
        width: ScreenWidth * 0.7,
        justifyContent: 'space-between',
    },
    list: {
        marginBottom: 50,
        maxHeight: ScreenHeight * 0.7,

    },
})


export default { name: 'ReleasesGrouped', screen: ReleasesGrouped, config };
