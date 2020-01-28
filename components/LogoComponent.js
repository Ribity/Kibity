import React from 'react';
import {StyleSheet, Image} from 'react-native';
import myfuncs from '../services/myFuncs';

export default class LogoComponent extends React.Component {

    render() {
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
    }
}

const styles = StyleSheet.create({
    kibityImage: {
        // position: 'absolute',
        // bottom: 0,
        left: 5,
        width: 30,
        height: 30,
    },
});

