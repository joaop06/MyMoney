import Title from '../components/Title';
import Container from '../components/Container';
import { ScreenHeight } from '../utils/Dimensions';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Components } from '../utils/Stylization';
const { Icons } = Components

/**
 * ***** Tela de Categorias *****
 * 
 *  - Listagem das categorias de gastos.
 *  - Opção para adicionar, editar ou excluir categorias.
 *  - Exemplo de categorias: Alimentação, Transporte, Lazer, Contas Fixas, etc.
 */

var navigation
const config = {
    headerShown: false,
    title: 'Categorias',
    tabBarIcon: () => <MaterialCommunityIcons
        name="shape"
        size={ScreenHeight * 0.03}
        color={navigation?.isFocused() ? Icons.focus : Icons.unfocus}
    />
};
const Categories = () => {
    navigation = useNavigation()

    return (
        <Container>
            <Title>Tela de Categorias</Title>
        </Container>
    );
}

export default { name: 'Categories', screen: Categories, config }