import React from 'react';
import { Colors } from '../utils/Stylization'
import { Text, StyleSheet } from 'react-native';

const Title = ({ children, style = {} }) => {
    return <Text style={{ ...styles.title, ...style }}>{children}</Text>;
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: Colors.blue,
        fontWeight: 'bold',
    },
});

export default Title;
