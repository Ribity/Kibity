import React from 'react';
import {Text, View, TouchableOpacity} from "react-native";
import myStyles from "../myStyles";

export const StoriesHeaderButton = (props) => {
    return (
        <View>
        {props.numItems > 0 &&
            <TouchableOpacity onPress={() => props.action()}>
                <Text style={myStyles.myHeaderText}>{props.myText}</Text>
            </TouchableOpacity>
        }
        </View>
    );
};