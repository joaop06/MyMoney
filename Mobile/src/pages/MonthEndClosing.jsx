import Title from '../components/Title';
import { Colors } from '../utils/Stylization';
import Container from '../components/Container';
import { ScreenHeight } from '../utils/Dimensions';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

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
    tabBarIcon: () => <MaterialCommunityIcons
        name="calendar-check-outline"
        color={navigation?.isFocused() ? Colors.blue : Colors.grey}
        size={navigation?.isFocused() ? ScreenHeight * 0.04 : ScreenHeight * 0.035}
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