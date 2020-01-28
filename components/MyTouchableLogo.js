import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import LogoComponent from "./LogoComponent";

export default class MyTouchableLogo extends React.Component {
    render() {
        return (
                <TouchableOpacity onPress={() => this.props.onPress()} hitSlop={styles.hitSlop}>
                    <LogoComponent/>
                </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    hitSlop: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
    }
});