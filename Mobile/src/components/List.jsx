import React, { forwardRef } from 'react';
import { Colors } from '../utils/Stylization';
import { ScreenWidth } from '../utils/Dimensions'
import { FlatList, StyleSheet } from 'react-native';

const List = forwardRef(({
    data = [],
    style = {},
    horizontal = false,
    scrollEnabled = true,
    renderItem = () => { },
    listEmptyComponent = () => null,
    keyExtractor = (item) => item.id,
    showsHorizontalScrollIndicator = false,
}, ref) => {
    return (
        <FlatList
            ref={ref}
            data={data}
            horizontal={horizontal}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={[styles.list, style]}
            scrollEnabled={scrollEnabled}
            ListEmptyComponent={listEmptyComponent}
            showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        />
    );
});

const styles = StyleSheet.create({
    list: {
        elevation: 2,
        borderRadius: 10,
        width: ScreenWidth * 0.9,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: Colors.grey_lighten_2,
    },
});

export default List;
