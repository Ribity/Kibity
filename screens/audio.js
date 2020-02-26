import React from 'react';
import {Alert, StyleSheet, View, Dimensions, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Button, Layout, Text} from "@ui-kitten/components";
import {Ionicons} from '@expo/vector-icons';
import Toast from 'react-native-easy-toast';
import * as Speech from "expo-speech";
import MyDefines from '../constants/MyDefines';
import myStyles from "../myStyles";
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
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";
import {ThemeButton} from "../components/themeButton";
import {ScreenTitle} from "../components/screenTitle";
import {ProfileHeader} from "../components/ProfileHeader";
import {MyButton} from '../components/MyButton';


let willUnmount = false;
let myStory = null;
let myIdx = 0;
let delayedPlay = null;
let nextStoryTimeout = null;
let playingStory = null;
let overrideTheNextLine = false;
let story_idx = -1;
let kibityLogo = require('../assets/images/PurpleFace_512x512.png');

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
                headerLeft: () => <ProfileHeader profile={params.myProfile} onPress={params.onPress}/>,
                headerTitle: () => <ScreenTitle title={"Audio"}
                                                androidMoveLeft={20}
                                                // privacy={() => navigation.navigate("Privacy")}
                />,
                headerRight: () => <ThemeButton/>,
            };
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    constructor(props) {
        super(props);
        this.state = initialState;
        this.componentWillFocus = this.componentWillFocus.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    };
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('DidMount', this.props.navigation.state.routeName);
            setTimeout(() => {this.getUserStoredData();}, 1);

            this.subs = [
                this.props.navigation.addListener('willFocus', this.componentWillFocus),
            ];
            this.props.setListIdx(0);
            this.props.setStoryIdx(-1);
            this.setState({profiles: this.props.profiles});

            if (MyDefines.log_audio)
                console.log("height:", height, " width:", width, "statusbar:", MyDefines.myStatusBarHeight);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    getUserStoredData = async () => {
        try {
            myfuncs.myBreadCrumbs('getUserStoredData', this.props.navigation.state.routeName);
            let retObj = await myfuncs.init();

            await this.props.updateSettings(retObj.settings);
            await this.props.updateProfiles(retObj.profiles);
            this.props.navigation.setParams({myProfile: this.props.profiles.profile[this.props.profiles.profilesIdx]});
            this.props.navigation.setParams({onPress: this.goToProfilesSetActive});
            myfuncs.setAwakeorNot(this.props.settings.keep_awake);

        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState){
        try {
            myfuncs.myBreadCrumbs('getDerivedStateFromProps', "AudioScreen");
            let update = {};
            if (prevState.stories_list !== nextProps.stories_list) {
                update.stories_list = nextProps.stories_list;
            }
            if (prevState.profiles !== nextProps.profiles) {
                update.profiles = nextProps.profiles;
            }
            return Object.keys(update).length ? update: null;
        } catch (error) {
            myfuncs.myRepo(error);
            return null;
        }
    };
    checkStorySelectedParm = () => {
        try {
            myfuncs.myBreadCrumbs('checkStorySelectionParm', this.props.navigation.state.routeName);
            let playIt = this.props.navigation.getParam('storySelected', false);
            if (playIt) {
                this.props.navigation.setParams({storySelected: false});
                story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].currStoryIdx;

                if (story_idx !== -1) {
                    this.getItAndPlay();
                }
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    componentWillFocus() {
        try {
            myfuncs.myBreadCrumbs('WillFocus', this.props.navigation.state.routeName);
            this.setState({profiles: this.props.profiles});
            this.props.navigation.setParams({myProfile: this.props.profiles.profile[this.props.profiles.profilesIdx]});
            this.checkStorySelectedParm();
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    componentWillUnmount() {
        try {
            myfuncs.myBreadCrumbs('WillUnMount', this.props.navigation.state.routeName);
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
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    goToProfilesSetActive = () => {
        try {
            myfuncs.myBreadCrumbs('goToProfilesSetActive', this.props.navigation.state.routeName);
            this.props.navigation.navigate("ProfileSetActive");
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    goToStoriesScreen = () => {
        try {
            myfuncs.myBreadCrumbs('goToStoriesScreen', this.props.navigation.state.routeName);
            this.props.navigation.navigate("Stories");
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    getItAndPlay = () => {
        try {
            myfuncs.myBreadCrumbs('getItAndPlay', this.props.navigation.state.routeName);
            if (MyDefines.log_audio)
                console.log("getItAndPlay:", story_idx);
            if (MyDefines.log_details)
                console.log("getItAndPlaystories:", this.props.story_list);

            if (story_idx < this.props.story_list.stories.length) {
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
            } else {
                this.refs.toast.show("Error accessing story", 4000);

                if (this.isPlayingAList())
                    nextStoryTimeout = setTimeout(() => {this.playNext()}, pause_data[this.props.settings.pauseStoryIdx].value*1000 * 2);
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    getStoryFromServer = () => {
        try {
            myfuncs.myBreadCrumbs('getStoryFromServer', this.props.navigation.state.routeName);

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
                    // Alert.alert("Error accessing the story you selected",
                    //     "Please select a different story for now",
                    //     );

                    if (MyDefines.log_details)
                        console.error(error);

                    this.refs.toast.show("Error accessing story: '" + this.props.story_list.stories[story_idx].title + "'", 4000);

                    if (this.isPlayingAList())
                        nextStoryTimeout = setTimeout(() => {this.playNext()}, pause_data[this.props.settings.pauseStoryIdx].value*1000 * 2);
                });
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    playIt = () => {
        try {
            myfuncs.myBreadCrumbs('playIt', this.props.navigation.state.routeName);
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
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    playLineNum = (idx) => {
        try {
            myfuncs.myBreadCrumbs('playLineNum', this.props.navigation.state.routeName);
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
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    setOverrideToFalse = () => {
        try {
            myfuncs.myBreadCrumbs('setOverrideToFalse', this.props.navigation.state.routeName);
            if (MyDefines.log_audio)
                console.log("setOverrideToFalse()");
            overrideTheNextLine = false;
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    playLine = () => {
        try {
            myfuncs.myBreadCrumbs('playLine', this.props.navigation.state.routeName);
            this.setState({curr_text: myStory.line[myIdx]});
            this.setState({paused: false});
            this.setState({playing: true});
            if (myIdx < myStory.line.length) {
                this.setState({line_idx: myIdx});
                if (MyDefines.log_audio)
                    console.log("speak: ", myStory.line[myIdx]);
                if (myStory.line[myIdx] !== "The End" || this.props.settings.playEndOfStoryRibbit === false) {
                    if (this.props.settings.voice === "" || this.props.settings.voice === null) {
                        // console.log("default voice");
                        Speech.speak(myStory.line[myIdx], {
                            // voice: "com.apple.ttsbundle.Samantha-compact",
                            // language: 'en',
                            pitch: pitch_data[this.props.settings.pitchIdx].value,
                            rate: pitch_data[this.props.settings.rateIdx].value,
                            onDone: this.queueNextLine,
                            // onStopped: speechStopped,
                            // onStart: scheduleTheCheckSpeech,
                        });
                    } else {
                        // console.log("custom voice:", this.props.settings.voice );
                        Speech.speak(myStory.line[myIdx], {
                            voice: this.props.settings.voice.identifier,
                            // language: 'en',
                            pitch: pitch_data[this.props.settings.pitchIdx].value,
                            rate: pitch_data[this.props.settings.rateIdx].value,
                            onDone: this.queueNextLine,
                            // onStopped: speechStopped,
                            // onStart: scheduleTheCheckSpeech,
                        });
                    }
                } else {
                    // console.log("play ribbit");
                    myfuncs.playRibbit(this.props.navigation.state.routeName);
                    this.queueNextLine();
                    // delayedPlay = setTimeout(() => {this.playNextLine();}, 1000);
                }
            } else {
                this.setState({playing: false});
                if (MyDefines.log_audio)
                    console.log("Finished story");
                if (MyDefines.log_details)
                    console.log(this.props.profiles.profile[this.props.profiles.profilesIdx]);
                this.finishedStory();
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    queueNextLine = () => {
        try {
            myfuncs.myBreadCrumbs('queueNextLine', this.props.navigation.state.routeName);
            let pause_seconds = this.determine_pause_secs();
            delayedPlay = setTimeout(() => {this.playNextLine()}, pause_seconds*1000);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    determine_pause_secs = () => {
        let pause_seconds = pause_data[this.props.settings.pauseLineIdx].value;

        if (story_idx > -1 && story_idx < this.props.story_list.stories.length) {
            if (this.props.story_list.stories[story_idx].toddler_pause !== undefined &&
                this.props.story_list.stories[story_idx].toddler_pause !== null &&
                this.props.story_list.stories[story_idx].toddler_pause !== 0)
                pause_seconds += this.props.story_list.stories[story_idx].toddler_pause;
        }
        return pause_seconds;
    };
    playNextLine = () => {
        try {
            myfuncs.myBreadCrumbs('playNextLine', this.props.navigation.state.routeName);
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
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    pauseIt = () => {
        try {
            myfuncs.myBreadCrumbs('pauseIt', this.props.navigation.state.routeName);
            this.clearPotentialPlay();
            Speech.pause();
            this.setState({paused: true});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    resumeIt = () => {
        try {
            myfuncs.myBreadCrumbs('resumeIt', this.props.navigation.state.routeName);
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
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    restartIt = () => {
        try {
            myfuncs.myBreadCrumbs('restartIt', this.props.navigation.state.routeName);
            this.playIt();
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    backward = () => {
        try {
            myfuncs.myBreadCrumbs('backward', this.props.navigation.state.routeName);
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
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    forward = () => {
        try {
            myfuncs.myBreadCrumbs('forward', this.props.navigation.state.routeName);
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
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    clearPotentialPlay = () => {
        try {
            myfuncs.myBreadCrumbs('clearPotentialPlay', this.props.navigation.state.routeName);
            if (delayedPlay !== null) {
                clearTimeout(delayedPlay);
                delayedPlay = null;
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    finishedStory = () => {
        try {
            myfuncs.myBreadCrumbs('finishedStory', this.props.navigation.state.routeName);
            nextStoryTimeout = setTimeout(() => {this.playNext()}, pause_data[this.props.settings.pauseStoryIdx].value*1000);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    playFavorites = () => {
        try {
            myfuncs.myBreadCrumbs('playFavorites', this.props.navigation.state.routeName);
            if (this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length) {
                this.props.setListType(1);
                this.props.setListIdx(0);
                story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].favorites[0];
                this.props.setStoryIdx(story_idx);
                this.getItAndPlay();
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    playPlayList = () => {
        try {
            myfuncs.myBreadCrumbs('playPlayList', this.props.navigation.state.routeName);
            if (this.props.profiles.profile[this.props.profiles.profilesIdx].playList.length) {
                this.props.setListType(2);
                this.props.setListIdx(0);
                story_idx = this.props.profiles.profile[this.props.profiles.profilesIdx].playList[0];
                this.props.setStoryIdx(story_idx);
                this.getItAndPlay();
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    playPrevious = () => {
        try {
            myfuncs.myBreadCrumbs('playPrevious', this.props.navigation.state.routeName);
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
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    validateListPlay = () => {
        try {
            myfuncs.myBreadCrumbs('validateListPlay', this.props.navigation.state.routeName);
            if ((this.props.profiles.profile[this.props.profiles.profilesIdx].currListType === 1) &&
                (this.props.profiles.profile[this.props.profiles.profilesIdx].favorites.length === 0)) {  // This covers case where use removed all from playList while it was playing
                this.props.setListType(0);
            } else if ((this.props.profiles.profile[this.props.profiles.profilesIdx].currListType === 2) &&
                (this.props.profiles.profile[this.props.profiles.profilesIdx].playList.length === 0)) {  // This covers case where use removed all from playList while it was playing
                this.props.setListType(0);
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    playNext = () => {
        try {
            myfuncs.myBreadCrumbs('playNext', this.props.navigation.state.routeName);
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
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    isPlayingAList = () => {
        if ( (this.props.profiles.profile[this.props.profiles.profilesIdx].currListType === 1) ||
            (this.props.profiles.profile[this.props.profiles.profilesIdx].currListType === 2) )
            return true;
        return false;
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);

            let toddler = false;
            if (story_idx >= 0  &&  story_idx < this.props.story_list.stories.length) {
                if (this.props.story_list.stories[story_idx].toddler_pause !== undefined &&
                    this.props.story_list.stories[story_idx].toddler_pause !== null &&
                    this.props.story_list.stories[story_idx].toddler_pause !== 0) {
                    toddler = true;
                }
            }

            return (
               <SafeAreaView style={styles.container}>
                   <Layout style={{flex: 1, alignItems: 'center'}}>
                       <TasksComponent/>
                       {this.state.num_lines > 0 ?
                           <View>
                               <View style={{alignSelf: 'center'}}>
                                   <TouchableOpacity onPress={this.showToast}>
                                    <Text style={styles.audioTitle}>{this.state.story_title}</Text>
                                   </TouchableOpacity>
                               </View>

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
                                       <View>
                                           {toddler ?
                                               <Text
                                                   style={styles.toddlerText}>{this.state.curr_text}</Text>
                                               :
                                               <Text
                                                   style={height >= 600 ? styles.bigText : styles.smallText}>{this.state.curr_text}</Text>
                                           }
                                       </View>
                                   }
                                   </View>
                               <View style={styles.bottom}>
                                   {this.state.profiles.profile[this.state.profiles.profilesIdx].currListType === 0  &&
                                   <View>
                                       {this.state.profiles.profile[this.state.profiles.profilesIdx].favorites.length > 0 &&
                                           <View>
                                               <View style={{padding: 15}}/>
                                               <MyButton buttonStyle={myStyles.selectButton}
                                                   textStyle={myStyles.selectButtonText}
                                                   onPress={this.playFavorites}
                                                   title={"Start Favorites"}/>
                                           </View>
                                       }
                                       {this.state.profiles.profile[this.state.profiles.profilesIdx].playList.length > 0 &&
                                           <View>
                                               <View style={{padding: 15}}/>
                                               <MyButton buttonStyle={myStyles.selectButton}
                                               textStyle={myStyles.selectButtonText}
                                               onPress={this.playPlayList}
                                               title={"Start Playlist"}/>
                                           </View>
                                       }
                                   </View>
                                   }
                                   {(this.state.profiles.profile[this.state.profiles.profilesIdx].currListType === 1  &&
                                       this.state.profiles.profile[this.state.profiles.profilesIdx].favorites.length > 0) &&
                                   <View>
                                       <View style={styles.playRow}>
                                           <Text style={styles.playType}>Playing Favorites</Text>
                                           <Ionicons style={styles.playIcon} name={"ios-heart"} size={25} color={'red'}/>
                                       </View>
                                       <MyButton buttonStyle={myStyles.selectButton}
                                                 textStyle={myStyles.selectButtonText}
                                                 onPress={this.playPrevious}
                                                 title={"Previous Favorite Story"}/>
                                       <View style={{padding: 5}}/>
                                       <MyButton buttonStyle={myStyles.selectButton}
                                                 textStyle={myStyles.selectButtonText}
                                                 onPress={this.playNext}
                                                 title={"Next Favorite Story"}/>
                                   </View>
                                   }
                                   { (this.state.profiles.profile[this.state.profiles.profilesIdx].currListType === 2  &&
                                        this.state.profiles.profile[this.state.profiles.profilesIdx].playList.length > 0) &&
                                   <View>
                                       <View style={styles.playRow}>
                                           <Text style={styles.playType}>Playing Playlist</Text>
                                           <Ionicons style={styles.playIcon} name={"ios-list-box"} size={25} color={'goldenrod'}/>
                                       </View>
                                       <MyButton buttonStyle={myStyles.selectButton}
                                                 textStyle={myStyles.selectButtonText}
                                                 onPress={this.playPrevious}
                                                 title={"Previous PlayList Story"}/>

                                       <View style={{padding: 5}}/>
                                       <MyButton buttonStyle={myStyles.selectButton}
                                                 textStyle={myStyles.selectButtonText}
                                                 onPress={this.playNext}
                                                 title={"Next PlayList Story"}/>
                                   </View>
                                   }
                                   </View>
                           </View>
                           :
                           <View>
                               <View style={{padding: 25}}/>
                               <TouchableOpacity onPress={this.showToast}>
                                   <Text style={styles.welcomeUser}>Welcome to Kibity</Text>
                                   <Image style={styles.kibityLogo} source={kibityLogo}/>
                               </TouchableOpacity>

                               <View style={{padding: 15}}/>
                               <View>
                                   <View style={{padding: 15}}/>
                                   <MyButton buttonStyle={myStyles.selectButton}
                                             textStyle={myStyles.selectButtonText}
                                             onPress={this.goToStoriesScreen}
                                             title={"Select a Story, or\nBuild a PlayList"}/>
                                   {this.state.profiles.profile[this.state.profiles.profilesIdx].favorites.length > 0 &&
                                       <View>
                                       <View style={{padding: 15}}/>
                                       <MyButton buttonStyle={myStyles.selectButton}
                                                 textStyle={myStyles.selectButtonText}
                                                 onPress={this.playFavorites}
                                                 title={"Play Favorites"}/>
                                       </View>
                                   }
                                   {this.state.profiles.profile[this.state.profiles.profilesIdx].playList.length > 0 &&
                                       <View>
                                           <View style={{padding: 15}}/>
                                           <MyButton buttonStyle={myStyles.selectButton}
                                                 textStyle={myStyles.selectButtonText}
                                                 onPress={this.playPlayList}
                                                 title={"Play Playlist"}/>
                                       </View>
                                   }
                                   </View>
                           </View>
                       }

                       <Toast
                           ref="toast"
                           style={{backgroundColor:'mediumpurple',borderRadius: 20,padding: 10}}
                           position='top'
                           positionValue={0}
                           fadeOutDuration={1000}
                           opacity={.9}
                           textStyle={{color:'gold',fontSize:21}}
                       />

                       <Toast
                           ref="toaststory"
                           style={{backgroundColor:'gold',borderRadius: 20,padding: 10}}
                           position='top'
                           positionValue={0}
                           fadeOutDuration={5000}
                           opacity={1}
                           textStyle={{color:'purple',fontSize:20, fontWeight: 'bold'}}
                       />

                       <MyHelpIcon onPress={this.onHelpPress}/>
                       <MyHelpModal screen={"Audio"}
                                    onExitPress={this.onHelpExitPress}
                                    isVisible={this.state.isModalVisible}/>
                   </Layout>
               </SafeAreaView>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    onHelpPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: true});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onHelpExitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpExitPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: false});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    showToast = () => {
        this.refs.toaststory.show("We encourage you to write a story and send to:" +
            "\r\n\nRibity@yahoo.com " +
            "\r\n\nWe will publish it on Kibity and contact you when it is added to the Kibity list of stories.", 2000);
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyDefines.myTabColor,

        // backgroundColor: 'white',
    },
    kibityLogo: {
        justifyContent:'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 40,
        height: 40,
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
        // bottom: (MyDefines.myBottomTabBarHeight),
        marginBottom: 10,
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
        marginHorizontal: 5,
        marginVertical: 5,
    },
    toddlerText: {
        fontSize: 32,
        lineHeight: 35,
        fontWeight: 'bold',
        // textAlign: 'justify',
        color: 'mediumpurple',
        marginHorizontal: 5,
        paddingTop: 15,
        fontStyle: 'italic',
    },
    bigText: {
        fontSize: 26,
        lineHeight: 28,
        fontWeight: 'bold',
        // textAlign: 'justify',
        color: 'mediumpurple',
        marginHorizontal: 5,
        paddingTop: 10,
        fontStyle: 'italic',
    },
    smallText: {
        fontSize: 20,
        lineHeight: 22,
        fontWeight: 'bold',
        // textAlign: 'justify',
        color: 'mediumpurple',
        marginHorizontal: 5,
        paddingTop: 10,
        fontStyle: 'italic',
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
