import MMKV from '../../utils/MMKV/MMKV';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Colors } from '../../utils/Stylization';
import { useNavigation } from '@react-navigation/native';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/** Components */
import List from '../../components/List';
import Text from '../../components/Text';
import Title from '../../components/Title';
import Button from '../../components/Button';
import Container from '../../components/Container';


const Spending = () => {
    const navigation = useNavigation();
    const [dataSpending, setDataSpending] = useState([]);

    const fetchData = async () => {
        if (process.env.FETCH_DATA_SPENDING_IN_PROGRESS != true) {
            try {
                process.env.FETCH_DATA_SPENDING_IN_PROGRESS = true
                await MMKV.find('spending').then(res => setDataSpending(res));

            } catch (e) {
                console.error(e)
            } finally {
                process.env.FETCH_DATA_SPENDING_IN_PROGRESS = false
            }
        }
    }
    fetchData()

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData()
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const renderItem = ({ item }) => (
        <Button style={{ button: styles.itemList.button }}>
            <MaterialCommunityIcons
                name="rocket-launch"
                size={30}
                color={Colors.white}
            />
            <Text style={styles.itemList.title}>{item.title}</Text>
            <Text style={styles.itemList.value}>{(item.value || 0.00).toFixed(2).replace('.', ',')}</Text>
        </Button>
    )

    return (
        <Container>
            <Title>Despesas: {dataSpending.length}</Title>

            <List
                data={dataSpending}
                renderItem={renderItem}
            />
        </Container>
    )
}

const styles = StyleSheet.create({
    itemList: {
        button: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            // maxHeight: ScreenHeight * 0.12,
            height: ScreenHeight * 0.07,
            backgroundColor: Colors.blue_lighten,
            margin: 7,
            padding: 0,
        },
        title: {
            marginBottom: 0,
            color: Colors.black,
            alignContent: 'center',
        },

        value: {
            marginBottom: 0,
            color: Colors.white,
            alignContent: 'center',
        },
    },
})

module.exports = { name: 'Despesas', screen: Spending };