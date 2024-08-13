/**
 * ***** Tela de Lançamentos *****
 * 
 *  - Formulário para adicionar entradas e saídas.
 *  - Campos: valor, data, categoria, descrição.
 *  - Botões para salvar ou cancelar lançamento.
*/
import Users from "../../Data/Users";
import Releases from "../../Data/Releases";

import Alert from "../../components/Alert";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Title from "../../components/Title";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import Container from "../../components/Container";
import InputMask from "../../components/InputMask";

import { StyleSheet } from 'react-native';
import { useState, useEffect } from "react";
import { Colors } from '../../utils/Stylization';
import { useNavigation } from '@react-navigation/native';
import { ScreenWidth, ScreenHeight } from '../../utils/Dimensions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const config = { headerShown: false };

const EditRelease = ({ route }) => {
    const navigation = useNavigation();
    const [editable, setEditable] = useState(false);

    const [hasBeenChange, setHasBeenChange] = useState(false);
    const [releaseData, setReleaseData] = useState({ ...route?.params });
    const [newReleaseData, setNewReleaseData] = useState({ ...route?.params });

    const optionsToSelect = [{ name: 'Despesas', origin: 'SPENDING' }, { name: 'Rendas', origin: 'RENTS' }]

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
            }

            console.log('Teve alteração na edição!')
            console.log(`releaseData: ${JSON.stringify(releaseData)} // newReleaseData: ${JSON.stringify(releaseToUpdate)}`)
            await Releases.update(releaseToUpdate, { id: releaseToUpdate.id })

            // Atualiza Saldo Total e Redireciona para tela inicial
            totalBalance = await Users.updateTotalBalance(newReleaseData.userId);

        } else {
            console.log('Não teve alteração')
        }

        navigation.navigate('HomeScreen', { totalBalance });
    }

    return (
        <KeyboardAwareScrollView
            extraHeight={100}
            extraScrollHeight={20}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
        >

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
                    label="Título *"
                    disabled={!editable}
                    style={styles.titleRelease}
                    value={newReleaseData.title}
                    placeholder="Título do lançamento"
                    onChangeValue={(title) => setValueOnNewReleaseData('title', title)}
                />

                <Label style={styles.labelTextArea(editable)}>Descrição</Label>
                <TextArea
                    editable={editable}
                    style={{ marginTop: -50 }}
                    value={newReleaseData.description}
                    onChangeValue={(description) => setValueOnNewReleaseData('description', description)}
                    placeholder={`Descrição sobre esta ${releaseData.type.includes('SPENDING') ? 'despesa' : 'renda'}`}
                />

                <Container style={styles.containerButtons}>
                    <Button onPress={editable ? () => { setEditable(false) } : showAlertDelete} style={styles.actionsButton('delete')}>
                        {editable ? 'Cancelar' : 'Excluir'}
                    </Button>
                    <Button onPress={editable ? handleEditRelease : () => { setEditable(true) }} style={styles.actionsButton('update')}>
                        {editable ? 'Salvar' : 'Editar'}
                    </Button>
                </Container>

            </Container>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        maxHeight: ScreenHeight * 0.9,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    title: {
        marginTop: 30,
        marginBottom: 20,
        textAlign: 'center',
        width: ScreenWidth * 0.96,
    },
    containerSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        maxHeight: ScreenHeight * 0.1,
        backgroundColor: Colors.transparent,
    },
    buttonTypeRelease: (type, origin) => {
        return {
            borderWidth: 1,
            borderRadius: 20,
            maxWidth: ScreenWidth * 0.25,
            minWidth: ScreenWidth * 0.25,
            minHeight: ScreenHeight * 0.06,
            maxHeight: ScreenHeight * 0.06,
            backgroundColor: type === origin ? Colors.blue : Colors.white,
        }
    },
    buttonTypeTextRelease: (type, origin) => {
        return {
            fontSize: 16,
            color: type === origin ? Colors.white : Colors.black
        }
    },
    valueRelease: {
        width: ScreenWidth * 0.5,
    },
    labelTextArea: (editable) => {
        return {
            marginTop: 10,
            color: editable ? Colors.blue : Colors.grey,
        }
    },
    titleRelease: {
        width: ScreenWidth * 0.7,
    },
    containerButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        maxHeight: ScreenHeight * 0.1,
        backgroundColor: Colors.transparent,
    },
    actionsButton: (type) => {
        return {
            button: {
                borderWidth: 2,
                backgroundColor: Colors.white,
                borderColor: type == 'update' ? Colors.blue : Colors.red,
            },
            text: {
                color: type == 'update' ? Colors.blue : Colors.red
            }
        }
    }
});

export default { name: 'EditRelease', screen: EditRelease, config };
