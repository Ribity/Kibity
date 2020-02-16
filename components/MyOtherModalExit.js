import React from 'react';
import { TouchableOpacity,  StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import myfuncs from "../services/myFuncs";

export const MyOtherModalExit = ( {onPress} ) => {
    try {
        myfuncs.myBreadCrumbs('myOtherModalExit', 'MyOtherModalExit');
        return (
                <TouchableOpacity style={styles.floatingHelpExitIcon}
                                  onPress={onPress}
                                  hitSlop={styles.hitSlop}>
                        <Ionicons name="md-close-circle" size={30} color="black"/>
                </TouchableOpacity>
        );
    } catch (error) {
        myfuncs.mySentry(error);
    }
};

const styles = StyleSheet.create({
    floatingHelpExitIcon: {
        position: 'absolute',
        opacity: 1.0,
        bottom:  70,
        right: 1,
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    }
});
