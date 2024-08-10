import React from 'react';
import { Colors } from '../utils/Stylization';
import { Text as TextNative, StyleSheet } from 'react-native';

const Text = ({
    children,
    style = {},
    numberOfLines = 0,
    onPress = () => { },
    ellipsizeMode = 'tail',
}) => {
    return (
        <TextNative
            onPress={onPress}
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            style={{ ...styles.text, ...style }}
        >
            {children}
        </TextNative>
    )
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
