import { StyleSheet } from 'react-native';
import { Colors } from '../utils/Stylization';
import { TextInput } from 'react-native-paper';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const Input = ({
    label,
    value,
    maxLength,
    style = {},
    placeholder,
    mode = 'flat',
    disabled = false, // Desabilitar Input
    inputMode = 'text', // 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
    secureTextEntry = false,
    onChangeValue = () => { },
    placeholderColor = Colors.grey,
}) => {
    return (
        <TextInput
            mode={mode}
            label={label}
            value={value}
            disabled={disabled}
            inputMode={inputMode}
            maxLength={maxLength}
            placeholder={placeholder}
            onChangeText={onChangeValue}
            style={[styles.input, style]}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={placeholderColor}
            theme={{ colors: { primary: Colors.blue } }}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        marginBottom: 5,
        flexDirection: 'row',
        width: ScreenWidth * 0.8,
        height: ScreenHeight * 0.07,
        backgroundColor: Colors.transparent,
    },
});

export default Input;
