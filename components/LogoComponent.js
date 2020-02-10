import React from 'react';
import {StyleSheet, Image} from 'react-native';
import myfuncs from '../services/myFuncs';

export const LogoComponent = ( {} ) => {
    try {
        myfuncs.myBreadCrumbs('LogoComponent', 'LogoComponent');
        return (
            <Image style={styles.kibityImage}
                   source={require('./../assets/images/PurpleFace_512x512.png')}
                   opacity={1.0}
            />
        );
    } catch (error) {
        myfuncs.mySentry(error);
    }
};

const styles = StyleSheet.create({
    kibityImage: {
        width: 30,
        height: 30,
    },
});

