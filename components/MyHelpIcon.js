import React from 'react';
import { TouchableOpacity,  StyleSheet, Text} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class MyHelpIcon extends React.Component {
    render() {
        return (
                <TouchableOpacity style={[styles.floatingHelpIcon, this.props.isAdmob && {bottom: 80}]}
                                  onPress={this.props.onPress}
                                  hitSlop={styles.hitSlop}>
                        <Ionicons name="md-help-circle" size={30} color="mediumpurple"/>
                </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    floatingHelpIcon: {
        position: 'absolute',
        opacity: .4,
        bottom:  20,
        right: 10,
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    }
});
