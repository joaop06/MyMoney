import Text from './Text';
import Title from './Title';
import Button from './Button';
import { Colors } from '../utils/Stylization';
import { FlatList, StyleSheet } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions'

const List = ({
    data = [],
    style = {},
    renderItem = () => { }
}) => {
    return (
        <FlatList
            data={data}
            style={[styles.list, style]}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        width: ScreenWidth * 0.9,
        minHeight: ScreenHeight * 0.6,
        backgroundColor: Colors.transparent,
    },
});

export default List;
