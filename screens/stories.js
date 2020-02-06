import React from "react";
import {
    StyleSheet,
    Text, TouchableOpacity,
    View,
    // ScrollView,
} from "react-native";

import MyDefines from '../constants/MyDefines';
import MyListComponent from '../components/MyListComponent';
import { setStoryIdx, setListType, setListIdx} from '../actions/profilesActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Ionicons} from '@expo/vector-icons';
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";
import {SafeAreaView} from "react-navigation";
import myfuncs from "../services/myFuncs";
import {ScreenTitle} from "../components/screenTitle";
import {StoriesHeaderButton} from "../components/StoriesHeaderButton";
import * as Speech from "expo-speech";


// let my_story_list =

class StoriesScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AudioScreen');
            const { params = {} } = navigation.state;
            return {
                headerLeft: () =>
                    <StoriesHeaderButton buttonType={1}
                                         numItems={params.numFaves}
                                         action={params.getLeft}
                                         filterType={params.filterType}
                    />,
                headerTitle: () => <ScreenTitle title={"Stories"} second={params.activeProfile} />,
                headerRight: () =>
                    <StoriesHeaderButton buttonType={2}
                                         numItems={params.numList}
                                         action={params.getRight}
                                         filterType={params.filterType}
                    />,

            };
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            story_list: MyDefines.default_story_list,
            profiles: MyDefines.default_profiles,
            filterType: 0,
        };
        this.componentWillFocus = this.componentWillFocus.bind(this);
    };
    componentDidMount() {
        // setTimeout(this.buildStoryList, 1000);  // mk1 be sure to clear the timeout on unmount
        this.populateStateStoryList();  // mk1 be sure to clear the timeout on unmount

        this.subs = [
            this.props.navigation.addListener('willFocus', this.componentWillFocus),
        ];

        this.props.navigation.setParams({getRight: this.listList});
        this.props.navigation.setParams({getLeft: this.listFaves});
        this.props.navigation.setParams({numFaves: this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length});
        this.props.navigation.setParams({activeProfile: this.props.profiles.profile[this.props.profiles.profilesIdx].mainChar});
        this.props.navigation.setParams({filterType: this.state.filterType});
        // console.log("StoriesScreen DidMount:", this.props.story_list);
    }
    componentWillFocus() {
        try {
            this.props.navigation.setParams({activeProfile: this.props.profiles.profile[this.props.profiles.profilesIdx].mainChar});
        } catch (error) {
            // myfuncs.mySentry(error);
        }
    }
    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());  // removes the componentWillFocus listener
    };
    listList = () => {
        try {
            myfuncs.myBreadCrumbs('getRight', this.props.navigation.state.routeName);
            if (this.state.filterType === 2) {
                this.setState({filterType: 0});
                this.props.navigation.setParams({filterType: 0});
            } else {
                this.setState({filterType: 2});
                this.props.navigation.setParams({filterType: 2});
            }
            if (MyDefines.log_details)
                console.log("PressedRight");
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    listFaves = () => {
        try {
            myfuncs.myBreadCrumbs('listFaves', this.props.navigation.state.routeName);
            if (this.state.filterType === 1) {
                this.setState({filterType: 0});
                this.props.navigation.setParams({filterType: 0});
            } else {
                this.setState({filterType: 1});
                this.props.navigation.setParams({filterType: 1});
            }
            if (MyDefines.log_details)
                console.log("PressedLeft");
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    resetFilter = () => {
        try {
            myfuncs.myBreadCrumbs('resetFilter', this.props.navigation.state.routeName);
            this.setState({filterType: 0});
            this.props.navigation.setParams({filterType: 0});
            if (MyDefines.log_details)
                console.log("ResetFilter");
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };

    // static getDerivedStateFromProps(nextProps, prevState){
    //     console.log("GetDerivedStateFromProps StoriesScreen");
    //     if (prevState.story_list !== nextProps.story_list) {
    //         // console.log("StoriesScreen next props:", nextProps.story_list);
    //         return{data: nextProps.story_list};
    //     } else return null;
    // };
    static getDerivedStateFromProps(nextProps, prevState){
        let update = {};

        if (MyDefines.log_details)
            console.log("stories getDerivedStateFromProps");
        if (prevState.stories_list !== nextProps.stories_list) {
            update.stories_list = nextProps.stories_list;
        }
        if (prevState.profiles !== nextProps.profiles) {
            update.profiles = nextProps.profiles;
        }
        if (MyDefines.log_details)
            console.log("stories derivedState:", update);
        return Object.keys(update).length ? update: null;
    };
    componentDidUpdate(prevProps, prevState) {
        // this.props.navigation.setParams({activeProfile: this.props.profiles.profile[this.props.profiles.profilesIdx].mainChar});
        console.log("StoriesScreenDidUpdate");
    }
    populateStateStoryList = () => {
        if (MyDefines.log_details)
            console.log("populateStoryList in StoriesScreen");
        this.setState({story_list: this.props.story_list});
    };
    updateStoriesProfiles = () => {
        console.log("updateStoriesCurrentProfile");
        this.setState({profiles: this.props.profiles});
        this.props.navigation.setParams({numFaves: this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length});
        this.props.navigation.setParams({numList: this.props.profiles.profile[this.props.profiles.profilesIdx].playList.length});
        this.updateStorage();
    };
    updateStorage = () => {
        myfuncs.writeUserDataToLocalStorage("user_profiles", this.props.profiles);
        // console.log("storage updated NewProfiles:", this.props.profiles);
    };
    onPressStorySelection = (story, idx) => {
        // console.log("onPressStorySelection:", idx );
        this.props.setListType(0);
        this.props.setStoryIdx(idx);
        this.props.navigation.navigate("Audio", {storySelected: true});
    };
    playFavorites = () => {
        // console.log("Play faves");
        if (this.state.profiles.profile[this.props.profiles.profilesIdx].favorites.length) {
            this.props.setListType(1);
            this.props.setListIdx(0);
            this.props.setStoryIdx(this.state.profiles.profile[this.props.profiles.profilesIdx].favorites[0]);
            this.props.navigation.navigate("Audio", {storySelected: true});
        }
    };
    playPlayList = () => {
        // console.log("Play PlayList");
        if (this.state.profiles.profile[this.props.profiles.profilesIdx].playList.length) {
            this.props.setListType(2);
            this.props.setListIdx(0);
            this.props.setStoryIdx(this.state.profiles.profile[this.props.profiles.profilesIdx].playList[0]);
            this.props.navigation.navigate("Audio", {storySelected: true});
        }
    };
    render() {
        // if (this.state.story_list.stories.length !== myListLength)
        //     unMount the MyListComponent;

        return (
            <View style={styles.container}>
                <View style={styles.topRow}>

                    {(this.state.profiles.profile[this.props.profiles.profilesIdx].favorites.length > 0) &&
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

                    {(this.state.profiles.profile[this.props.profiles.profilesIdx].playList.length > 0) &&
                        <View>
                        <TouchableOpacity onPress={this.playPlayList}>
                            <View style={styles.playList}>
                                <Ionicons name={"ios-list-box"} size={30} color={'goldenrod'}/>
                                <View>
                                    <Text style={styles.pText}>Play</Text>
                                    <Text style={styles.pText}>PlayList</Text>
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
                                 updateParentStoriesCurrentProfile={this.updateStoriesProfiles}
                                 resetFilter={this.resetFilter}
                                 onPressItem={this.onPressStorySelection}
                                 filterType={this.state.filterType}
                />
                }
                <MyHelpIcon onPress={this.onHelpPress}/>
                <MyHelpModal screen={"Stories"}
                             onExitPress={this.onHelpExitPress}
                             isVisible={this.state.isModalVisible}/>
            </View>
        );
    }
    onHelpPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: true});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    onHelpExitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpExitPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: false});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
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
        paddingRight: 5,
    },
    playList: {
        flexDirection: 'row',
        paddingLeft: 5,
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
    favoritesButton: {
        // alignItems: 'left',
        marginVertical: 4,
        marginHorizontal: 4,
        backgroundColor: 'purple',
    },

});

const mapStateToProps = (state) => {
    const { story_list } = state;
    const { profiles } = state;
    return { story_list, profiles }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setListType,
        setListIdx,
        setStoryIdx,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(StoriesScreen);
