import React from 'react';
import { TouchableOpacity,  StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class MyHelpExit extends React.Component {
    render() {
        return (
                <TouchableOpacity style={styles.floatingHelpExitIcon}
                                  onPress={this.props.onPress}
                                  hitSlop={styles.hitSlop}>
                        <Ionicons name="md-close-circle" size={30} color="black"/>
                </TouchableOpacity>
        );
    }
}

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
