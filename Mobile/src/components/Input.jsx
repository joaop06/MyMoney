import React, { useState } from 'react';
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
    disabled = false,
    inputMode = 'text', // 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
    secureTextEntry = false,
    onChangeValue = () => { },
    placeholderColor = Colors.grey,
}) => {
    const [isFocused, setIsFocused] = useState(false)

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
            secureTextEntry={secureTextEntry}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            placeholderTextColor={placeholderColor}
            theme={{ colors: { primary: Colors.blue } }}
            style={[styles.input(disabled, isFocused), style]}
        />
    );
};

const styles = StyleSheet.create({
    input: (disabled, isFocused) => {

        return {
            marginBottom: 5,
            flexDirection: 'row',
            width: ScreenWidth * 0.8,
            height: ScreenHeight * 0.07,
            opacity: disabled ? 0.7 : 1,
            backgroundColor: Colors.transparent,
            borderRadius: 10,
            // elevation: !disabled && isFocused ? 1 : 0,

        }
    },
});

export default Input;
