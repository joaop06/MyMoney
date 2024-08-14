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

import { useState, useCallback } from "react";
import { StyleSheet, ScrollView } from 'react-native';
import { Colors, Components } from "../utils/Stylization";
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Label from '../components/Label';
import Input from "../components/Input";
import Title from "../components/Title";
import Button from "../components/Button";
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
        size={30}
        color={navigation?.isFocused() ? Icons.focus : Icons.unfocus}
    />
};

const NewReleases = () => {
    navigation = useNavigation();

    const [title, setTitle] = useState('');
    const [value, setValue] = useState(0.00);
    const [type, setType] = useState('SPENDING');
    const [description, setDescription] = useState('');

    const optionsToSelect = [{ name: 'Despesas', origin: 'SPENDING' }, { name: 'Rendas', origin: 'RENTS' }]

    /*
     * Limpa os campos ao montar o componente ou ao mudar de tela
     */
    useFocusEffect(
        useCallback(() => {
            setTitle('');
            setValue(0.00);
            setDescription('');
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
            console.error(`Campos obrigatórios não preenchidos: Value ${parsedValue} // Title '${title}'`)
            return
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
            })


            // Atualiza Saldo Total e Redireciona para tela inicial
            const totalBalance = await Users.updateTotalBalance(userId);
            navigation.navigate('HomeScreen', { totalBalance });

        } catch (e) {
            console.error("Erro ao adicionar lançamento:", e);
            // Implementar Modal de Alerta: Ex: Alert.alert('Erro', 'Não foi possível adicionar o lançamento.');
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
                            onPress={() => setType(option.origin)}
                        >
                            {option.name}
                        </Button>
                    ))}
                </Container>

                <InputMask
                    type="money"
                    value={value}
                    label="Valor *"
                    inputMode="decimal"
                    onChangeValue={setValue}
                    style={styles.valueRelease}
                    placeholder="Ex: R$ 100,00"
                    options={{
                        unit: 'R$ ',
                        precision: 2,
                        separator: ',',
                        suffixUnit: '',
                    }}
                />

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
        flex: 1,
        alignItems: 'center',
        maxHeight: ScreenHeight * 0.85,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    title: {
        textAlign: 'center',
        width: ScreenWidth * 0.96,
        fontSize: ScreenWidth * 0.05,
        marginTop: ScreenHeight * 0.1,
        marginBottom: ScreenHeight * 0.01,
    },
    containerSelector: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        maxHeight: ScreenHeight * 0.1,
        backgroundColor: Colors.transparent,
    },
    containerButton: (type, origin) => {
        return {
            borderWidth: 1.2,
            borderRadius: 20,
            justifyContent: 'center',
            minWidth: ScreenWidth * 0.25,
            minHeight: ScreenHeight * 0.06,
            backgroundColor: type === origin ? Colors.blue : Colors.white,
        }
    },
    containerButtonText: (type, origin) => {
        return {
            fontSize: ScreenWidth * 0.04,
            color: type === origin ? Colors.white : Colors.black
        }
    },
    valueRelease: {
        width: ScreenWidth * 0.5,
    },
    titleRelease: {
        width: ScreenWidth * 0.7,
    },
    labelDescription: {
        color: Colors.blue,
        marginTop: ScreenHeight * 0.02,
    },
    containerAddButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        maxHeight: ScreenHeight * 0.1,
        backgroundColor: Colors.transparent,
    },
    addButton: {
        button: {
            flex: 1,
            borderWidth: 2,
            maxWidth: ScreenWidth * 0.7,
            backgroundColor: Colors.blue,
            borderColor: Colors.blue,
        },
        text: {
            color: Colors.white,
        }
    },
});

export default { name: 'NewReleases', screen: NewReleases, config };
