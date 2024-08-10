import moment from 'moment';
import MMKV from '../../utils/MMKV/MMKV';
import Releases from '../../Data/Releases';
import { useEffect, useState } from 'react';

/** Components */
import List from '../../components/List';
import Text from '../../components/Text';
import Container from '../../components/Container';
import CardRelease from '../../components/CardRelease';

const mapDaysWeek = {
    "Sunday": "Domingo",
    "Saturday": "Sábado",
    "Friday": "Sexta-feira",
    "Tuesday": "Terça-feira",
    "Monday": "Segunda-feira",
    "Thursday": "Quinta-feira",
    "Wednesday": "Quarta-feira",
};

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

                let totalRentsValue = 0.00
                const rentsGrouped = rows.reduce((acc, curr) => {
                    const createdAt = moment(curr.createdAt)
                    const date = createdAt.format('DD/MM')

                    const title = mapDaysWeek[createdAt.format('dddd')]

                    const existDate = acc.findIndex(item => item.date === date)
                    if (existDate > -1) {
                        acc[existDate].dataList.push(curr)
                        acc[existDate].value += curr.value

                    } else {
                        acc.push({
                            date,
                            title,
                            dataList: [curr],
                            value: curr.value,
                        })
                    }

                    totalRentsValue += curr.value
                    return acc
                }, [])

                setDataRents(rentsGrouped)
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
        const interval = setInterval(fetchData, 10000)
        return () => clearInterval(interval)
    }, [])

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
        <Container>
            <Text style={{ fontSize: 16 }}>Rendas Totais: {(totalRents).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>

            <List
                data={dataRents}
                renderItem={renderItem}
            />
        </Container>
    )
}

module.exports = { name: 'Rendas', screen: Rents };
