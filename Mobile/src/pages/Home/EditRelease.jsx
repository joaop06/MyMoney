/**
 * ***** Tela de Lançamentos *****
 * 
 *  - Formulário para adicionar entradas e saídas.
 *  - Campos: valor, data, categoria, descrição.
 *  - Botões para salvar ou cancelar lançamento.
*/
import moment from "moment";
import Users from "../../Data/Users";
import Releases from "../../Data/Releases";

import Text from "../../components/Text";
import Alert from "../../components/Alert";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Title from "../../components/Title";
import Button from "../../components/Button";
import Calendar from "../../components/Calendar";
import TextArea from "../../components/TextArea";
import Container from "../../components/Container";
import InputMask from "../../components/InputMask";

import { useState, useEffect } from "react";
import { Colors } from '../../utils/Stylization';
import { StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';


const config = { headerShown: false };

const EditRelease = ({ route }) => {
    const navigation = useNavigation();
    const [editable, setEditable] = useState(false);

    const [hasBeenChange, setHasBeenChange] = useState(false);
    const [releaseData, setReleaseData] = useState({ ...route?.params });
    const [newReleaseData, setNewReleaseData] = useState({ ...route?.params });

    // Tratativa para valores nulos em 'dateRelease'
    newReleaseData.dateRelease = newReleaseData.dateRelease ? moment(newReleaseData.dateRelease) : moment(newReleaseData.createdAt)

    const [requestNewRelease, setRequestNewRelease] = useState(null)
    const [calendarVisibility, setCalendarVisibility] = useState(false);
    const optionsToSelect = [{ name: 'Renda', origin: 'RENTS' }, { name: 'Despesa', origin: 'SPENDING' }]

    const showAlertDelete = () => setIsAlertDeleteVisible(true);
    const hideAlertDelete = () => setIsAlertDeleteVisible(false);
    const [isAlertDeleteVisible, setIsAlertDeleteVisible] = useState(false);

    useEffect(() => {
        // Somente faz a comparação se estiver editando
        if (editable) {
            for (let key in releaseData) {
                if (newReleaseData.hasOwnProperty(key)) {
                    if (releaseData[key] !== newReleaseData[key]) {
                        return setHasBeenChange(true); // Se algum valor não for igual (houver alteração)
                    }
                }
            }
            return setHasBeenChange(false); // Se nao houver alterações
        }
    }, [newReleaseData])

    const setValueOnNewReleaseData = (property, value) => {
        console.log(`Alteração em "${property}": ${value}`)
        setNewReleaseData({ ...newReleaseData, [property]: value })
    }

    const handleDeleteRelease = async () => {
        const { userId } = releaseData

        await Releases.delete(releaseData.id);
        navigation.navigate('HomeScreen', { totalBalance: await Users.updateTotalBalance(userId) });
    }

    const handleEditRelease = async () => {
        let totalBalance
        if (hasBeenChange) {

            let parsedValue
            if (typeof newReleaseData.value === 'number') parsedValue = newReleaseData.value
            else parsedValue = parseFloat(newReleaseData.value.replace('R$ ', '').replaceAll('.', '').replace(',', '.') || 0.00);

            const releaseToUpdate = {
                value: parsedValue,
                id: newReleaseData.id,
                type: newReleaseData.type,
                userId: newReleaseData.userId,
                title: newReleaseData.title.trim(),
                description: newReleaseData.description.trim(),
                dateRelease: newReleaseData.dateRelease.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            }

            await Releases.update(releaseToUpdate, { id: releaseToUpdate.id })

            // Atualiza Saldo Total e Redireciona para tela inicial
            totalBalance = await Users.updateTotalBalance(newReleaseData.userId);

        } else {
            console.log('Não teve alteração')
        }

        navigation.navigate('HomeScreen', { totalBalance });
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Container style={styles.container}>
                {/* Confirmação de Exclusão */}
                <Alert
                    onCancel={hideAlertDelete}
                    onConfirm={handleDeleteRelease}
                    isVisible={isAlertDeleteVisible}
                    content={{ title: `Excluir ${releaseData.title}?`, cancel: 'Cancelar', confirm: 'Excluir' }}
                />

                <Title style={styles.title}>
                    {releaseData.type === 'SPENDING' ? 'Despesa' : 'Renda'}: {releaseData.title}
                </Title>


                <Container style={styles.containerSelector}>
                    {optionsToSelect.map((option, index) => (
                        <Button
                            key={index}
                            disabled={!editable}
                            onPress={() => setValueOnNewReleaseData('type', option.origin)}
                            style={{
                                button: styles.buttonTypeRelease(newReleaseData.type, option.origin),
                                text: styles.buttonTypeTextRelease(newReleaseData.type, option.origin)
                            }}
                        >
                            {option.name}
                        </Button>
                    ))}
                </Container>

                <Container style={styles.containerDateAndValue}>
                    <InputMask
                        type="money"
                        label="Valor *"
                        editable={editable}
                        inputMode="decimal"
                        placeholder="Ex: R$ 100,00"
                        style={styles.valueRelease}
                        value={newReleaseData.value}
                        onChangeValue={(value) => setValueOnNewReleaseData('value', value)}
                        options={{
                            unit: 'R$ ',
                            precision: 2,
                            separator: ',',
                            suffixUnit: '',
                        }}
                    />

                    <Input
                        label="Data"
                        inputMode="decimal"
                        disabled={!editable}
                        style={styles.dateRelease}
                        value={newReleaseData.dateRelease.format('DD/MM/YYYY')}
                        onFocus={() => setCalendarVisibility(true)}
                        onBlur={() => setCalendarVisibility(false)}
                    />

                    <Calendar
                        isVisible={calendarVisibility}
                        date={newReleaseData.dateRelease}
                        hideDatePicker={() => setCalendarVisibility(false)}
                        handleConfirm={selectedDate => {
                            setCalendarVisibility(false)
                            selectedDate = moment(selectedDate)
                            setValueOnNewReleaseData('dateRelease', selectedDate)
                        }}
                    />
                </Container>


                <Input
                    label="Título *"
                    disabled={!editable}
                    style={styles.titleRelease}
                    value={newReleaseData.title}
                    placeholder="Título do lançamento"
                    onChangeValue={(title) => setValueOnNewReleaseData('title', title)}
                />

                <Label style={styles.labelDescription(editable)}>Descrição</Label>
                <TextArea
                    editable={editable}
                    style={styles.description}
                    value={newReleaseData.description}
                    onChangeValue={(description) => setValueOnNewReleaseData('description', description)}
                    placeholder={`Descrição sobre esta ${releaseData.type.includes('SPENDING') ? 'despesa' : 'renda'}`}
                />

                <Text style={styles.messageRequest}>{requestNewRelease?.message || ''}</Text>

                <Container style={styles.containerButtons}>
                    <Button onPress={editable ? () => { setEditable(false) } : showAlertDelete} style={styles.actionsButton('delete')}>
                        {editable ? 'Cancelar' : 'Excluir'}
                    </Button>
                    <Button onPress={editable ? handleEditRelease : () => { setEditable(true) }} style={styles.actionsButton('update')}>
                        {editable ? 'Salvar' : 'Editar'}
                    </Button>
                </Container>

            </Container>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        maxHeight: ScreenHeight * 0.85,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    title: {
        textAlign: 'center',
        width: ScreenWidth * 0.96,
        marginTop: ScreenHeight * 0.05,
        backgroundColor: Colors.transparent,
    },
    containerSelector: {
        flexDirection: 'row',
        alignContent: 'center',
        maxWidth: ScreenWidth * 0.45,
        maxHeight: ScreenHeight * 0.1,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    buttonTypeRelease: (type, origin) => {
        return {
            borderWidth: 1,
            borderRadius: 20,
            justifyContent: 'center',
            minWidth: ScreenWidth * 0.2,
            backgroundColor: type === origin ? Colors.blue : Colors.white,
        }
    },
    buttonTypeTextRelease: (type, origin) => {
        return {
            color: type === origin ? Colors.white : Colors.black
        }
    },
    containerDateAndValue: {
        flexDirection: 'row',
        maxHeight: ScreenHeight * 0.12,
        marginBottom: ScreenHeight * -0.07,
        backgroundColor: Colors.transparent,
    },
    dateRelease: {
        width: ScreenWidth * 0.3,
        height: ScreenHeight * 0.07,
        fontSize: ScreenWidth * 0.03,
    },
    titleRelease: {
        width: ScreenWidth * 0.7,
        height: ScreenHeight * 0.07,
        minHeight: ScreenHeight * 0.05,
        marginTop: ScreenHeight * 0.02,
    },
    labelDescription: (editable) => {
        return {
            marginBottom: ScreenHeight * -0.03,
            color: editable ? Colors.blue : Colors.grey,
        }
    },
    containerButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        maxHeight: ScreenHeight * 0.1,
        marginTop: ScreenHeight * 0.05,
        backgroundColor: Colors.transparent,
    },
    actionsButton: (type) => {
        return {
            button: {
                flex: 1,
                borderWidth: 2,
                borderColor: Colors.blue,
                margin: ScreenWidth * 0.01,
                maxWidth: ScreenWidth * 0.35,
                backgroundColor: Colors.white,
                borderColor: type == 'update' ? Colors.blue : Colors.red,
            },
            text: {
                color: type == 'update' ? Colors.blue : Colors.red
            }
        }
    },
    messageRequest: {
        color: Colors.red,
        margin: ScreenHeight * 0.02,
        fontSize: ScreenWidth * 0.035,
        backgroundColor: Colors.transparent,
    },
});

export default { name: 'EditRelease', screen: EditRelease, config };
