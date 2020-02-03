import React from 'react';
import {Alert,StyleSheet, View, Dimensions, Image} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Button, Layout, Text} from "@ui-kitten/components";
import {Ionicons} from '@expo/vector-icons';
import * as Speech from "expo-speech";
import MyDefines from '../constants/MyDefines';
import mystories from '../services/myStories';
import storyconversion from '../services/storyConversion';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setStoryIdx, setListType, setListIdx} from "../actions/profilesActions";
import {updateStoryList} from "../actions/storyListActions";
import {updateSettings} from "../actions/settingsActions";
import {updateProfiles} from "../actions/profilesActions";
import TasksComponent from '../components/TasksComponent';
import myfuncs from "../services/myFuncs";
import MyHelpIcon from "../components/MyHelpIcon";
import MyHelpModal from "../components/MyHelpModal";
import {ThemeButton} from "../components/themeButton";
import {ScreenTitle} from "../components/screenTitle";
import {ProfileHeader} from "../components/ProfileHeader";
import MyButton from '../components/MyButton';


let willUnmount = false;
let myStory = null;
let myIdx = 0;
let delayedPlay = null;
let nextStoryTimeout = null;
let playingStory = null;
let overrideTheNextLine = false;
let story_idx = -1;
let kibityLogo = require('../assets/images/PurpleFaceIcon512.png');

const {height, width} = Dimensions.get('window');

const initialState = {
    intro_screen: true,
    playing: false,
    curr_text: "",
    story_title: "",
    paused: false,
    line_idx: 0,
    num_lines: 0,
    profiles: MyDefines.default_profiles,
};

const pause_data = MyDefines.pause_data;
const pitch_data = MyDefines.pitch_data;

class AudioScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AudioScreen');
            const { params = {} } = navigation.state;
            return {
                headerLeft: () => <ThemeButton/>,
                headerTitle: () => <ScreenTitle title={"Audio"}/>,
                headerRight: () => <ProfileHeader profile={params.profile} action={params.action}/>,
            };
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };

    constructor(props) {
        super(props);
        this.state = initialState;
        this.componentWillFocus = this.componentWillFocus.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    };
    componentDidMount() {
        setTimeout(() => {this.getUserStoredData();}, 1);

        this.props.navigation.setParams({profile: this.props.profiles.profile[this.props.profiles.profilesIdx]});
        this.props.navigation.setParams({action: this.goToProfiles});


        this.subs = [
            this.props.navigation.addListener('willFocus', this.componentWillFocus),
        ];
        this.props.setListIdx(0);
        this.props.setStoryIdx(-1);
        this.setState({profiles: this.props.profiles});

        if (MyDefines.log_audio)
            console.log("height:", height, " width:", width, "statusbar:", MyDefines.myStatusBarHeight);

        // if ((this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length === 0) &&
        //     (this.props.profiles.profile[this.props.profiles.profilesIdx].playList.length === 0) &&
        //     (this.state.num_lines === 0) ) {
        //     this.goToStoriesScreen();
        // }
    }
    getUserStoredData = async () => {
        let retObj = await myfuncs.init();

        await this.props.updateSettings(retObj.settings);
        await this.props.updateProfiles(retObj.profiles);
        this.props.navigation.setParams({profile: this.props.profiles.profile[this.props.profiles.profilesIdx]});
    };

    static getDerivedStateFromProps(nextProps, prevState){
        let update = {};

        // console.log("getDerivedStateFromProps:", nextProps);
        if (prevState.stories_list !== nextProps.stories_list) {
            update.stories_list = nextProps.stories_list;
        }
        // if (prevState.stories_list !== nextProps.stories_list) {
        //     update.story_idx = nextProps.story_idx;
        //     if (playingStory !== null)
        //         clearTimeout(playingStory);
        //
        //     playingStory = setTimeout(() => {this.getItAndPlay();}, 1000);
        // }
        return Object.keys(update).length ? update: null;
    };
    checkStorySelectedParm = () => {
        let playIt = this.props.navigation.getParam('storySelected', false);
        if (playIt) {
            this.props.navigation.setParams({storySelected: false});
            story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].currStoryIdx;
            if (story_idx !== -1)
                this.getItAndPlay();
        }
    };
    componentWillFocus() {
        try {
            this.setState({profiles: this.props.profiles});

            // if (MyDefines.log_audio)
            //     console.log("Focused props.story_idx:", this.props.profiles.profile[this.props.profiles.profilesIdx].currStoryIdx,
            //         "story_idx:", story_idx);
            // if (this.props.profiles.profile[this.props.profiles.profilesIdx].currStoryIdx !== story_idx) {
            //     if (MyDefines.log_audio)
            //         console.log("FocusingToAudio, props.story_idx:", this.props.profiles.profile[this.props.profiles.profilesIdx].currStoryIdx,
            //             "story_idx:", story_idx);
            //     story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].currStoryIdx;
            //     if (story_idx !== -1)
            //         this.getItAndPlay();
            // }

            this.props.navigation.setParams({profile: this.props.profiles.profile[this.props.profiles.profilesIdx]});
            this.checkStorySelectedParm();

        } catch (error) {
            // myfuncs.mySentry(error);
        }
    }
    componentWillUnmount() {
        willUnmount = true;
        // AppState.removeEventListener('change', this._handleAppStateChange);
        if (MyDefines.log_audio)
            console.log("audioScreen will unmount");
        Speech.stop();
        if (delayedPlay !== null) {
            clearTimeout(delayedPlay);
        }
        if (nextStoryTimeout !== null) {
            clearTimeout(nextStoryTimeout);
        }
        if (playingStory !== null) {
            clearTimeout(playingStory);
        }
        this.subs.forEach(sub => sub.remove());  // removes the componentWillFocus listener
    };
    goToProfiles = () => {
        this.props.navigation.navigate("Profiles");
    };
    goToStoriesScreen = () => {
        this.props.navigation.navigate("Stories");
    };
    getItAndPlay = () => {
        if (MyDefines.log_audio)
            console.log("getItAndPlay:", story_idx);
        if (MyDefines.log_details)
            console.log("getItAndPlaystories:", this.props.story_list);
        myStory = mystories.getStory(this.props.story_list.stories[story_idx].filename);
        if (MyDefines.log_details)
            console.log("Mine", myStory);

        if (myStory !== null) {
            if (MyDefines.log_audio)
                console.log("Found local story");
            this.playIt();
        } else {
             this.getStoryFromServer();
        }
    };
    getStoryFromServer = () => {
        let story_url = MyDefines.stories_url_bucket + this.props.story_list.stories[story_idx].filename;
        if (MyDefines.log_audio)
            console.log("mystory1", story_url);

        fetch(story_url)
            .then(response => response.json())
            .then(responseJson => {
                if (MyDefines.log_audio)
                    console.log("fetched remote story");
                if (MyDefines.log_details)
                    console.log("fetch",responseJson);
                myStory = responseJson;
                this.playIt();
            })
            .catch(error => {
                if (MyDefines.log_audio)
                    console.log("file NOT retrieved from server", story_url);
                Alert.alert("Error accessing the story you selected",
                    "Please select a different story for now",
                    );
                if (MyDefines.log_details)
                    console.error(error);
            });
        return null;
    };
    playIt = () => {
        if (MyDefines.log_details)
            console.log("playIt", myStory);
        if (myStory !== null) {

            myStory = storyconversion.convertIt(myStory, this.props.profiles.profile[this.props.profiles.profilesIdx]);
            if (MyDefines.log_details)
                console.log("convertedStory:", myStory);

            if (MyDefines.log_audio)
                console.log("Setting state vars");
            this.setState({num_lines: myStory.line.length});
            this.setState({story_title: this.props.story_list.stories[story_idx].title});
        }
        if (MyDefines.log_audio)
            console.log("playIt set overrideTheNextLine to true");
        overrideTheNextLine = true;
        Speech.stop();
        this.clearPotentialPlay();
        myIdx = 0;
        if (myStory !== null) {
            this.playLineNum(0);
        }
    };

    playLineNum = (idx) => {
        if (MyDefines.log_audio)
            console.log("playLineNum:", idx+1);
        Speech.stop();
        this.clearPotentialPlay();
        myIdx = idx;
        if (overrideTheNextLine === true) {
            // if (MyDefines.log_audio)
            //     console.log("playLineNum call setOverrideToFalse in one second");
            // otherTimeout = setTimeout(() => {this.setOverrideToFalse()}, 1000);
            this.setOverrideToFalse();
        }
        this.playLine();
    };
    setOverrideToFalse = () => {
        if (MyDefines.log_audio)
            console.log("setOverrideToFalse()");
        overrideTheNextLine = false;
    };
    playLine = () => {
        this.setState({curr_text: myStory.line[myIdx]});
        this.setState({paused: false});
        this.setState({playing: true});
        if (myIdx < myStory.line.length) {
            this.setState({line_idx: myIdx});
            if (MyDefines.log_audio)
                console.log("speak: ", myStory.line[myIdx]);
            if (myStory.line[myIdx] !== "The End" || this.props.settings.playEndOfStoryRibbit === false) {
                Speech.speak(myStory.line[myIdx], {
                    // voice: "com.apple.ttsbundle.Samantha-compact",
                    // language: 'en',
                    pitch: pitch_data[this.props.settings.pitchIdx].value,
                    rate: pitch_data[this.props.settings.rateIdx].value,
                    onDone: this.playNextLine,
                    // onStopped: speechStopped,
                    // onStart: scheduleTheCheckSpeech,
                });
            } else {
                console.log("play ribbit");
                myfuncs.playRibbit(this.props.navigation.state.routeName);
                delayedPlay = setTimeout(() => {this.playNextLine();}, 1000);
            }
        } else {
            this.setState({playing: false});
            if (MyDefines.log_audio)
                console.log("Finished story");
            if (MyDefines.log_details)
                console.log(this.props.profiles.profile[this.props.profiles.profilesIdx]);
            this.finishedStory();
        }
    };
    playNextLine = () => {
        if (!willUnmount) {             // Added this because when speech.speak finishes, it might call playNextLine inadvertently
            this.clearPotentialPlay();
            if (MyDefines.log_audio)
                console.log("Done, playNext");
            if (!overrideTheNextLine) {
                if (MyDefines.log_audio)
                    console.log("Not overrideTheNextLine");
                let mSecs = 1000;
                Speech.stop();
                myIdx++;
                delayedPlay = setTimeout(() => {
                    this.playLineNum(myIdx);
                }, mSecs);
            } else {
                if (MyDefines.log_audio)
                    console.log("overrideTheNextLine");
            }
        }
    };
    pauseIt = () => {
        this.clearPotentialPlay();
        Speech.pause();
        this.setState({paused: true});
    };
    resumeIt = () => {
        if (MyDefines.log_audio)
            console.log("resumeIt set overrideTheNextLine to true");
        overrideTheNextLine = true;
        this.clearPotentialPlay();
        if (Speech.isSpeakingAsync() === true) {
            if (MyDefines.log_audio)
                console.log("resumeIt speech.resume");
            Speech.resume();
        } else {
            if (MyDefines.log_audio)
                console.log("resumeIt call playLineNum");
            this.playLineNum(myIdx);
        }
        this.setState({paused: false});
    };
    restartIt = () => {
        this.playIt();
    };
    backward = () => {
        if (MyDefines.log_audio)
            console.log("backward set overrideTheNextLine to true, lineNum:", myIdx+1);
        overrideTheNextLine = true;
        this.clearPotentialPlay();
        Speech.stop();
        if (myIdx > 0)
            myIdx--;
        // delayedPlay = setTimeout(() => {  this.playLineNum(myIdx); }, 1000);
        if (MyDefines.log_audio)
            console.log("backward playLineNum:", myIdx+1);
        this.playLineNum(myIdx);
    };
    forward = () => {
        if (MyDefines.log_audio)
            console.log("forward set overrideTheNextLine to true");
        overrideTheNextLine = true;
        this.clearPotentialPlay();
        Speech.stop();
        myIdx++;
        // delayedPlay = setTimeout(() => {  this.playLineNum(myIdx); }, 1000);
        if (MyDefines.log_audio)
            console.log("forward playLineNum:", myIdx+1);
        this.playLineNum(myIdx);
    };
    clearPotentialPlay = () => {
        if (delayedPlay !== null) {
            clearTimeout(delayedPlay);
            delayedPlay = null;
        }
    };
    finishedStory = () => {
        // this.setState(initialState);
        // story_idx = -1;
        // overrideTheNextLine = false;
        // this.props.setListIdx(0);
        // this.props.setStoryIdx(-1);
        //
        // if (this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length < 1 && this.props.profiles.profile[this.props.profiles.profilesIdx].playList.length < 1)
        //     this.goToStoriesScreen();

        nextStoryTimeout = setTimeout(() => {this.playNext()}, pause_data[this.props.settings.pauseIdx].value*1000);
    };

    // resetAndGoToStoriesScreen = () => {
    //     this.setState({
    //         playing: false,
    //         curr_text: "",
    //         story_title: "",
    //         paused: false,
    //         line_idx: 0,
    //         num_lines: 0
    //     });
    //
    //     this.goToStoriesScreen();
    // };
    playFavorites = () => {
        if (this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length) {
            this.props.setListType(1);
            this.props.setListIdx(0);
            story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].favorites[0];
            this.props.setStoryIdx(story_idx);
            this.getItAndPlay();
        }
    };
    playPlayList = () => {
        if (this.props.profiles.profile[this.props.profiles.profilesIdx].playList.length) {
            this.props.setListType(2);
            this.props.setListIdx(0);
            story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].playList[0];
            this.props.setStoryIdx(story_idx);
            this.getItAndPlay();
        }
    };
    playPrevious = () => {
        let listIdx;
        if (this.props.profiles.profile[this.props.profiles.profilesIdx].currListType === 1) {  // If playing favorites
            if (this.props.profiles.profile[this.props.profiles.profilesIdx].currListIdx === 0) {
                listIdx = this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length-1;
            } else {
                listIdx = this.props.profiles.profile[this.props.profiles.profilesIdx].currListIdx-1;
            }
            story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].favorites[listIdx];
            this.props.setListIdx(listIdx);
            this.props.setStoryIdx(story_idx);
        } else if (this.props.profiles.profile[this.props.profiles.profilesIdx].currListType === 2) {  // If playing playlist
            if (this.props.profiles.profile[this.props.profiles.profilesIdx].currListIdx === 0) {
                listIdx = this.props.profiles.profile[this.props.profiles.profilesIdx].playList.length-1;
            } else {
                listIdx = this.props.profiles.profile[this.props.profiles.profilesIdx].currListIdx-1;
            }
            story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].playList[listIdx];
            this.props.setListIdx(listIdx);
            this.props.setStoryIdx(story_idx);
        }
        // nextStoryTimeout = setTimeout(() => {this.getItAndPlay()}, 2000);
        this.getItAndPlay();
    };
    validateListPlay = () => {
        if ((this.props.profiles.profile[this.props.profiles.profilesIdx].currListType === 1) &&
            (this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length === 0)) {  // This covers case where use removed all from playList while it was playing
            this.props.setListType(0);
        } else if ((this.props.profiles.profile[this.props.profiles.profilesIdx].currListType === 2) &&
            (this.props.profiles.profile[this.props.profiles.profilesIdx].playList.length === 0)) {  // This covers case where use removed all from playList while it was playing
            this.props.setListType(0);
        }
    };
    playNext = () => {
        let listIdx;
        this.validateListPlay();

        if (this.props.profiles.profile[this.props.profiles.profilesIdx].currListType === 1) {  // If playing favorites
            if (this.props.profiles.profile[this.props.profiles.profilesIdx].currListIdx < this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length - 1) {
                listIdx = this.props.profiles.profile[this.props.profiles.profilesIdx].currListIdx + 1;
            } else {
                listIdx = 0;
            }
            story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].favorites[listIdx];
            this.props.setListIdx(listIdx);
            this.props.setStoryIdx(story_idx);
        } else if (this.props.profiles.profile[this.props.profiles.profilesIdx].currListType === 2) {  // If playing playlist
            if (this.props.profiles.profile[this.props.profiles.profilesIdx].currListIdx < this.props.profiles.profile[this.props.profiles.profilesIdx].playList.length - 1) {
                listIdx = this.props.profiles.profile[this.props.profiles.profilesIdx].currListIdx + 1;
            } else {
                listIdx = 0;
            }
            story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].playList[listIdx];
            this.props.setListIdx(listIdx);
            this.props.setStoryIdx(story_idx);
        }
        // nextStoryTimeout = setTimeout(() => {this.getItAndPlay()}, 2000);
        this.getItAndPlay();
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Layout style={{flex: 1, alignItems: 'center'}}>
                    <TasksComponent/>
                    {/*<ThemeButton/>*/}
                    {this.state.playing ?
                        <Text style={styles.audioTitle}>{this.state.story_title}</Text>
                        :
                        <Text style={styles.audioTitle}>  </Text>
                    }
                    {this.state.num_lines > 0 ?
                        <View style={{justifyContent: 'space-between'}}>
                            <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
                                <Text style={styles.audioCountdown}>Part {this.state.line_idx + 1} of {this.state.num_lines}</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    {!this.state.paused ?
                                        <Button style={styles.audioButton}
                                                size='tiny'
                                                onPress={this.pauseIt}> Pause </Button>
                                        :
                                        <Button style={styles.audioButton}
                                                size='tiny'
                                                onPress={this.resumeIt}>Resume</Button>
                                    }
                                    <Button style={styles.audioButton}
                                            size='tiny'
                                            onPress={this.backward}>Back</Button>
                                    <Button style={styles.audioButton}
                                            size='tiny'
                                            onPress={this.forward}>Forward</Button>
                                    <Button style={styles.audioButton}
                                            size='tiny'
                                            onPress={this.restartIt}>Start Over</Button>
                                </View>
                                {this.state.playing &&
                                <Text style={styles.currentText}>{this.state.curr_text}</Text>
                                }
                                </View>
                            <View style={styles.bottom}>
                                {this.state.profiles.profile[this.state.profiles.profilesIdx].currListType === 0  &&
                                <View>
                                    {this.state.profiles.profile[this.state.profiles.profilesIdx].favorites.length > 0 &&
                                    <Button style={styles.bottomButtons}
                                            onPress={this.playFavorites}>Start Favorites</Button>
                                    }
                                    {this.state.profiles.profile[this.state.profiles.profilesIdx].playList.length > 0 &&
                                        <Button style={styles.bottomButtons}
                                            onPress={this.playPlayList}>Start Playlist</Button>
                                    }
                                </View>
                                }
                                { (this.state.profiles.profile[this.state.profiles.profilesIdx].currListType === 1  &&
                                    this.state.profiles.profile[this.state.profiles.profilesIdx].favorites.length > 0) &&
                                <View>
                                    <View style={styles.playRow}>
                                        <Text style={styles.playType}>Playing Favorites</Text>
                                        <Ionicons style={styles.playIcon} name={"ios-heart"} size={25} color={'red'}/>
                                    </View>
                                    <Button style={styles.bottomButtons}
                                            onPress={this.playPrevious}>Previous Favorite Story</Button>
                                    <Button style={styles.bottomButtons}
                                            onPress={this.playNext}>Next Favorite Story</Button>
                                </View>
                                }
                                { (this.state.profiles.profile[this.state.profiles.profilesIdx].currListType === 2  &&
                                    this.state.profiles.profile[this.state.profiles.profilesIdx].playList.length > 0) &&
                                <View>
                                    <View style={styles.playRow}>
                                        <Text style={styles.playType}>Playing Playlist</Text>
                                        <Ionicons style={styles.playIcon} name={"ios-list-box"} size={25} color={'goldenrod'}/>
                                    </View>
                                    <Button style={styles.bottomButtons}
                                            onPress={this.playPrevious}>Previous PlayList Story</Button>
                                    <Button style={styles.bottomButtons}
                                            onPress={this.playNext}>Next PlayList Story</Button>
                                </View>
                                }
                            </View>
                        </View>
                        :
                        <View>
                            {this.state.intro_screen ?
                                <View>
                                    <View style={{padding: 5}}/>
                                    <Text style={styles.welcomeUser}>Welcome to Kibity</Text>
                                    <View style={{padding: 5}}/>
                                    <Image style={styles.kibityLogo} source={kibityLogo}/>
                                    <View style={{padding: 15}}/>

                                    {/*<Text style={styles.welcomeUser}>Where your dream becomes reality</Text>*/}
                                </View>
                                :
                                <View>
                                    <View style={{padding: 35}}/>

                                </View>
                            }
                                <MyButton buttonStyle={styles.selectButton}
                                          textStyle={{color: 'gold', fontWeight: 'bold'}}
                                          onPress={this.goToStoriesScreen}
                                          title={"Select a Story, or\nBuild a PlayList"}>
                                </MyButton>
                                {this.state.profiles.profile[this.state.profiles.profilesIdx].favorites.length > 0 &&
                                <MyButton buttonStyle={styles.selectButton}
                                          textStyle={{color: 'gold', fontWeight: 'bold'}}
                                          onPress={this.playFavorites}
                                          title={"Play Favorites"}>
                                </MyButton>

                                }
                                {this.state.profiles.profile[this.state.profiles.profilesIdx].playList.length > 0 &&
                                <MyButton buttonStyle={styles.selectButton}
                                    textStyle={{color: 'gold', fontWeight: 'bold'}}
                                    onPress={this.playPlayList}
                                    title={"Play Playlist"}>
                                </MyButton>
                                }
                        </View>
                    }
                    </Layout>
                <MyHelpIcon onPress={this.onHelpPress}/>
                <MyHelpModal screen={"Audio"}
                             onExitPress={this.onHelpExitPress}
                             isVisible={this.state.isModalVisible}/>
            </SafeAreaView>
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
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    kibityLogo: {
        justifyContent:'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 60,
        height: 60,
    },
    playRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    welcomeUser: {
        fontSize: 25,
        fontWeight: 'bold',
        lineHeight: 25,
        color: 'mediumpurple',
        marginHorizontal: 20,
        textAlign: 'center'
    },
    playIcon: {
        lineHeight: 25,
        marginHorizontal: 5,
        marginVertical: 5,
    },
    playType: {
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 25,
        color: 'goldenrod',
        marginHorizontal: 5,
        marginVertical: 5,
        textAlign: 'center',
    },
    bottom: {
        // position: 'absolute',
        // flexDirection: 'row',
        alignItems: 'center',
        bottom: (MyDefines.myBottomTabBarHeight),
        marginBottom: 10,

    },
    selectButton: {
        marginVertical: 15,
        marginHorizontal: 70,
        backgroundColor: 'purple',
        alignSelf: 'center',
        borderColor: 'goldenrod',
    },
    bottomButtons: {
        marginVertical: 5,
        backgroundColor: 'purple',
    },
    audioButton: {
        marginVertical: 2,
        marginHorizontal: 2,
        backgroundColor: 'purple',
        // maxWidth: '30%',
    },
    audioCountdown: {
        fontSize: 25,
        fontWeight: 'bold',
        lineHeight: 25,
        paddingBottom: 5,
        color: 'mediumpurple',
        marginHorizontal: 20,
    },
    audioTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 25,
        color: 'goldenrod',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    currentText: {
        fontSize: 25,
        lineHeight: 35,
        fontWeight: 'bold',
        // textAlign: 'justify',
        color: 'mediumpurple',
        marginHorizontal: 10,
        paddingTop: 20,
    },
});

const mapStateToProps = (state) => {
    const { story_list } = state;
    const { profiles } = state;
    const { settings } = state;
    return { story_list, profiles, settings }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateStoryList,
        updateSettings,
        updateProfiles,
        setStoryIdx,
        setListType,
        setListIdx,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(AudioScreen);
