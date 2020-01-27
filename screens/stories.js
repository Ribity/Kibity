import React from "react";
import {
    StyleSheet,
    Text, TouchableOpacity,
    View,
    // ScrollView,
} from "react-native";

import MyDefines from '../constants/MyDefines';
// import MyCard from "../components/myCard";
import MyListComponent from '../components/MyListComponent';
import { setStoryIdx, setListType, setListIdx} from '../actions/currentProfileActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Ionicons} from '@expo/vector-icons';


// let my_story_list =

class StoriesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            story_list: MyDefines.default_story_list,
            current_profile: MyDefines.default_current_profile,
        };
    };
    componentDidMount() {
        // setTimeout(this.buildStoryList, 1000);  // mk1 be sure to clear the timeout on unmount
        this.populateStateStoryList();  // mk1 be sure to clear the timeout on unmount

        // console.log("StoriesScreen DidMount:", this.props.story_list);
    }

    // static getDerivedStateFromProps(nextProps, prevState){
    //     console.log("GetDerivedStateFromProps StoriesScreen");
    //     if (prevState.story_list !== nextProps.story_list) {
    //         // console.log("StoriesScreen next props:", nextProps.story_list);
    //         return{data: nextProps.story_list};
    //     } else return null;
    // };
    static getDerivedStateFromProps(nextProps, prevState){
        let update = {};

        console.log("stories getDerivedStateFromProps");
        if (prevState.stories_list !== nextProps.stories_list) {
            update.stories_list = nextProps.stories_list;
        }
        if (prevState.current_profile !== nextProps.current_profile) {
            update.current_profile = nextProps.current_profile;
        }
        console.log("stories derivedState:", update);
        return Object.keys(update).length ? update: null;
    };
    // componentDidUpdate(prevProps, prevState) {
    //     this.setState({story_list: this.props.story_list});
    //     console.log("StoriesScreenDidUpdate");
    // }
    populateStateStoryList = () => {
        console.log("populateStoryList in StoriesScreen");
        this.setState({story_list: this.props.story_list});
    };
    updateStoriesCurrentProfile = () => {
        // console.log("updateStoriesCurrentProfile");
        this.setState({current_profile: this.props.current_profile});
    };
    onPressStorySelection = (story, idx) => {
        // console.log("onPressStorySelection:", idx );
        this.props.setListType(0);
        this.props.setStoryIdx(idx);
        this.props.navigation.navigate("Audio");
    };
    playFavorites = () => {
        // console.log("Play faves");
        if (this.state.current_profile.favorites.length) {
            this.props.setListType(1);
            this.props.setListIdx(0);
            this.props.setStoryIdx(this.state.current_profile.favorites[0]);
            this.props.navigation.navigate("Audio");
        }
    };
    playPlayList = () => {
        // console.log("Play PlayList");
        if (this.state.current_profile.playList.length) {
            this.props.setListType(2);
            this.props.setListIdx(0);
            this.props.setStoryIdx(this.state.current_profile.playList[0]);
            this.props.navigation.navigate("Audio");
        }
    };
    render() {
        // if (this.state.story_list.stories.length !== myListLength)
        //     unMount the MyListComponent;

        return (
            <View style={styles.container}>
                <View style={styles.topRow}>

                    {(this.state.current_profile.favorites.length > 0) &&
                    <View>
                        <TouchableOpacity onPress={this.playFavorites}>
                            <View style={styles.faves}>
                                <View>
                                    <Text style={styles.pText}> Play</Text>
                                    <Text style={styles.pText}>Faves</Text>
                                </View>
                                <Ionicons name={"ios-heart"} size={30} color={'red'}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    }

                    <View style={styles.title}>
                        <Text style={styles.titleText}>Select a story</Text>
                    </View>

                    {(this.state.current_profile.playList.length > 0) &&
                        <View>
                        <TouchableOpacity onPress={this.playPlayList}>
                            <View style={styles.playList}>
                                <Ionicons name={"ios-list-box"} size={30} color={'goldenrod'}/>
                                <View>
                                    <Text style={styles.pText}>Play</Text>
                                    <Text style={styles.pText}>List</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        </View>
                    }
                </View>
                <View style={{paddingTop: 5}}/>

                {this.state.story_list.stories.length > 1 &&
                <MyListComponent navigation={this.props.navigation}
                                 myList={this.state.story_list.stories}
                                 screenType={'Stories'}
                                 updateParentStoriesCurrentProfile={this.updateStoriesCurrentProfile}
                                 onPressItem={this.onPressStorySelection}/>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "purple",
        justifyContent:'center',
        alignItems: 'center',
        paddingTop: 25,
    },
    topRow: {
        // flex: 1,
        flexDirection: 'row',
        // justifyContent: 'space-around',
        // alignItems: 'stretch'
    },
    faves: {
        flexDirection: 'row',
        paddingRight: 15,
    },
    playList: {
        flexDirection: 'row',
        paddingLeft: 15,
    },
    pText: {
        color: 'goldenrod',
    },
    title: {
        // height: 50,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "lightgrey",
        // borderRadius: 15,

    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "goldenrod",
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
    const { current_profile } = state;
    return { story_list, current_profile }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setListType,
        setListIdx,
        setStoryIdx,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(StoriesScreen);
