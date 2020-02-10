import React from 'react';
import {View, Text} from "react-native";
import MyDefines from "../constants/MyDefines"
import myfuncs from "../services/myFuncs";

export const ScreenTitle = ( {title, second}) => {
    try {
        myfuncs.myBreadCrumbs('StoriesHeaderButton', 'StoriesHeaderButton');
        return (
            <View style={{alignItems: 'center'}}>
                <Text style = {{color: MyDefines.myHeaderTextColor, fontWeight: 'bold', fontSize: 20}}>
                    {title}
                </Text>
                {second &&
                <Text style = {{color: MyDefines.myHeaderTextColor, fontWeight: 'bold', fontSize: 15}}>
                    {second}
                </Text>
                }
            </View>
        );
    } catch (error) {
        myfuncs.mySentry(error);
    }
};