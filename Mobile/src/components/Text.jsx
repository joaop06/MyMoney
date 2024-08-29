import React from 'react';
import { Colors } from '../utils/Stylization';
import { Text as TextNative, StyleSheet } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

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
        fontWeight: 'bold',
        color: Colors.grey_darken,
        fontSize: ScreenWidth * 0.035,
    },
});

export default Text;
