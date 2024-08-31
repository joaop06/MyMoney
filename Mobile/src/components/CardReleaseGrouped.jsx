import Text from "./Text";
import Button from "./Button";
import Container from "./Container";
import { StyleSheet } from "react-native";
import { Colors } from "../utils/Stylization";
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CardReleaseGrouped = ({ item, navigateTo }) => {
    const { iconName, title, subtitle, value, icon, color } = item

    return (
        <Button style={{ button: styles.button }} navigateTo={navigateTo} >

            <Container style={styles.containerIcon}>
                <MaterialCommunityIcons
                    name={icon ?? iconName}
                    color={color ?? Colors.white}
                    size={ScreenHeight * 0.035}
                />
            </Container>

            <Container style={styles.containerText}>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </Container>

            <Container style={styles.containerPrice}>
                <Text style={styles.prefixAndSulfix}>
                    R$ {(value ?? '').toFixed(2).replace('.', ',')}
                </Text>
            </Container>
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        elevation: 5,
        margin: 'auto',
        flexDirection: 'row',
        width: ScreenWidth * 0.75,
        padding: ScreenHeight * 0.01,
        backgroundColor: Colors.white,
        maxHeight: ScreenHeight * 0.055,
        justifyContent: 'space-between',
        marginTop: ScreenHeight * 0.015,
    },
    containerIcon: {
        height: ScreenHeight,
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxWidth: ScreenWidth * 0.15,
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
        color: Colors.grey_darken,
        fontSize: ScreenWidth * 0.033,
    },
    subtitle: {
        marginTop: 2,
        color: Colors.grey,
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
        color: Colors.blue,
        alignContent: 'center',
        fontSize: ScreenWidth * 0.03,
    },
})

export default CardReleaseGrouped;