import React from "react";
import Text from "./Text";
import Button from "./Button";
import Container from "./Container";
import Modal from 'react-native-modal';
import { StyleSheet } from "react-native";
import { Colors } from '../utils/Stylization';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const Alert = ({
    onCancel,
    onConfirm,
    isVisible = false,
    content = { title: '', cancel: '', confirm: '' },
}) => {
    const { title, cancel, confirm } = content

    return (
        <Modal isVisible={isVisible}>
            <Container style={styles.container}>

                <Text style={styles.title}>{title}</Text>

                <Container style={styles.buttonContainer}>

                    <Button onPress={onCancel} style={{ button: styles.button('cancel'), text: styles.cancelButtonText }} >
                        {cancel}
                    </Button>

                    <Button onPress={onConfirm} style={{ button: styles.button('confirm'), text: styles.confirmButtonText }} >
                        {confirm}
                    </Button>

                </Container>

            </Container>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        alignItems: 'center',
        maxWidth: ScreenWidth * 0.9,
        backgroundColor: Colors.white,
        maxHeight: ScreenHeight * 0.2,
        paddingVertical: ScreenHeight * 0.02,
        paddingHorizontal: ScreenWidth * 0.05,
    },
    title: {
        textAlign: 'center',
        color: Colors.black,
        fontSize: ScreenWidth * 0.04,
        marginBottom: ScreenHeight * 0.02,
    },
    buttonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        width: ScreenWidth * 0.8,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    button: (type) => {
        return {
            borderWidth: 1,
            borderRadius: 10,
            marginHorizontal: 10,
            width: ScreenWidth * 0.3,
            paddingHorizontal: ScreenWidth * 0.05,
            paddingVertical: ScreenHeight * 0.015,
            borderColor: type === 'cancel' ? Colors.blue_lighten_1 : Colors.transparent,
            backgroundColor: type === 'cancel' ? Colors.blue_lighten_3 : Colors.red_lighten_2,
        }
    },
    cancelButtonText: {
        color: Colors.blue,
        textAlign: 'center',
        fontSize: ScreenWidth * 0.04,
    },
    confirmButtonText: {
        color: Colors.red,
        textAlign: 'center',
        fontSize: ScreenWidth * 0.04,
    },
})

export default Alert;