import React from "react";
import {
    StyleSheet,
    Text,
    View,
    // ScrollView,
} from "react-native";

import MyDefines from '../constants/MyDefines';
// import MyCard from "../components/myCard";
import MyListComponent from '../components/MyListComponent';
import { updateStoryList } from '../actions/storyListActions';
import { updateStoryIdx } from '../actions/storyIdxActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

// let my_story_list =

class StoriesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            story_list: MyDefines.default_story_list,
        };
    };
    componentDidMount() {
        this.buildStoryList();
        // setTimeout(this.buildStoryList, 1000);  // mk1 be sure to clear the timeout on unmount
        this.buildStoryList();  // mk1 be sure to clear the timeout on unmount

        console.log("StoriesScreen DidMount:", this.props.story_list);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log("GetDerivedStateFromProps StoriesScreen");
        if (prevState.story_list !== nextProps.story_list) {
            console.log("StoriesScreen next props:", nextProps.story_list);
            return{data: nextProps.story_list};
        } else return null;
    };
    // componentDidUpdate(prevProps, prevState) {
    //     console.log("StoriesScreenDidUpdate");
    // }
    buildStoryList = () => {
        let my_story_list = require('../assets/allStoriesList.json');
        this.setState({story_list: my_story_list});
        this.props.updateStoryList(my_story_list);
        this.setState({data: this.props.story_list});
        console.log("StoryList:", this.props.story_list);
    };
    onPressStorySelection = (story, idx) => {
        console.log("onPressStorySelection:", idx );
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

                {this.props.story_list.stories.length > 1 &&
                <MyListComponent navigation={this.props.navigation}
                                 myList={this.state.story_list.stories}
                                 screenType={'Stories'}
                                 onPressItem={this.onPressStorySelection}/>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "purple",
        justifyContent:'center',
        alignItems: 'center',
        paddingTop: 25,
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
