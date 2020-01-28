import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import myStyles from "../myStyles";

export default class MyButton extends React.Component {
    render() {
        let buttonStyle = myStyles.regularButton;
        let textStyle = myStyles.regularButtonText;
        if (this.props.buttonStyle) {
            buttonStyle = this.props.buttonStyle;
        }
        if (this.props.textStyle) {
            textStyle = this.props.textStyle;
        }
        return (
            <View>
                <TouchableOpacity style={buttonStyle} onPress={this.props.onPress}>
                    <Text style={textStyle}>{this.props.title}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}