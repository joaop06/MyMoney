import Title from '../components/Title';
import Container from '../components/Container';
import { ScreenHeight } from '../utils/Dimensions';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Components } from '../utils/Stylization';
const { Icons } = Components

/**
 * ***** Tela de Fechamento do Mês *****
 * 
 *  - Resumo financeiro do mês anterior.
 *  - Total de entradas, saídas e saldo final.
 *  - Comparativo com meses anteriores.
 */

var navigation
const config = {
    headerShown: false,
    title: 'Fechamento',
    tabBarStyle: { fontSize: 25 },
    tabBarIcon: () => <MaterialCommunityIcons
        name="finance"
        size={ScreenHeight * 0.03}
        color={navigation?.isFocused() ? Icons.focus : Icons.unfocus}
    />
};
const MonthEndClosing = () => {
    navigation = useNavigation()

    return (
        <Container>
            <Title>Tela de Fechamento do Mês</Title>
        </Container>
    );
}

export default { name: 'MonthEndClosing', screen: MonthEndClosing, config }