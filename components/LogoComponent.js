import React from 'react';
import {StyleSheet, Image} from 'react-native';
import myfuncs from '../services/myFuncs';


export const LogoComponent = ( {} ) => {
    try {
        return (
            <Image style={styles.kibityImage}
                   source={require('./../assets/images/PurpleFaceIcon512.png')}
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

