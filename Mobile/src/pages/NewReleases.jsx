/**
 * ***** Tela de Lançamentos *****
 * 
 *  - Formulário para adicionar entradas e saídas.
 *  - Campos: valor, data, categoria, descrição.
 *  - Botões para salvar ou cancelar lançamento.
*/
import moment from "moment";
import Users from "../Data/Users";
import MMKV from "../utils/MMKV/MMKV";
import Releases from "../Data/Releases";
import Categories from "../Data/Categories";
import { Colors } from "../utils/Stylization";
import { StyleSheet, ScrollView } from 'react-native';
import TotalBalanceLogs from "../Data/TotalBalanceLogs";
import { useState, useCallback, useEffect } from "react";
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Div from "../components/Div";
import Text from "../components/Text";
import Label from '../components/Label';
import Input from "../components/Input";
import Title from "../components/Title";
import Button from "../components/Button";
import Calendar from "../components/Calendar";
import TextArea from "../components/TextArea";
import Container from "../components/Container";
import InputMask from "../components/InputMask";


var navigation
const config = {
    headerShown: false,
    title: 'Lançamento',
    tabBarIcon: () => <MaterialCommunityIcons
        name="plus-box-outline"
        color={navigation?.isFocused() ? Colors.blue : Colors.grey}
        size={navigation?.isFocused() ? ScreenHeight * 0.042 : ScreenHeight * 0.037}
    />
};

const NewReleases = () => {
    navigation = useNavigation();
    const [allCategories, setAllCategories] = useState([]);
    const [requestNewRelease, setRequestNewRelease] = useState(null)
    const [calendarVisibility, setCalendarVisibility] = useState(false);
    const optionsToSelect = [{ name: 'Renda', origin: 'RENTS' }, { name: 'Despesa', origin: 'SPENDING' }]

    /**
     * Dados do Lançamento
     */
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('0,00');
    const [type, setType] = useState('RENTS');
    const [description, setDescription] = useState('');
    const [dateRelease, setDateRelease] = useState(moment());
    const [categoryRelease, setCategoryRelease] = useState('');


    /**
     * Busca todas as Catagorias disponíveis
     */
    const getAllCategories = async () => {
        const { rows } = await Categories.find()
        setAllCategories(rows)
    }
    useEffect(() => {
        getAllCategories()
        return
    }, [])

    const getCategoriesByType = (typeRelease) => {
        return allCategories.filter(category => category.typeRelease === typeRelease)
    };

    const setValueState = (value, state, temporary = false, time = 2500) => {
        state(value)
        if (temporary) {
            setTimeout(() => state(null), time)
        }
    }

    // Limpa os campos ao montar o componente ou ao mudar de tela
    useFocusEffect(
        useCallback(() => {
            setTitle('');
            setValue('0,00');
            setDescription('');
            setCategoryRelease('')
            setDateRelease(moment())
        }, [])
    );

    const handleCreateNewRelease = async () => {
        setTitle(title.trim());
        setDescription(description.trim());
        const parsedValue = parseFloat(value.replace('R$ ', '').replaceAll('.', '').replace(',', '.') || 0.00);


        const handlerError = (message) => setValueState(
            { error: true, message },
            setRequestNewRelease,
            true
        )

        // Tratativa de campos vazios para inserção
        if (parsedValue <= 0.00) {
            return handlerError('Preencha o valor do lançamento')

        } else if (!title) {
            return handlerError('Preencha o título do lançamento')

        } else if (!categoryRelease?.id) {
            return handlerError('Selecione a categoria do lançamento')
        }


        try {
            // Todos os Lançamentos do tipo selecionado
            const userId = await MMKV.find('userId');

            // Adiciona o Novo Lançamento
            // const fields = `type, title, userId, description, value, categoryId, dateRelease`
            const fields = `type, title, userId, description, value, categoryId, createdAt`
            const values = `'${type}', '${title}', ${userId}, '${description}', ${parsedValue}, '${categoryRelease.id}', '${dateRelease.format('YYYY-MM-DD')}'`
            await Releases.create(fields, values)

            // Atualiza Saldo Total 
            const totalBalance = await Users.updateTotalBalance(userId);

            // Insere Logs de Saldo Total
            // const fieldsTotal = `userId, value, dateRelease`
            const fieldsTotal = `userId, value, createdAt`
            const valuesTotal = `${userId}, ${totalBalance}, '${dateRelease.format('YYYY-MM-DD')}'`
            await TotalBalanceLogs.create(fieldsTotal, valuesTotal)

            // Redireciona para tela inicial
            navigation.navigate('Home', { totalBalance });

        } catch (e) {
            console.error("Erro ao adicionar lançamento:", e);
            setValueState(
                { error: true, message: 'Erro ao adicionar lançamento' },
                setRequestNewRelease,
                true
            );
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, maxHeight: ScreenHeight * 0.9 }}>
                <Container style={styles.container}>

                    <Title style={styles.title}>
                        Lançamento de {`${type.includes('SPENDING') ? 'Despesa' : 'Renda'}`}
                    </Title>

                    <Container style={styles.containerSelector}>
                        {optionsToSelect.map((option, index) => (
                            <Button
                                key={index}
                                onPress={() => {
                                    setType(option.origin)
                                    if (type !== option.origin) setCategoryRelease('')
                                }}
                                style={{
                                    button: styles.buttonTypeRelease(type, option.origin),
                                    text: styles.buttonTypeTextRelease(type, option.origin)
                                }}
                            >
                                {option.name}
                            </Button>
                        ))}
                    </Container>

                    <Container style={styles.containerDateAndValue}>
                        <InputMask
                            type="money"
                            value={value}
                            label="Valor *"
                            inputMode="decimal"
                            onChangeValue={setValue}
                            placeholder="Ex: R$ 100,00"
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
                            style={styles.dateRelease}
                            value={dateRelease.format('DD/MM/YYYY')}
                            onFocus={() => setCalendarVisibility(true)}
                            onBlur={() => setCalendarVisibility(false)}
                        />

                        <Calendar
                            isVisible={calendarVisibility}
                            hideDatePicker={() => setCalendarVisibility(false)}
                            handleConfirm={selectedDate => {
                                selectedDate = moment(selectedDate)
                                setDateRelease(selectedDate)
                                setCalendarVisibility(false)
                            }}
                        />
                    </Container>


                    <Input
                        value={title}
                        label="Título *"
                        onChangeValue={setTitle}
                        style={styles.titleRelease}
                        placeholder="Título do lançamento"
                    />

                    <Label style={styles.labelDescription}>Descrição</Label>
                    <TextArea
                        value={description}
                        style={styles.description}
                        onChangeValue={setDescription}
                        placeholder={`Descrição sobre esta ${type.includes('SPENDING') ? 'despesa' : 'renda'}`}
                    />


                    {/*************** Categorias ***************/}
                    <Button
                        disabled={true}
                        style={styles.selectCategoryButton(categoryRelease)}
                    >
                        {categoryRelease ? categoryRelease.label : 'Selecione uma Categoria *'}
                    </Button>

                    <Div style={styles.categorySelectorContainer}>
                        <ScrollView contentContainerStyle={styles.categorySelector}>

                            {getCategoriesByType(type).map(category => (
                                <Button
                                    style={styles.categoryOption(category.color)}
                                    onPress={() => setCategoryRelease(category)}
                                >
                                    <MaterialCommunityIcons name={category.icon} color="white" size={ScreenHeight * 0.04} />
                                    <Text style={{ fontWeight: 'bold', fontSize: ScreenWidth * 0.022, color: 'white' }}>{category.label}</Text>
                                </Button>
                            ))}

                        </ScrollView>
                    </Div>


                    <Text style={styles.messageRequest}>{requestNewRelease?.message || ''}</Text>

                    <Container style={styles.containerAddButton}>
                        <Button
                            style={styles.addButton}
                            onPress={handleCreateNewRelease}
                        >
                            Adicionar
                        </Button>
                    </Container>

                </Container>
            </ScrollView>
        </KeyboardAvoidingView>
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
        marginVertical: ScreenHeight * 0.04,
        backgroundColor: Colors.transparent,
    },
    buttonTypeRelease: (type, origin) => ({
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'center',
        maxWidth: ScreenWidth * 0.2,
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
        marginVertical: ScreenHeight * 0.02,
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
    labelDescription: {
        textAlign: 'left',
        width: ScreenWidth * 0.8,
        fontSize: ScreenWidth * 0.035,
        marginTop: ScreenHeight * 0.025,
        backgroundColor: Colors.transparent,
        marginBottom: ScreenHeight * -0.015,
    },
    description: {
        width: ScreenWidth * 0.8,
        minHeight: ScreenHeight * 0.1,
        marginTop: ScreenHeight * 0.01,
        marginBottom: ScreenHeight * 0.04,
    },
    /**
     * Categorias
     */
    selectCategoryButton: (hasCategory) => ({
        button: {
            opacity: 1,
            borderWidth: 1,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: Colors.black,
            minWidth: ScreenWidth * 0.5,
            elevation: hasCategory ? 7 : 0,
            marginTop: ScreenHeight * 0.01,
            backgroundColor: hasCategory ? hasCategory.color : Colors.grey_lighten_1,
        }
    }),
    categorySelectorContainer: {
        elevation: 1,
        borderWidth: 1,
        overflow: 'hidden',
        borderColor: Colors.blue,
        width: ScreenWidth * 0.9,
        padding: ScreenWidth * 0.015,
        maxHeight: ScreenHeight * 0.21,
        marginTop: ScreenHeight * 0.02,
        borderRadius: ScreenWidth * 0.03,
        backgroundColor: Colors.grey_lighten_2,
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
            maxWidth: ScreenWidth * 0.2,
            padding: ScreenHeight * 0.01,
            minHeight: ScreenHeight * 0.07,
            marginVertical: ScreenHeight * 0.01,
            marginHorizontal: ScreenWidth * 0.01,
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
    containerAddButton: {
        width: ScreenWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: ScreenHeight * 0.12,
        backgroundColor: Colors.transparent,
    },
    addButton: {
        button: {
            flex: 1,
            borderWidth: 2,
            borderColor: Colors.blue,
            maxWidth: ScreenWidth * 0.5,
            backgroundColor: Colors.blue,
        },
        text: {
            color: Colors.white,
        }
    },
});

export default { name: 'NewReleases', screen: NewReleases, config };
