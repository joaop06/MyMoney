import Text from "./Text";
import Button from "./Button";
import Container from "./Container";
import { StyleSheet } from "react-native";
import { Colors } from "../utils/Stylization";
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CardRelease = ({ item, navigateTo }) => {
    const { prefix = 'icon', iconName, title, value } = item

    return (
        <Button style={{ button: styles.button }} navigateTo={navigateTo} >

            <Container style={styles.containerIcon}>
                {prefix !== 'icon' ?
                    <Text style={styles.prefixAndSulfix}>{prefix}</Text>
                    :
                    <MaterialCommunityIcons
                        name={iconName}
                        color={Colors.white}
                        size={ScreenHeight * 0.03}
                    />
                }
            </Container>

            <Container style={styles.containerText}>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
                <Text style={styles.category}>{'Categoria'}</Text>
            </Container>

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
        margin: 'auto',
        flexDirection: 'row',
        width: ScreenWidth * 0.7,
        maxHeight: ScreenHeight * 0.05,
        justifyContent: 'space-between',
        marginTop: ScreenHeight * 0.015,
        backgroundColor: Colors.blue_lighten_1,
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
        fontSize: ScreenWidth * 0.03,
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
        fontSize: ScreenWidth * 0.03,
    },
})

export default CardRelease;