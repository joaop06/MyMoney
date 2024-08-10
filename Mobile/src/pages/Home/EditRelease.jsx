/**
 * ***** Tela de Lançamentos *****
 * 
 *  - Formulário para adicionar entradas e saídas.
 *  - Campos: valor, data, categoria, descrição.
 *  - Botões para salvar ou cancelar lançamento.
*/
import Users from "../../Data/Users";
import Releases from "../../Data/Releases";

import { StyleSheet } from 'react-native';
import { useState, useEffect } from "react";
import { Colors } from '../../utils/Stylization';
import { useNavigation } from '@react-navigation/native';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';

import Input from "../../components/Input";
import Title from "../../components/Title";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import Container from "../../components/Container";
import InputMask from "../../components/InputMask";


const config = { headerShown: false };

const EditRelease = ({ route }) => {
    const navigation = useNavigation();
    const [editable, setEditable] = useState(false);
    const [releaseData, setReleaseData] = useState(route?.params);
    const optionsToSelect = [{ name: 'Despesas', origin: 'SPENDING' }, { name: 'Rendas', origin: 'RENTS' }]


    console.log('releaseData (Edição): ', releaseData)



    const deleteRelease = async () => {
        const { userId } = releaseData

        await Releases.delete(releaseData.id);
        navigation.navigate('HomeScreen', { totalBalance: await Users.updateTotalBalance(userId) });
    }

    return (
        <Container style={styles.container}>

            <Title style={styles.title}>
                {releaseData.type === 'SPENDING' ? 'Despesa' : 'Renda'}: {releaseData.title}
            </Title>

            <InputMask
                type="money"
                label="Valor *"
                editable={editable}
                inputMode="decimal"
                value={releaseData.value}
                placeholder="Ex: R$ 100,00"
                style={styles.valueRelease}
                onChangeValue={(value) => setReleaseData({ ...releaseData, value })}
                options={{
                    unit: 'R$ ',
                    precision: 2,
                    separator: ',',
                    suffixUnit: '',
                }}
            />

            <Input
                label="Título *"
                disabled={!editable}
                value={releaseData.title}
                style={styles.titleRelease()}
                placeholder="Título do lançamento"
                onChangeValue={(title) => setReleaseData({ ...releaseData, title })}
            />

            <Button onPress={deleteRelease}>
                Deletar
            </Button>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
    title: {
        marginTop: 30,
        marginBottom: 60,
        textAlign: 'center',
        width: ScreenWidth * 0.96,
    },
    valueRelease: {
        width: ScreenWidth * 0.5,
    },
    titleRelease: () => {

        return {
            // marginTop: 85,
            // width: ScreenWidth * 0.7,
            // backgroundColor: Colors.transparent,
        }
    }

});

export default { name: 'EditRelease', screen: EditRelease, config };
