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

import { useState, useCallback, useEffect } from "react";
import { StyleSheet, ScrollView } from 'react-native';
import { Colors, Components } from "../utils/Stylization";
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Div from "../components/Div";
import List from "../components/List";
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
const { Icons } = Components
const config = {
    title: 'Novo Lançamento',
    headerShown: false,
    tabBarIcon: () => <MaterialCommunityIcons
        name="rocket-launch"
        size={ScreenHeight * 0.03}
        color={navigation?.isFocused() ? Icons.focus : Icons.unfocus}
    />
};

const NewReleases = () => {
    navigation = useNavigation();

    const [title, setTitle] = useState('');
    const [value, setValue] = useState('0,00');
    const [type, setType] = useState('RENTS');
    const [description, setDescription] = useState('');
    const [dateRelease, setDateRelease] = useState(moment());

    const [requestNewRelease, setRequestNewRelease] = useState(null)
    const [calendarVisibility, setCalendarVisibility] = useState(false);

    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isCategorySelectorVisible, setCategorySelectorVisible] = useState(false);

    const optionsToSelect = [{ name: 'Renda', origin: 'RENTS' }, { name: 'Despesa', origin: 'SPENDING' }]

    /**
     * Busca todas as Catagorias disponíveis
     */
    useEffect(() => {
        const getAllCategories = async () => {
            const categories = await Categories.find()
            console.log('Total de Categorias: ', categories.totalCount)
            setAllCategories(categories.rows)
        }
        getAllCategories()
    }, [])

    const getCategoriesByType = (typeRelease) => {
        return allCategories.filter(category => category.type === typeRelease)
    };

    const setValueState = (value, state, temporary = false, time = 2500) => {
        state(value)
        if (temporary) {
            setTimeout(() => state(null), time)
        }
    }

    /*
     * Limpa os campos ao montar o componente ou ao mudar de tela
     */
    useFocusEffect(
        useCallback(() => {
            setTitle('');
            setValue('0,00');
            setDescription('');
            setDateRelease(moment())
            return
        }, [])
    );

    const handleNewRelease = async () => {
        setTitle(title.trim());
        setDescription(description.trim());

        const parsedValue = parseFloat(
            value.replace('R$ ', '').replaceAll('.', '').replace(',', '.')
            || 0.00
        );

        // Tratativa de campos vazios para inserção
        if (parsedValue <= 0.00 || !title) {
            return setValueState(
                { error: true, message: 'Preencha os campos obrigatórios' },
                setRequestNewRelease,
                true
            )
        }

        try {
            // Todos os Lançamentos do tipo selecionado
            const userId = await MMKV.find('userId');

            // Adiciona o Novo Lançamento
            await Releases.create({
                type,
                title,
                userId,
                description,
                value: parsedValue,
                categoryId: selectedCategory.id,
                dateRelease: dateRelease.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            })

            // Atualiza Saldo Total e Redireciona para tela inicial
            const totalBalance = await Users.updateTotalBalance(userId);
            navigation.navigate('HomeScreen', { totalBalance });

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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Container style={styles.container}>

                <Title style={styles.title}>
                    Lançamento de {`${type.includes('SPENDING') ? 'Despesa' : 'Renda'}`}
                </Title>

                <Container style={styles.containerSelector}>
                    {optionsToSelect.map((option, index) => (
                        <Button
                            key={index}
                            style={{
                                button: styles.containerButton(type, option.origin),
                                text: styles.containerButtonText(type, option.origin)
                            }}
                            onPress={() => {
                                setType(option.origin)
                                setSelectedCategory('')
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
                    style={styles.selectCategoryButton(selectedCategory)}
                    onPress={() => setCategorySelectorVisible(!isCategorySelectorVisible)}
                >
                    {selectedCategory ? selectedCategory.label : 'Selecione uma Categoria *'}
                </Button>

                {isCategorySelectorVisible && (
                    <Div style={styles.categorySelectorContainer}>
                        <ScrollView contentContainerStyle={styles.categorySelector}>
                            {getCategoriesByType(type).map(category => (
                                <Button
                                    key={category.id}
                                    style={styles.categoryOption(category.color)}
                                    onPress={() => {
                                        setSelectedCategory(category);
                                        setCategorySelectorVisible(false);
                                    }}
                                >
                                    <MaterialCommunityIcons name={category.icon} color="white" size={ScreenHeight * 0.04} />
                                    <Text style={{ fontWeight: 'bold', fontSize: ScreenWidth * 0.022, color: 'white' }}>{category.label}</Text>
                                </Button>
                            ))}
                        </ScrollView>
                    </Div>
                )}





                <Text style={styles.messageRequest}>{requestNewRelease?.message || ''}</Text>

                <Container style={styles.containerAddButton}>
                    <Button
                        style={styles.addButton}
                        onPress={handleNewRelease}
                    >
                        Adicionar
                    </Button>
                </Container>

            </Container>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        // maxHeight: ScreenHeight * 0.85,
        // justifyContent: 'space-between',
        // backgroundColor: Colors.transparent,


        // Estilização ChatGPT
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.transparent,
        paddingBottom: ScreenHeight * 0.02,
    },
    title: {
        textAlign: 'center',
        width: ScreenWidth * 0.96,
        marginTop: ScreenHeight * 0.05,
        backgroundColor: Colors.transparent,
    },
    containerSelector: {
        // flexDirection: 'row',
        // alignContent: 'center',
        // maxWidth: ScreenWidth * 0.45,
        // maxHeight: ScreenHeight * 0.1,
        // justifyContent: 'space-between',
        // backgroundColor: Colors.transparent,


        // Estilização ChatGPT
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: ScreenWidth * 0.9,
        marginVertical: ScreenHeight * 0.02,
        backgroundColor: Colors.transparent,
    },
    containerButton: (type, origin) => ({
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'center',
        minWidth: ScreenWidth * 0.2,
        backgroundColor: type === origin ? Colors.blue : Colors.white,
    }),
    containerButtonText: (type, origin) => ({
        // color: type === origin ? Colors.white : Colors.black


        // Estilização ChatGPT
        fontWeight: 'bold',
        fontSize: ScreenWidth * 0.03,
        color: type === origin ? Colors.white : Colors.black,
    }),
    containerDateAndValue: {
        // flexDirection: 'row',
        // maxHeight: ScreenHeight * 0.12,
        // marginBottom: ScreenHeight * -0.07,
        // backgroundColor: Colors.transparent,


        // Estilização ChatGPT
        width: ScreenWidth * 0.9,
        marginVertical: ScreenHeight * 0.015,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    dateRelease: {
        width: ScreenWidth * 0.35,
        height: ScreenHeight * 0.07,
        minWidth: ScreenWidth * 0.3,
        marginLeft: ScreenWidth * 0.05,
    },
    titleRelease: {
        // width: ScreenWidth * 0.7,
        // height: ScreenHeight * 0.07,
        // minHeight: ScreenHeight * 0.05,
        // marginTop: ScreenHeight * 0.02,


        // Estilização ChatGPT
        width: ScreenWidth * 0.9,
        backgroundColor: Colors.transparent,
        marginVertical: ScreenHeight * 0.015,
    },
    labelDescription: {
        // color: Colors.blue,
        // marginBottom: ScreenHeight * -0.03,


        // Estilização ChatGPT
        marginTop: ScreenHeight * 0.01,
        width: ScreenWidth * 0.9,
        fontSize: ScreenWidth * 0.035,
        textAlign: 'left',
        backgroundColor: Colors.transparent,
    },
    description: {
        width: ScreenWidth * 0.9,
        minHeight: ScreenHeight * 0.15,
        marginTop: ScreenHeight * 0.01,
    },


    /**
     * Categorias
     */
    selectCategoryButton: (hasCategory) => ({
        button: {
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
        width: ScreenWidth * 0.9,
        maxHeight: ScreenHeight * 0.2,
        marginTop: ScreenHeight * 0.01,
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
            marginVertical: ScreenHeight * 0.005,
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
        marginBottom: ScreenHeight * 0.06,
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
