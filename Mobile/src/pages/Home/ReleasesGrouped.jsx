import List from '../../components/List';
import Text from '../../components/Text';
import { StyleSheet } from "react-native";
import Title from '../../components/Title';
import Container from '../../components/Container';
import { ScreenWidth } from '../../utils/Dimensions';
import CardRelease from '../../components/CardRelease';


const config = { headerShown: false };

const ReleasesGrouped = ({ route: { params } }) => {
    let { date, dataList, totalValue, type } = params

    totalValue = totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const renderItem = ({ item }) => (
        <CardRelease item={item} navigateTo={{ name: 'EditRelease', data: item }} />
    )

    return (
        <Container>
            <Container style={styles.title}>
                <Title style={{ fontSize: 20 }}>{type} {date}:</Title>

                <Text style={{ fontSize: 18 }}>{totalValue}</Text>
            </Container>


            <List
                data={dataList}
                renderItem={renderItem}
            />
        </Container>
    );
}

const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        width: ScreenWidth * 0.7,
        justifyContent: 'space-between',
        // fontSize: 15,
        // marginBottom: 0,
        // alignContent: 'center',
        // color: Colors.grey_darken,
    },
})


export default { name: 'ReleasesGrouped', screen: ReleasesGrouped, config };
