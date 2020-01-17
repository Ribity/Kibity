import React, { Component } from "react";
import { View, TouchableWithoutFeedback, StyleSheet, Text } from "react-native";

export default class MyCard extends Component {
    constructor(props) {
        super(props);
        this.container = null;
    };

    render() {
        return (
            <View ref={container => (this.container = container)}
                style={styles.card}>
                <TouchableWithoutFeedback
                    onPress={() =>
                        this.container.measure(() =>  {
                            this.props.selectCard(this.props.story_idx);
                        })
                    }
                >
                    <View style={styles.card}>
                        <Text style={styles.storyTitle}>{this.props.story.title}</Text>
                        <Text style={styles.storyPublished}>{this.props.story.date_published}</Text>
                        <Text style={styles.storyNumLines}>Number of Lines: {this.props.story.num_lines}</Text>
                        <Text style={styles.storyNumLines}>{this.props.story.snippet}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    card: {
        height: 110,
        width: 400,
        borderRadius: 15,
        backgroundColor: "lightgrey",
        marginBottom: 10,
    },
    storyTitle: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'purple',
        textAlign: 'center',
    },
    storyPublished: {
        fontSize: 15,
        color: 'purple',
        textAlign: 'center',
    },
    storyNumLines: {
        fontSize: 15,
        color: 'purple',
        textAlign: 'center',
    },

});