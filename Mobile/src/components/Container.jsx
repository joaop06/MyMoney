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
        padding: 10,
        width: ScreenWidth,
        alignItems: 'center',
        height: ScreenHeight,
        backgroundColor: Colors.grey_lighten,
    },
});

export default Container;
