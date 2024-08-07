import React from 'react';
import { Colors } from '../utils/Stylization';
import { Text as TextNative, StyleSheet } from 'react-native';

const Text = ({
    children,
    style = {},
    onPress = () => { }
}) => {
    return <TextNative style={{ ...styles.text, ...style }} onPress={onPress}>{children}</TextNative>;
};

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        marginBottom: 20,
        fontWeight: 'bold',
        color: Colors.grey_darken,
    },
});

export default Text;
