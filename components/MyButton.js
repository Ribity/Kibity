import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import myStyles from "../myStyles";

export const MyButton = ( {buttonStyle, textStyle, onPress, title} ) => {
    let bStyle = myStyles.regularButton;
    let tStyle = myStyles.regularButtonText;
    if (buttonStyle) {
        bStyle = {...bStyle, ...buttonStyle};
    }
    if (tStyle) {
        tStyle = {...tStyle, ...textStyle};
    }
    return (
        <View>
            <TouchableOpacity style={bStyle} onPress={onPress}>
                <Text style={tStyle}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};