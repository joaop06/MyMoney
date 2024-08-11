import React from 'react';
import { Colors } from '../utils/Stylization';
import { ScreenHeight } from '../utils/Dimensions';
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
            margin: 5,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            opacity: disabled ? 0.4 : 1,
            backgroundColor: Colors.blue,
            minHeight: ScreenHeight * 0.06,
        }
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
    },
});

export default Button;
