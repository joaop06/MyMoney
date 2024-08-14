import { Colors } from '../utils/Stylization';
import { FlatList, StyleSheet, View } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions'

const List = ({
    data = [],
    style = {},
    renderItem = () => { },
    listEmptyComponent = () => null
}) => {
    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            style={[styles.list, style]}
            keyExtractor={item => item.id}
            ListEmptyComponent={listEmptyComponent}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        borderRadius: 10,
        width: ScreenWidth * 0.9,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: Colors.grey_lighten_2,
    },
});

export default List;
