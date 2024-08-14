import React from 'react';
import { Colors } from '../utils/Stylization';
import { View, StyleSheet } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const Container = ({ children, style = {} }) => {
    return <View style={{ ...styles.container, ...style }}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: ScreenWidth,
        alignItems: 'center',
        height: ScreenHeight,
        justifyContent: 'center',
        padding: ScreenWidth * 0.01,
        backgroundColor: Colors.grey_lighten_2,
    },
});

export default Container;
