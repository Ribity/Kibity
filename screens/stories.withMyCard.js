import React from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
} from "react-native";

import MyDefines from '../constants/MyDefines';
import MyCard from "../components/myCard";
import { updateStoryList } from '../actions/storyListActions';
import { updateStoryIdx } from '../actions/storyIdxActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class StoriesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            story_list: MyDefines.default_story_list,
            num_stories: 0,
        };
    };
    componentDidMount() {
        let my_story_list = require('../assets/allStoriesList.json');
        this.setState({story_list: my_story_list});
        this.props.updateStoryList(my_story_list);
        console.log(my_story_list);
        this.setState({num_stories: my_story_list.stories.length});

        // this.getItAndPlay();
    }
    goPlayIt = (idx) => {
        // this.setState({text: "clicked it"})
        console.log("selected: ", idx);
        this.props.updateStoryIdx(idx);
        this.props.navigation.navigate("Audio");
    };
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Select a story to play</Text>
                </View>
                <View style={{paddingTop: 5}}/>

                <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.list}
                    >
                        {this.state.story_list.stories.map((story, index) => (
                                <MyCard
                                key={index}
                                story={story}
                                story_idx={index}
                                selectCard={(idx) =>
                                    this.goPlayIt(idx)
                                }
                            />
                        ))}

                    </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "purple",
        justifyContent:'space-between',
        padding: 10,
    },
    title: {
        // height: 50,
        backgroundColor: "lightgrey",
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,

    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        // color: "goldenrod",
        // backgroundColor: "purple",

    },
    list: {
        alignItems: "center",
        paddingTop: 20,
    },
    card: {
        height: 200,
        width: 400,
        borderRadius: 15,
        // backgroundColor: "goldenrod",
        marginBottom: 20,
    },
    favoritesButton: {
        // alignItems: 'left',
        marginVertical: 4,
        marginHorizontal: 4,
        backgroundColor: 'purple',
    },

});

const mapStateToProps = (state) => {
    const { story_list } = state;
    return { story_list }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateStoryList,
        updateStoryIdx,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(StoriesScreen);
