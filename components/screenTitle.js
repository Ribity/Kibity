import React from 'react';
import {View, Text} from "react-native";

export const ScreenTitle = (props) => {
    return (
        <View style={{alignItems: 'center'}}>
            <Text style = {{color: 'purple', fontWeight: 'bold', fontSize: 20}}>
                {props.title}
            </Text>
            {props.second &&
            <Text style = {{color: 'purple', fontWeight: 'bold', fontSize: 15}}>
                {props.second}
            </Text>
            }
        </View>
    );
};