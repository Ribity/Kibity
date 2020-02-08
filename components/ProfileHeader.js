import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from "react-native";

export const ProfileHeader = ( {profile, onPress} ) => {
    let text = "";
    if (profile !== undefined && profile !== null) {
        if (profile.character[0].name !== undefined && profile.character[0].name !== null)
            text = profile.character[0].name;
    }
    return (
        <View>
            <TouchableOpacity onPress={() => onPress()} hitSlop={styles.hitSlop}>
                <Text style={styles.myText}>Active Profile</Text>
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