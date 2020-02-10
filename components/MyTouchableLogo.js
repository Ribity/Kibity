import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {LogoComponent} from "./LogoComponent";
import myfuncs from "../services/myFuncs";

export const MyTouchableLogo = ( {imageStyle, onPress} ) => {
    try {
        myfuncs.myBreadCrumbs('MyTouchableLogo', 'MyTouchableLogo');
        let iStyle = {};

        if (imageStyle)
            iStyle = {...iStyle, ...imageStyle};

        return (
                <TouchableOpacity style={iStyle} onPress={() => onPress()} hitSlop={styles.hitSlop}>
                    <LogoComponent/>
                </TouchableOpacity>
        );
    } catch (error) {
        myfuncs.mySentry(error);
    }
};

const styles = StyleSheet.create({
    hitSlop: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
    }
});