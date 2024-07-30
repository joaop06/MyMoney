import React from "react";
import Text from "./Text";
import Button from "./Button";
import Container from "./Container";
import Modal from 'react-native-modal';
import { StyleSheet } from "react-native";
import { Colors } from '../utils/Stylization';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const Alert = ({ isVisible, onCancel, onConfirm, stylization }) => {

    stylization

    return (
        <Modal isVisible={isVisible}>
            <Container style={styles.container}>

                <Text style={styles.title}>Deseja Sair?</Text>

                <Container style={styles.buttonContainer}>

                    <Button onPress={onCancel} style={{ button: styles.button, text: styles.cancelButtonText }} >
                        Cancelar
                    </Button>

                    <Button onPress={onConfirm} style={{ button: styles.button, text: styles.confirmButtonText }} >
                        Sair
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
        maxHeight: ScreenHeight * 0.18,
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        color: Colors.black,
    },
    buttonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        width: ScreenWidth * 0.8,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    button: {
        marginHorizontal: 10,
        width: ScreenWidth * 0.3,
        backgroundColor: Colors.transparent,
    },
    cancelButtonText: {
        color: Colors.red
    },
    confirmButtonText: {
        color: Colors.blue,
    },
})

export default Alert;