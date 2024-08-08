import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../utils/Stylization';
import { TextInputMask } from 'react-native-masked-text';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const InputMask = ({
    type,
    label,
    value,
    maxLength,
    style = {},
    placeholder,
    options = {},
    mode = 'flat',
    disabled = false, // Desabilitar Input
    inputMode = 'text', // 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
    secureTextEntry = false,
    onChangeValue = () => { },
    placeholderColor = Colors.grey,
}) => {
    if (!['credit-card', 'cpf', 'cnpj', 'zip-code', 'only-numbers', 'money', 'cel-phone', 'datetime', 'custom'].includes(type)) {
        throw new Error(`Property "type" not specified`)
    }

    return (
        <TextInputMask
            type={type}
            value={value}
            options={options}
            disabled={disabled}
            inputMode={inputMode}
            maxLength={maxLength}
            placeholder={placeholder}
            onChangeText={onChangeValue}
            style={[styles.input, style]}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={placeholderColor}
            customTextInputProps={{
                mode: mode,
                label: label,
                theme: { colors: { primary: Colors.blue } },
            }}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        fontSize: 18,
        marginBottom: 5,
        paddingLeft: 30,
        color: Colors.black,
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        width: ScreenWidth * 0.8,
        height: ScreenHeight * 0.07,
        backgroundColor: Colors.transparent,
        borderBottomColor: Colors.grey_darken,
    },
});

export default InputMask;
