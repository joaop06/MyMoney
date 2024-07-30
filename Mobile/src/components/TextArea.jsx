import Input from './Input';
import { Colors } from '../utils/Stylization';
import { TextInput, StyleSheet } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const TextArea = ({
    label = '',
    placeholder,
    numberOfLines = 10,
    onChangeValue = () => { },
    placeholderColor = Colors.grey,
}) => {
    return (
        <TextInput
            label={label}
            multiline={true}
            style={styles.textArea}
            placeholder={placeholder}
            onChangeText={onChangeValue}
            numberOfLines={numberOfLines}
            placeholderTextColor={placeholderColor}
        />
    )
}

const styles = StyleSheet.create({
    textArea: {
        borderWidth: 1,
        marginBottom: 5,
        paddingLeft: 15,
        borderRadius: 10,
        color: Colors.black,
        flexDirection: 'row',
        borderColor: Colors.blue,
        width: ScreenWidth * 0.7,
        height: ScreenHeight * 0.1,
        backgroundColor: Colors.white,
    },
})

export default TextArea;