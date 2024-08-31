import React from 'react';
import { Colors } from '../utils/Stylization';
import { useNavigation } from '@react-navigation/native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({
    children,
    buttonKey,
    style = {},
    disabled = false,
    timeoutNavigate = 0,
    onPress = () => { },
    navigateTo = { name: '', data: {} },
}) => {
    const { button, text } = style
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            key={buttonKey}
            disabled={disabled}
            style={{ ...stylesDefault.button(disabled), ...button }}
            onPress={() => {
                if (onPress && typeof onPress === 'function') onPress()
                if (navigateTo.name) setTimeout(() => navigation.navigate(navigateTo.name, navigateTo.data), timeoutNavigate)
            }}>
            {
                typeof children !== 'string' ?
                    children :
                    <Text style={{ ...stylesDefault.buttonText, ...text }}>{children}</Text>
            }

        </TouchableOpacity>
    );
};

const stylesDefault = StyleSheet.create({
    button: (disabled) => {
        return {
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.4 : 1,
            backgroundColor: Colors.blue,
            minWidth: ScreenWidth * 0.35,
            minHeight: ScreenHeight * 0.05,
            borderRadius: ScreenWidth * 0.03,
        }
    },
    buttonText: {
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: ScreenWidth * 0.035,
    },
});

export default Button;
