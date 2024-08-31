import Text from './Text';
import { StyleSheet } from 'react-native';
import { Colors } from '../utils/Stylization';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const Label = ({ children, style = {}, }) => {
    return <Text style={{ ...styles.label, ...style }}>{children}</Text>
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 0,
        textAlign: 'left',
        color: Colors.blue,
        width: ScreenWidth * 0.7,
        height: ScreenHeight * 0.04,
        fontSize: ScreenWidth * 0.05,
    },
});

export default Label;
