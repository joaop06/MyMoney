import React from 'react';
import { Colors } from '../utils/Stylization';
import { View, StyleSheet } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const Div = ({ children, style = {} }) => {
    return <View style={{ ...styles.div, ...style }}>{children}</View>;
};

const styles = StyleSheet.create({
    div: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.transparent,
    },
});

export default Div;
