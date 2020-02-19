import React from "react";
import {
    StyleSheet,
    Text, TouchableOpacity,
    View,
} from "react-native";

import MyDefines from '../constants/MyDefines';
import MyListComponent from '../components/MyListComponent';
import { setStoryIdx, setListType, setListIdx} from '../actions/profilesActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Ionicons} from '@expo/vector-icons';
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";
import {MyOtherModal} from "../components/MyOtherModal";
import myfuncs from "../services/myFuncs";
import {ScreenTitle} from "../components/screenTitle";
import {StoriesHeaderButton} from "../components/StoriesHeaderButton";
import Toast from "react-native-easy-toast";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

let populated_length = 0;

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
                                         listType={params.listType}
                    />,
                headerTitle: () => <ScreenTitle title={params.num_stories + " Stories"}
                                                second={"Active: " + params.activeProfile}/>,
                headerRight: () =>
                    <StoriesHeaderButton buttonType={2}
                                         numItems={params.numList}
                                         action={params.getRight}
                                         listType={params.listType}
                    />,

            };
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            stories: MyDefines.default_story_list.stories,
            profiles: MyDefines.default_profiles,
            listType: 0,
            showType: 0,
            otherFilter: "",
            isOtherModalVisible: false,
        };
        this.componentWillFocus = this.componentWillFocus.bind(this);
    };
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('Did mount', this.props.navigation.state.routeName);

            // console.log("StoriesScreen DidMount:", this.props.stories);

            // setTimeout(this.buildStoryList, 1000);  // mk1 be sure to clear the timeout on unmount
            this.populateStateStoryList();  // mk1 be sure to clear the timeout on unmount

            this.subs = [
                this.props.navigation.addListener('willFocus', this.componentWillFocus),
            ];

            this.props.navigation.setParams({getRight: this.listList});
            this.props.navigation.setParams({getLeft: this.listFaves});
            this.props.navigation.setParams({num_stories: this.props.story_list.stories.length});
            this.props.navigation.setParams({numFaves: this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length});
            let aProfile = myfuncs.shortenName(this.props.profiles.profile[this.props.profiles.profilesIdx].character[0].name, 12);
            this.props.navigation.setParams({activeProfile: aProfile});
            this.props.navigation.setParams({listType: this.state.listType});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    }
    componentWillFocus() {
        try {
            myfuncs.myBreadCrumbs('Will Focus', this.props.navigation.state.routeName);
            let aProfile = myfuncs.shortenName(this.props.profiles.profile[this.props.profiles.profilesIdx].character[0].name, 12);
            this.props.navigation.setParams({activeProfile: aProfile});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    }
    componentWillUnmount() {
        try {
            myfuncs.myBreadCrumbs('Will UnMount', this.props.navigation.state.routeName);
            this.subs.forEach(sub => sub.remove());  // removes the componentWillFocus listener
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    static getDerivedStateFromProps(nextProps, prevState){
        try {
            myfuncs.myBreadCrumbs('getDerivedStateFromProps', "Stories");
            let update = {};

            if (MyDefines.log_details)
                console.log("stories getDerivedStateFromProps");
            if (prevState.profiles !== nextProps.profiles) {
                update.profiles = nextProps.profiles;
            }
            if (MyDefines.log_details)
                console.log("stories derivedState:", update);
            return Object.keys(update).length ? update: null;
        } catch (error) {
            myfuncs.mySentry(error);
            return null;
        }
    };
    componentDidUpdate(prevProps, prevState) {
        // console.log("popLength:", populated_length, "thisProps: ", this.props.story_list.stories.length)
        if (this.props.story_list.stories.length !== populated_length) {
            this.populateStateStoryList();
        }
    }
    listList = () => {
        try {
            myfuncs.myBreadCrumbs('listList', this.props.navigation.state.routeName);
            if (this.state.listType === 2) {
                this.setState({listType: 0});
                this.props.navigation.setParams({listType: 0});
            } else {
                this.setState({listType: 2});
                this.props.navigation.setParams({listType: 2});
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
            if (this.state.listType === 1) {
                this.setState({listType: 0});
                this.props.navigation.setParams({listType: 0});
            } else {
                this.setState({listType: 1});
                this.props.navigation.setParams({listType: 1});
            }
            if (MyDefines.log_details)
                console.log("PressedLeft");
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    resetList = () => {
        try {
            myfuncs.myBreadCrumbs('resetList', this.props.navigation.state.routeName);
            this.setState({listType: 0});
            this.props.navigation.setParams({listType: 0});
            if (MyDefines.log_details)
                console.log("ResetList");
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    populateStateStoryList = () => {
        try {
            myfuncs.myBreadCrumbs('populateStateStoryList', this.props.navigation.state.routeName);
            if (MyDefines.log_details)
                console.log("populateStoryList in StoriesScreen");

            // console.log("PopulateStateStoryList");
            populated_length = this.props.story_list.stories.length;

                // let mylist = {...this.props.story_list};
            let mylist = JSON.parse(JSON.stringify(this.props.story_list));

            // mylist.stories.sort(function(a, b){  // This sorts reverse chronologically
            //     return b.story_num-a.story_num
            // });
            mylist.stories.sort(function(a, b){
                return a.sortIdx-b.sortIdx
            });
            // console.log("populate", this.props.story_list);

            this.setState({stories: mylist.stories});
            // console.log("StateList:", mylist.stories);
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    updateStoriesProfiles = () => {
        try {
            myfuncs.myBreadCrumbs('updateStoriesProfiles', this.props.navigation.state.routeName);

            // console.log("updateStoriesProfile");
            this.setState({profiles: this.props.profiles});
            this.props.navigation.setParams({numFaves: this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length});
            this.props.navigation.setParams({numList: this.props.profiles.profile[this.props.profiles.profilesIdx].playList.length});
            this.updateStorage();
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    updateStorage = () => {
        try {
            myfuncs.myBreadCrumbs('updateStorage', this.props.navigation.state.routeName);
            myfuncs.writeUserDataToLocalStorage("user_profiles", this.props.profiles);
            // console.log("storage updated NewProfiles:", this.props.profiles);
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    onPressStorySelection = async (idx) => {
        try {
            myfuncs.myBreadCrumbs('onPressStorySelection', this.props.navigation.state.routeName);
            await this.props.setListType(0);
            await this.props.setStoryIdx(idx);
            // console.log(this.props.story_list);
            this.props.navigation.navigate("Audio", {storySelected: true});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    playFavorites = () => {
        try {
            myfuncs.myBreadCrumbs('playFavorites', this.props.navigation.state.routeName);
            if (this.state.profiles.profile[this.props.profiles.profilesIdx].favorites.length) {
                this.props.setListType(1);
                this.props.setListIdx(0);
                this.props.setStoryIdx(this.state.profiles.profile[this.props.profiles.profilesIdx].favorites[0]);
                this.props.navigation.navigate("Audio", {storySelected: true});
            }
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    playPlayList = () => {
        try {
            myfuncs.myBreadCrumbs('playPlayList', this.props.navigation.state.routeName);
            if (this.state.profiles.profile[this.props.profiles.profilesIdx].playList.length) {
                this.props.setListType(2);
                this.props.setListIdx(0);
                this.props.setStoryIdx(this.state.profiles.profile[this.props.profiles.profilesIdx].playList[0]);
                this.props.navigation.navigate("Audio", {storySelected: true});
            }
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
            // console.log("render story list");
            return (
                <View style={styles.container}>

                    <View style={styles.secondRow}>

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
                            <TouchableOpacity onPress={this.showToast}>
                                <Text style={styles.titleText}>Select a story</Text>
                            </TouchableOpacity>
                        </View>

                        {(this.state.profiles.profile[this.props.profiles.profilesIdx].playList.length > 0) &&
                            <View>
                            <TouchableOpacity onPress={this.playPlayList}>
                                <View style={styles.playList}>
                                    <Ionicons name={"ios-list-box"} size={30} color={'goldenrod'}/>
                                    <View style={{marginLeft: 2}}>
                                        <Text style={styles.pText}>Play</Text>
                                        <Text style={styles.pText}>PlayList</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            </View>
                        }
                    </View>

                    <View style={styles.showRow}>
                        {/*<Text style={styles.showTextGold}>Filter: </Text>*/}

                        <TouchableOpacity onPress={() => this.setFilterType(0, "")}>
                            <Text style={(this.state.showType === 0) ? styles.showTextGold : styles.showText}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setFilterType(1, "Toddler")}>
                            <Text style={(this.state.showType === 1) ? styles.showTextGold : styles.showText}>Toddlers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setFilterType(2, "boy")}>
                            <Text style={(this.state.showType === 2) ? styles.showTextGold : styles.showText}>Boys</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setFilterType(3, "girl")}>
                            <Text style={(this.state.showType === 3) ? styles.showTextGold : styles.showText}>Girls</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({isOtherModalVisible: true})}>
                            <Text style={(this.state.showType > 3) ? styles.showTextGold : styles.showText}>Other</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{paddingTop: 5}}/>

                    {this.state.stories.length > 1  &&
                    <MyListComponent navigation={this.props.navigation}
                                     myList={this.state.stories}
                                     screenType={'Stories'}
                                     updateParentStoriesCurrentProfile={this.updateStoriesProfiles}
                                     resetList={this.resetList}
                                     onPressItem={this.onPressStorySelection}
                                     listType={this.state.listType}
                                     otherFilter={this.state.otherFilter}
                    />
                    }

                    <Toast
                        ref="toast"
                        style={{backgroundColor:'gold',borderRadius: 20,padding: 10}}
                        position='bottom'
                        positionValue={400}
                        fadeOutDuration={3000}
                        opacity={1}
                        textStyle={{color:'purple',fontSize:20, fontWeight: 'bold'}}
                    />

                    <MyHelpIcon onPress={this.onHelpPress}/>
                    <MyHelpModal screen={"Stories"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>

                    <MyOtherModal onOtherPress={this.onOtherPress}
                                 onExitPress={this.onOtherExitPress}
                                 isVisible={this.state.isOtherModalVisible}/>

                </View>
            );
        } catch (error) {
            myfuncs.mySentry(error);
        }
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
    setFilterType = (showType, otherFilter) => {
        this.setState({showType: showType});
        this.setState({otherFilter: otherFilter});
    };
    onOtherPress = async (otherFilter) => {
        try {
            myfuncs.myBreadCrumbs('onHelpPress', this.props.navigation.state.routeName);
            this.setState({otherFilter: otherFilter});
            this.setState({showType: 4});
            this.setState({isOtherModalVisible: false});
            // console.log("OnOtherPress", otherFilter);

            if (otherFilter === 'write-in') {
                this.showToast();
            }
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    showToast = () => {
        this.refs.toast.show("We encourage you to write a story and send to:" +
            "\r\n\nRibity@yahoo.com " +
            "\r\n\nWe will publish it on Kibity and contact you when it is added to the Kibity list of stories.", 6000);
    };
    onOtherExitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onOtherExitPress', this.props.navigation.state.routeName);
            this.setState({isOtherModalVisible: false});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "mediumpurple",
        justifyContent:'center',
        alignItems: 'center',
        paddingTop: 25,
    },
    showRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    showTextGold: {
        color: 'gold',
        fontSize: 20,
        // fontWeight: 'bold',
        marginHorizontal: 5,
    },
    showText: {
        color: 'silver',
        fontSize: 20,
        marginHorizontal: 5,
    },
    secondRow: {
        paddingTop: 20,
        borderBottomColor: 'purple',
        borderBottomWidth: 3,
        flexDirection: 'row',
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
        color: 'gold',

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
    },
    list: {
        alignItems: "center",
        paddingTop: 20,
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
