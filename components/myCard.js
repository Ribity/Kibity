import React, { Component } from "react";
import { View, TouchableWithoutFeedback, StyleSheet } from "react-native";

export default class myCard extends Component {
    constructor(props) {
        super(props);
        this.container = null;
    };

    render() {
        return (
            <View ref={container => (this.container = container)}>
                <TouchableWithoutFeedback
                    onPress={() =>
                        this.container.measure(() => {
                            this.props.selectCard(this.props.id);
                        })
                    }
                >
                    <View style={styles.card} />
                </TouchableWithoutFeedback>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    card: {
        height: 200,
        width: 200,
        borderRadius: 3,
        backgroundColor: "#5cdb95",
        marginBottom: 20
    }
});