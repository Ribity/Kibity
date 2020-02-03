import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from "react-native";

export const ProfileHeader = (props) => {
    let text = "";
    if (props.profile !== undefined && props.profile !== null) {
        if (props.profile.mainChar !== undefined && props.profile.mainChar !== null)
            text = props.profile.mainChar;
    }
    return (
        <View>
            <TouchableOpacity onPress={() => props.action()} hitSlop={styles.hitSlop}>
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
        paddingRight: 5,
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    }
});