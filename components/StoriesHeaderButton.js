import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from "react-native";
import myStyles from "../myStyles";

export const StoriesHeaderButton = ( {buttonType, filterType, action} ) => {

    let text = "All";
    if (buttonType === 1 && filterType !== 1)
        text = "Faves";
    else if (buttonType === 2 && filterType !== 2)
        text = "PlayList";

    return (
        <View>
            <TouchableOpacity onPress={() => action()} hitSlop={styles.hitSlop}>
                <Text style={styles.myText}>Show</Text>
                <Text style={styles.myText}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({

    myText: {
        fontSize: 17,
        opacity: 1.0,
        color: 'purple',
        paddingHorizontal: 5,
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    }
});