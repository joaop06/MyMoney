import Text from './Text';
// import { Text } from 'react-native'
import { StyleSheet } from 'react-native';
import { Colors } from '../utils/Stylization';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const Label = ({
    children,
    style = {},
}) => {


    return (
        <Text
            style={{ ...styles.label, ...style }}
        >{children}</Text>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 22,
        marginBottom: 0,
        textAlign: 'left',
        color: Colors.blue,
        width: ScreenWidth * 0.7,
        height: ScreenHeight * 0.04,
    },
});

export default Label;


// styled.Text`
// width: 75%;
// display: flex;
// font-size: 20px;
// margin-top: 25px;
// font-weight: bold;
// align-items: center;
// justify-content: center;
// `;