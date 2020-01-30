import React from 'react';
import {View, Text} from "react-native";
import MyDefines from "../constants/MyDefines"

export const ScreenTitle = (props) => {
    return (
        <View style={{alignItems: 'center'}}>
            <Text style = {{color: MyDefines.myHeaderTextColor, fontWeight: 'bold', fontSize: 20}}>
                {props.title}
            </Text>
            {props.second &&
            <Text style = {{color: MyDefines.myHeaderTextColor, fontWeight: 'bold', fontSize: 15}}>
                {props.second}
            </Text>
            }
        </View>
    );
};