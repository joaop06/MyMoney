/**
 * ***** Tela de Lançamentos *****
 * 
 *  - Formulário para adicionar entradas e saídas.
 *  - Campos: valor, data, categoria, descrição.
 *  - Botões para salvar ou cancelar lançamento.
*/
import Users from "../Data/Users";
import MMKV from "../utils/MMKV/MMKV";
import Releases from "../Data/Releases";

import { StyleSheet } from 'react-native';
import { useState, useEffect } from "react";
import { Colors } from "../utils/Stylization";
import { useNavigation } from '@react-navigation/native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

import Label from '../components/Label';
import Input from "../components/Input";
import Title from "../components/Title";
import Button from "../components/Button";
import TextArea from "../components/TextArea";
import Container from "../components/Container";


const config = { title: 'Editar Lançamento', };

const EditRelease = ({ route }) => {
    const navigation = useNavigation();
    const [releaseData, setReleaseData] = useState(route?.params);
    const optionsToSelect = [{ name: 'Despesas', origin: 'SPENDING' }, { name: 'Rendas', origin: 'RENTS' }]

    const deleteRelease = async () => {
        const { userId } = releaseData

        await Releases.delete(releaseData.id);
        navigation.navigate('HomeScreen', { totalBalance: await Users.updateTotalBalance(userId) });
    }

    return (
        <Container>
            <Title>{`Editar: ${releaseData.title}`}</Title>

            <Button onPress={deleteRelease}>
                Deletar
            </Button>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        // flexGrow: 1,
        paddingTop: 50,
        alignItems: 'center',
        maxHeight: ScreenHeight * 1.1,
        justifyContent: 'space-between',
    },
});

export default { name: 'EditRelease', screen: EditRelease, config };
