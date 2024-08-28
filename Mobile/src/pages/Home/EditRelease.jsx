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
import Categories from "../../Data/Categories";

import Div from "../../components/Div";
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const config = { headerShown: false };

const EditRelease = ({ route }) => {
    const navigation = useNavigation();
    const [editable, setEditable] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const [categoryRelease, setCategoryRelease] = useState('');


    /**
     * Dados do Lançamento
     */
    const releaseData = { ...route?.params };
    const [hasBeenChange, setHasBeenChange] = useState(false);
    const [newReleaseData, setNewReleaseData] = useState({ ...route?.params });

    // Tratativa para valores nulos em 'dateRelease'
    newReleaseData.dateRelease = newReleaseData.dateRelease ? moment(newReleaseData.dateRelease) : moment(newReleaseData.createdAt)

    const [requestNewRelease, setRequestNewRelease] = useState(null)
    const [calendarVisibility, setCalendarVisibility] = useState(false);
    const [optionsToSelect, setOptionsToSelect] = useState([{ name: 'Renda', origin: 'RENTS' }, { name: 'Despesa', origin: 'SPENDING' }])
    // const optionsToSelect = [{ name: 'Renda', origin: 'RENTS' }, { name: 'Despesa', origin: 'SPENDING' }]


    /**
     * Busca todas as Catagorias disponíveis
     */
    useEffect(() => {
        const getAllCategories = async () => {
            const { rows } = await Categories.find()
            setAllCategories(rows)


            // Busca dados da Categoria atual do Lançamento
            const selectedCategory = rows.find(item => {
                return item.id == releaseData.categoryId || (item.type === releaseData.type && item.name === 'Outros')
            })
            setCategoryRelease(selectedCategory)
        }
        getAllCategories()
        return () => { }
    }, [])

    const getCategoriesByType = (typeRelease) => {
        return allCategories.filter(category => category.type === typeRelease)
    };


    /**
     * Modal de Confirmação
     */
    const showAlertDelete = () => setIsAlertDeleteVisible(true);
    const hideAlertDelete = () => setIsAlertDeleteVisible(false);
    const [isAlertDeleteVisible, setIsAlertDeleteVisible] = useState(false);


    /**
     * Validação de alteração nos Dados
     */
    useEffect(() => {
        // Somente faz a comparação se estiver editando
        if (editable) {
            for (let key in releaseData) {
                if (newReleaseData.hasOwnProperty(key)) {
                    if (releaseData[key] !== newReleaseData[key]) {
                        // Se algum valor não for igual, houve alteração
                        return setHasBeenChange(true);
                    }
                }
            }
            return setHasBeenChange(false); // Se nao houver alterações
        }

        return () => { }
    }, [newReleaseData])


    /**
     * Atualiza os Dados do Lançamento
     */
    const setValueOnNewReleaseData = (property, value) => {
        setNewReleaseData({ ...newReleaseData, [property]: value })
    }


    /**
     * Reseta os valores iniciais do componente
     */
    const resetInitialState = () => {
        setEditable(false)
        setValueOnNewReleaseData('type', releaseData.type)
        setValueOnNewReleaseData('categoryId', releaseData.categoryId)

        const selectedCategory = allCategories.find(item => {
            return item.id == releaseData.categoryId || (item.type === releaseData.type && item.name === 'Outros')
        })
        setCategoryRelease(selectedCategory)
        setOptionsToSelect(optionsToSelect)
    }


    /**
     * Exclui o Lançamento
     */
    const handleDeleteRelease = async () => {
        const { userId } = releaseData

        await Releases.delete(releaseData.id);
        navigation.navigate('Home', { totalBalance: await Users.updateTotalBalance(userId) });
    }


    /**
     * Realiza a Atualização dos dados do Lançamento
     */
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
                categoryId: newReleaseData.categoryId,
                description: newReleaseData.description.trim(),
                dateRelease: newReleaseData.dateRelease.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            }

            // Atualiza os dados do Lançamento e Saldo Total
            await Releases.update(releaseToUpdate, { id: releaseToUpdate.id })
            totalBalance = await Users.updateTotalBalance(newReleaseData.userId);

            navigation.navigate('Home', { totalBalance });

        } else {
            resetInitialState()
            console.log('Não teve alteração, exibir mensagem de "Erro"')
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, maxHeight: ScreenHeight * 0.9 }}>
            {/* Confirmação de Exclusão */}
            <Alert
                onCancel={hideAlertDelete}
                onConfirm={handleDeleteRelease}
                isVisible={isAlertDeleteVisible}
                content={{ title: `Excluir ${releaseData.title}?`, cancel: 'Cancelar', confirm: 'Excluir' }}
            />



            <Container style={styles.container}>

                <Title style={styles.title}>{releaseData.title}</Title>


                <Container style={styles.containerSelector}>
                    {optionsToSelect.map((option, index) => (
                        <Button
                            key={index}
                            disabled={!editable}
                            onPress={() => {
                                setValueOnNewReleaseData('type', option.origin)
                                if (releaseData.type !== option.origin) setCategoryRelease('')
                            }}
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


                {/*************** Categorias ***************/}
                <Button
                    disabled={!editable}
                    style={styles.selectCategoryButton(categoryRelease, !editable)}
                >
                    {categoryRelease ? categoryRelease.label : 'Selecione uma Categoria *'}
                </Button>

                {editable ?
                    <Div style={styles.categorySelectorContainer}>
                        <ScrollView contentContainerStyle={styles.categorySelector}>
                            {getCategoriesByType(newReleaseData.type).map(category => (
                                <Button
                                    key={category.id}
                                    disabled={!editable}
                                    style={styles.categoryOption(category.color)}
                                    onPress={() => {
                                        setCategoryRelease(category)
                                        setValueOnNewReleaseData('categoryId', category.id)
                                    }}
                                >
                                    <MaterialCommunityIcons name={category.icon} color="white" size={ScreenHeight * 0.04} />
                                    <Text style={{ fontWeight: 'bold', fontSize: ScreenWidth * 0.022, color: 'white' }}>{category.label}</Text>
                                </Button>
                            ))}
                        </ScrollView>
                    </Div>
                    :
                    <Div name="phantomDiv" style={styles.phantomDiv}></Div>
                }


                <Text style={styles.messageRequest}>{requestNewRelease?.message || ''}</Text>

                <Container style={styles.containerButtons}>
                    <Button onPress={() => {
                        if (editable) {
                            resetInitialState()
                        } else {
                            showAlertDelete()
                        }
                    }}
                        style={styles.actionsButton('delete')}
                    >
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
        maxHeight: ScreenHeight * 0.9,
        paddingBottom: ScreenHeight * 0.02,
        backgroundColor: Colors.transparent,
    },
    title: {
        textAlign: 'center',
        width: ScreenWidth * 0.96,
        marginTop: ScreenHeight * 0.02,
        backgroundColor: Colors.transparent,
    },
    containerSelector: {
        alignItems: 'center',
        flexDirection: 'row',
        width: ScreenWidth * 0.8,
        justifyContent: 'space-between',
        marginVertical: ScreenHeight * 0.02,
        backgroundColor: Colors.transparent,
    },
    buttonTypeRelease: (type, origin) => ({
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'center',
        minWidth: ScreenWidth * 0.2,
        backgroundColor: type === origin ? Colors.blue : Colors.white,
    }),
    buttonTypeTextRelease: (type, origin) => ({
        fontWeight: 'bold',
        fontSize: ScreenWidth * 0.03,
        color: type === origin ? Colors.white : Colors.black,
    }),
    containerDateAndValue: {
        alignItems: 'center',
        flexDirection: 'row',
        width: ScreenWidth * 0.8,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
        marginVertical: ScreenHeight * 0.015,
    },
    dateRelease: {
        width: ScreenWidth * 0.35,
        height: ScreenHeight * 0.07,
        minWidth: ScreenWidth * 0.3,
        marginLeft: ScreenWidth * 0.05,
    },
    titleRelease: {
        width: ScreenWidth * 0.8,
        height: ScreenHeight * 0.07,
        minHeight: ScreenHeight * 0.05,
        marginTop: ScreenHeight * 0.02,
        backgroundColor: Colors.transparent,
        marginVertical: ScreenHeight * 0.015,
    },
    labelDescription: (editable) => ({
        textAlign: 'left',
        width: ScreenWidth * 0.8,
        fontSize: ScreenWidth * 0.035,
        marginTop: ScreenHeight * 0.025,
        backgroundColor: Colors.transparent,
        marginBottom: ScreenHeight * -0.015,
        color: editable ? Colors.blue : Colors.grey,
    }),
    description: {
        width: ScreenWidth * 0.8,
        minHeight: ScreenHeight * 0.1,
        marginTop: ScreenHeight * 0.01,
        marginBottom: ScreenHeight * 0.04,
    },

    /**
     * Categorias
     */
    selectCategoryButton: (hasCategory, disabled) => ({
        button: {
            borderWidth: 1,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: Colors.black,
            minWidth: ScreenWidth * 0.5,
            opacity: disabled ? 0.7 : 1,
            elevation: disabled ? 0 : 7,
            marginTop: ScreenHeight * 0.01,
            backgroundColor: hasCategory ? hasCategory.color : Colors.grey_lighten_1,
        }
    }),
    categorySelectorContainer: {
        width: ScreenWidth * 0.9,
        maxHeight: ScreenHeight * 0.2,
        marginTop: ScreenHeight * 0.02,
        backgroundColor: Colors.transparent,
    },
    categorySelector: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: Colors.transparent,
    },
    categoryOption: (color) => ({
        button: {
            borderRadius: 15,
            alignItems: 'center',
            backgroundColor: color,
            justifyContent: 'center',
            minWidth: ScreenWidth * 0.2,
            padding: ScreenHeight * 0.01,
            minHeight: ScreenHeight * 0.07,
            marginHorizontal: ScreenWidth * 0.01,
            marginVertical: ScreenHeight * 0.01,
        }
    }),
    messageRequest: {
        color: Colors.red,
        textAlign: 'center',
        margin: ScreenHeight * 0.025,
        fontSize: ScreenWidth * 0.035,
        marginTop: ScreenHeight * 0.02,
        backgroundColor: Colors.transparent,
    },
    containerButtons: {
        width: ScreenWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: ScreenHeight * 0.12,
        backgroundColor: Colors.transparent,
    },
    actionsButton: (type) => ({
        button: {
            flex: 1,
            borderWidth: 2,
            borderColor: Colors.blue,
            margin: ScreenWidth * 0.05,
            maxWidth: ScreenWidth * 0.35,
            backgroundColor: Colors.white,
            borderColor: type == 'update' ? Colors.blue : Colors.red,
        },
        text: {
            color: type == 'update' ? Colors.blue : Colors.red
        }
    }),
    phantomDiv: {
        width: ScreenWidth * 0.9,
        minHeight: ScreenHeight * 0.2,
        maxHeight: ScreenHeight * 0.2,
        marginTop: ScreenHeight * 0.02,
        backgroundColor: Colors.transparent,
    }
});

export default { name: 'EditRelease', screen: EditRelease, config };
