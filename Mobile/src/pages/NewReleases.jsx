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
import { useNavigation } from '@react-navigation/native';
import { Colors, Components } from "../utils/Stylization";
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Label from '../components/Label';
import Input from "../components/Input";
import Title from "../components/Title";
import Button from "../components/Button";
import TextArea from "../components/TextArea";
import Container from "../components/Container";


var navigation
const { Icons } = Components
const config = {
    title: 'Novo Lançamento',
    headerShown: false,
    tabBarIcon: () => <MaterialCommunityIcons
        name="rocket-launch"
        size={30}
        color={navigation?.isFocused() ? Icons.focus : Icons.unfocus}
    />
};

const NewReleases = ({ route }) => {
    navigation = useNavigation();
    const origin = route?.params?.origin;

    const [title, setTitle] = useState('');
    const [value, setValue] = useState(0.00);
    const [description, setDescription] = useState('');
    const [type, setType] = useState((origin || 'spending').toUpperCase());

    const optionsToSelect = [{ name: 'Despesas', origin: 'SPENDING' }, { name: 'Rendas', origin: 'RENTS' }]

    /*
     * Limpa os campos ao montar o componente ou ao mudar de tela
     */
    useEffect(() => {
        setTitle('');
        setValue(0.00);
        setDescription('');
    }, []);


    const onChangeValue = (value = 0.00) => setValue(parseFloat(value))

    const handleNewRelease = async () => {

        // Tratativa de campos vazios para inserção
        if (value <= 0.00 || !title) {
            console.error(`Campos obrigatórios não preenchidos: Value ${value} // Title '${title}'`)
            return
        }

        // Todos os Lançamentos do tipo selecionado
        const userId = await MMKV.find('userId');

        // Adiciona o Novo Lançamento
        const newRelease = {
            value,
            title,
            userId,
            description,
            type: type,
        }
        await Releases.create(newRelease)


        // Atualiza Saldo Total e Redireciona para tela inicial
        navigation.navigate('HomeScreen', { totalBalance: await Users.updateTotalBalance(userId) });
    }


    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.container}
        >
            <Title>Novo Lançamento</Title>

            <Input
                value={value}
                label="Valor *"
                inputMode="decimal"
                style={styles.valueRelease}
                placeholder="Ex: R$ 100,00"
                onChangeValue={onChangeValue}
            />

            <Container style={styles.containerSelector}>
                {optionsToSelect.map((option, index) => (
                    <Button
                        key={index}
                        style={{
                            button: styles.containerButton(type, option.origin),
                            text: styles.containerButtonText(type, option.origin)
                        }}
                        onPress={() => setType(option.origin)}
                    >
                        {option.name}
                    </Button>
                ))}
            </Container>

            <Input
                value={title}
                label="Título *"
                onChangeValue={setTitle}
                style={styles.titleRelease}
                placeholder="Título do lançamento"
            />

            <Label style={styles.labelTextArea}>Descrição</Label>
            <TextArea
                onChangeValue={setDescription}
                placeholder={`Descrição sobre esta ${type.includes('spending') ? 'despesa' : 'renda'}`}
            />


            <Button
                style={styles.addButton}
                onPress={handleNewRelease}
            >
                Adicionar
            </Button>
        </KeyboardAwareScrollView >
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
    valueRelease: {
        marginTop: 20,
        borderRadius: 10,
        width: ScreenWidth * 0.4,
        backgroundColor: Colors.transparent,
    },
    containerSelector: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        maxHeight: ScreenHeight * 0.1,
        backgroundColor: Colors.grey_lighten,
    },
    containerButton: (type, origin) => {
        origin = origin.toLowerCase()
        type = type.toLowerCase().replace('releases', '')

        let selected = {}
        const defaultStyle = {
            borderWidth: 1,
            borderRadius: 20,
            maxWidth: ScreenWidth * 0.25,
            minWidth: ScreenWidth * 0.25,
            backgroundColor: type === origin ? Colors.blue : Colors.white,
        }

        return { ...defaultStyle, ...selected, }
    },
    containerButtonText: (type, origin) => {
        origin = origin.toLowerCase()
        type = type.toLowerCase().replace('releases', '')

        let selected = {}
        const defaultStyle = {
            fontSize: 16,
            color: type === origin ? Colors.white : Colors.black
        }

        return { ...defaultStyle, ...selected, }
    },
    titleRelease: {
        marginTop: 85,
        width: ScreenWidth * 0.7,
        backgroundColor: Colors.transparent,
    },
    labelTextArea: {
        marginTop: 30,
    },
    addButton: {
        button: {
            marginTop: 50,
            width: ScreenWidth * 0.7,
        },
    },
});

export default { name: 'NewReleases', screen: NewReleases, config };
