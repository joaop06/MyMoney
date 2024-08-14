import React from 'react';
import { Colors } from '../utils/Stylization';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({
    children,
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
            padding: 15,
            alignItems: 'center',
            margin: ScreenWidth * 0.02,
            opacity: disabled ? 0.4 : 1,
            backgroundColor: Colors.blue,
            minHeight: ScreenHeight * 0.06,
            borderRadius: ScreenWidth * 0.03,
        }
    },
    buttonText: {
        fontWeight: 'bold',
        color: Colors.white,
        fontSize: ScreenWidth * 0.045,
    },
});

export default Button;
