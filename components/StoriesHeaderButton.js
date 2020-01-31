import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from "react-native";
import myStyles from "../myStyles";

export const StoriesHeaderButton = (props) => {

    let text = "All";
    if (props.buttonType === 1 && props.filterType !== 1)
        text = "Faves";
    else if (props.buttonType === 2 && props.filterType !== 2)
        text = "PlayList";

    return (
        <View>
            <TouchableOpacity onPress={() => props.action()} hitSlop={styles.hitSlop}>
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
        // alignItems: 'center',
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    }
});