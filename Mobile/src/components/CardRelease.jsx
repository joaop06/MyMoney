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
                        size={25}
                        color={Colors.white}
                        name={iconName}
                    />
                }
            </Container>

            <Container style={styles.containerText}>
                <Container style={{ ...styles.containerText, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.category}>{'Categoria'}</Text>
                </Container>

                <Text style={styles.prefixAndSulfix}>
                    {value.toFixed(2).replace('.', ',')}
                </Text>
            </Container>

        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        height: ScreenHeight * 0.07,
        backgroundColor: Colors.blue_lighten,
    },
    containerIcon: {
        justifyContent: 'center',
        height: ScreenHeight * 0.07,
        maxWidth: ScreenWidth * 0.15,
        backgroundColor: Colors.transparent,
    },
    prefixAndSulfix: {
        fontSize: 15,
        marginBottom: 0,
        color: Colors.white,
        alignContent: 'center',
    },
    containerText: {
        flexDirection: 'row',
        height: ScreenHeight * 0.07,
        justifyContent: 'space-between',
        backgroundColor: Colors.transparent,
    },
    title: {
        fontSize: 15,
        marginBottom: 0,
        alignContent: 'center',
        color: Colors.grey_darken,
    },
    category: {
        fontSize: 12,
        marginTop: 2,
        color: Colors.grey_lighten,
    },
})

export default CardRelease;