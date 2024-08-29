import React from 'react';
import { Colors } from '../utils/Stylization'
import { Text, StyleSheet } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const Title = ({ children, style = {} }) => {
    return <Text style={{ ...styles.title, ...style }}>{children}</Text>;
};

const styles = StyleSheet.create({
    title: {
        color: Colors.blue,
        fontWeight: 'bold',
        fontSize: ScreenWidth * 0.045,
        marginBottom: ScreenHeight * 0.01,
    },
});

export default Title;
