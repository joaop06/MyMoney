import MMKV from '../../utils/MMKV/MMKV';
import Releases from '../../Data/Releases';

import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Colors } from '../../utils/Stylization';
import { ScreenHeight } from '../../utils/Dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/** Components */
import List from '../../components/List';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Container from '../../components/Container';


const Rents = () => {
    const [dataRents, setDataRents] = useState([]);
    const [totalRents, setTotalRents] = useState(0.00);

    const fetchData = async () => {
        if (process.env.FETCH_DATA_RENTS_IN_PROGRESS != true) {
            try {
                process.env.FETCH_DATA_RENTS_IN_PROGRESS = true

                const { rows } = await Releases.find({
                    type: 'RENTS',
                    userId: await MMKV.find('userId'),
                })
                setDataRents(rows)

                let totalRentsValue = 0.00
                rows.forEach(rent => totalRentsValue += rent.value)
                setTotalRents(totalRentsValue)

            } catch (e) {
                console.error(e)
            } finally {
                process.env.FETCH_DATA_RENTS_IN_PROGRESS = false
            }
        }
    }

    fetchData()
    useEffect(() => {
        const interval = setInterval(fetchData, 1000)
        return () => clearInterval(interval)
    }, [])

    const renderItem = ({ item }) => (
        <Button style={{ button: styles.itemList.button }} navigateTo={{ name: 'EditRelease', data: item }} >
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
            <Text style={{ fontSize: 16 }}>Rendas Totais: {(totalRents).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>

            <List
                data={dataRents}
                renderItem={renderItem}
            />
        </Container>
    )
}

const styles = StyleSheet.create({
    itemList: {
        button: {
            margin: 7,
            padding: 0,
            flexDirection: 'row',
            height: ScreenHeight * 0.07,
            justifyContent: 'space-around',
            backgroundColor: Colors.blue_lighten,
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

module.exports = { name: 'Rendas', screen: Rents };
