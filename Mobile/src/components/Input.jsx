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
    multiline = false,
    numberOfLines = 1,
    onBlur = () => { },
    inputMode = 'text', // 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
    onFocus = () => { },
    secureTextEntry = false,
    onChangeValue = () => { },
    autoCapitalize = 'sentences',   // 'none': Nenhuma capitalização | 'sentences': Primeira letra de cada sentença | 'words': Primeira letra de cada palavra | 'characters': Todas as letras | undefined;
    placeholderColor = Colors.grey,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextInput
            mode={mode}
            label={label}
            value={value}
            disabled={disabled}
            multiline={multiline}
            inputMode={inputMode}
            maxLength={maxLength}
            placeholder={placeholder}
            onChangeText={onChangeValue}
            numberOfLines={numberOfLines}
            autoCapitalize={autoCapitalize}
            onBlur={() => {
                onBlur();
                setIsFocused(false);
            }}
            onFocus={() => {
                onFocus();
                setIsFocused(true);
            }}
            placeholderTextColor={placeholderColor}
            theme={{ colors: { primary: Colors.blue } }}
            secureTextEntry={secureTextEntry && !showPassword}
            style={[styles.input(disabled, isFocused), style]}
            right={secureTextEntry ? (
                <TextInput.Icon
                    color={Colors.grey_lighten_1}
                    rippleColor={Colors.blue_lighten_2}
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                />
            ) : null}

        />
    );
};

const styles = StyleSheet.create({
    input: (disabled, isFocused) => {
        return {
            borderRadius: 10,
            flexDirection: 'row',
            width: ScreenWidth * 0.65,
            opacity: disabled ? 0.7 : 1,
            fontSize: ScreenWidth * 0.03,
            height: ScreenHeight * 0.055,
            marginBottom: ScreenHeight * 0.01,
            backgroundColor: Colors.transparent,
            borderColor: Colors.black,
        }
    },
});

export default Input;
