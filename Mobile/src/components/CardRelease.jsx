import Text from "./Text";
import Button from "./Button";
import Container from "./Container";
import { StyleSheet } from "react-native";
import { Colors } from "../utils/Stylization";
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const CardRelease = ({ item, navigateTo }) => {
    const { date, title, value } = item

    return (
        <Button style={{ button: styles.button }} navigateTo={navigateTo} >

            <Container style={styles.containerIcon}>
                <Text style={styles.prefixAndSulfix}>{date}</Text>
            </Container>

            <Text numberOfLines={1} style={styles.title}>{title}</Text>

            <Container style={styles.containerPrice}>
                <Text style={styles.prefixAndSulfix}>
                    R$ {value.toFixed(2).replace('.', ',')}
                </Text>
            </Container>
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        elevation: 7,
        margin: 'auto',
        flexDirection: 'row',
        width: ScreenWidth * 0.8,
        padding: ScreenHeight * 0.01,
        maxHeight: ScreenHeight * 0.055,
        justifyContent: 'space-between',
        marginTop: ScreenHeight * 0.015,
        backgroundColor: Colors.blue_lighten_1,
    },
    containerIcon: {
        height: ScreenHeight,
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxWidth: ScreenWidth * 0.2,
        maxHeight: ScreenHeight * 0.05,
        backgroundColor: Colors.transparent,
    },
    containerText: {
        height: ScreenHeight,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxHeight: ScreenHeight * 0.05,
        backgroundColor: Colors.transparent,
    },
    title: {
        marginBottom: 0,
        color: Colors.white,
        fontSize: ScreenWidth * 0.04,
    },
    category: {
        marginTop: 2,
        color: Colors.white,
        fontSize: ScreenWidth * 0.03,
    },
    containerPrice: {
        height: 100,
        alignItems: 'flex-end',
        justifyContent: 'center',
        maxWidth: ScreenWidth * 0.24,
        backgroundColor: Colors.transparent,
    },
    prefixAndSulfix: {
        marginBottom: 0,
        color: Colors.white,
        alignContent: 'center',
        fontSize: ScreenWidth * 0.035,
    },
})

export default CardRelease;