import React, { useState } from 'react';
import { Colors } from '../utils/Stylization';
import { TextInput, StyleSheet } from 'react-native';
import { ScreenWidth, ScreenHeight } from '../utils/Dimensions';

const TextArea = ({
    value,
    label,
    style = {},
    placeholder,
    onChangeValue,
    editable = true,
    numberOfLines = 10,
    placeholderColor = Colors.grey_lighten_1,
}) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <TextInput
            label={label}
            value={value}
            multiline={true}
            editable={editable}
            placeholder={placeholder}
            onChangeText={onChangeValue}
            numberOfLines={numberOfLines}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor={placeholderColor}
            style={[styles.textArea(editable, isFocused), style]}
        />
    )
}

const styles = StyleSheet.create({
    textArea: (editable, isFocused) => {
        return {
            marginBottom: 5,
            paddingLeft: 15,
            borderRadius: 10,
            borderWidth: 1.5,
            color: Colors.black,
            flexDirection: 'row',
            width: ScreenWidth * 0.7,
            height: ScreenHeight * 0.1,
            opacity: editable ? 1 : 0.7,
            backgroundColor: editable ? Colors.white : Colors.grey_lighten_2,
            borderColor: editable && isFocused ? Colors.blue : Colors.grey_lighten_1,
        }
    },
})

export default TextArea;