import React from 'react';
import {Alert,StyleSheet, View, Dimensions} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Button, Layout, Text} from "@ui-kitten/components";
import {Ionicons} from '@expo/vector-icons';
import * as Speech from "expo-speech";
// import {ThemeButton} from "../components/themeButton";
import MyDefines from '../constants/MyDefines';
import mystories from '../services/myStories';
import storyconversion from '../services/storyConversion';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setStoryIdx, setListType, setListIdx} from "../actions/currentProfileActions";
import {updateStoryList} from "../actions/storyListActions";
import TasksComponent from '../components/TasksComponent';
// import myfuncs from "../services/myFuncs";
//
// import AUDIO_PLAYING_FAVORITES from '../constants/MyDefines';
// import AUDIO_PLAYING_PLAYLIST from '../constants/MyDefines';

let willUnmount = false;
let myStory = null;
let myIdx = 0;
let delayedPlay = null;
let otherTimeout = null;
let nextStoryTimeout = null;
let playingStory = null;
let overrideTheNextLine = false;
let story_idx = -1;

const {height, width} = Dimensions.get('window');

const initialState = {
    playing: false,
    curr_text: "",
    story_title: "",
    paused: false,
    line_idx: 0,
    num_lines: 0,
    current_profile: MyDefines.default_current_profile,
};

class AudioScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.componentWillFocus = this.componentWillFocus.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    };
    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener('willFocus', this.componentWillFocus),
        ];
        this.props.setListIdx(0);
        this.props.setStoryIdx(-1);
        this.setState({current_profile: this.props.current_profile});

        if (MyDefines.log_audio)
            console.log("height:", height, " width:", width, "statusbar:", MyDefines.myStatusBarHeight);
    };
    // static getDerivedStateFromProps(nextProps, prevState){
    //     let update = {};
    //
    //     console.log("getDerivedStateFromProps");
    //     if (prevState.stories_list !== nextProps.stories_list) {
    //         update.stories_list = nextProps.stories_list;
    //     }
    //     if (prevState.stories_list !== nextProps.stories_list) {
    //         update.story_idx = nextProps.story_idx;
    //         if (playingStory !== null)
    //             clearTimeout(playingStory);
    //
    //         playingStory = setTimeout(() => {this.getItAndPlay();}, 1000);
    //     }
    //
    //     return Object.keys(update).length ? update: null;
    // };

    componentWillFocus() {
        try {
            this.setState({current_profile: this.props.current_profile});
            if (MyDefines.log_audio)
                console.log("Focused props.story_idx:", this.props.current_profile.currStoryIdx, "story_idx:", story_idx);
            if (this.props.current_profile.currStoryIdx !== story_idx) {
                if (MyDefines.log_audio)
                    console.log("FocusingToAudio, props.story_idx:", this.props.current_profile.currStoryIdx, "story_idx:", story_idx);
                story_idx = this.props.current_profile.currStoryIdx;
                if (story_idx !== -1)
                    this.getItAndPlay();
            }
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
        if (otherTimeout !== null) {
            clearTimeout(otherTimeout);
        }
        if (nextStoryTimeout !== null) {
            clearTimeout(nextStoryTimeout);
        }
        if (playingStory !== null) {
            clearTimeout(playingStory);
        }
        this.subs.forEach(sub => sub.remove());  // removes the componentWillFocus listener
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

            myStory = storyconversion.convertIt(myStory, null);
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
            // if (myStory.line[myIdx] !== "The End") {
                Speech.speak(myStory.line[myIdx], {
                    // voice: "com.apple.ttsbundle.Samantha-compact",
                    // language: 'en',
                    pitch: 1.0,
                    rate: 1.0,
                    onDone: this.playNextLine,
                    // onStopped: speechStopped,
                    // onStart: scheduleTheCheckSpeech,
                });
            // } else {
            //     myfuncs.playRibbit(this.props.navigation.state.routeName);
            //     this.playNextLine();
            // }
        } else {
            this.setState({playing: false});
            if (MyDefines.log_audio)
                console.log("Finished story");
            if (MyDefines.log_details)
                console.log(this.props.current_profile);
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
            console.log("backward set overrideTheNextLine to true");
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
        // if (this.props.current_profile.favorites.length < 1 && this.props.current_profile.playList.length < 1)
        //     this.goToStoriesScreen();
        nextStoryTimeout = setTimeout(() => {this.playNext()}, 3000);
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
    goToStoriesScreen = () => {
        this.props.navigation.navigate("Stories");
    };
    playFavorites = () => {
        if (this.props.current_profile.favorites.length) {
            this.props.setListType(1);
            this.props.setListIdx(0);
            story_idx = this.props.current_profile.favorites[0];
            this.props.setStoryIdx(story_idx);
            this.getItAndPlay();
        }
    };
    playPlayList = () => {
        if (this.props.current_profile.playList.length) {
            this.props.setListType(2);
            this.props.setListIdx(0);
            story_idx = this.props.current_profile.playList[0];
            this.props.setStoryIdx(story_idx);
            this.getItAndPlay();
        }
    };
    playPrevious = () => {
        let listIdx;
        if (this.props.current_profile.currListType === 1) {  // If playing favorites
            if (this.props.current_profile.currListIdx === 0) {
                listIdx = this.props.current_profile.favorites.length-1;
            } else {
                listIdx = this.props.current_profile.currListIdx-1;
            }
            story_idx = this.props.current_profile.favorites[listIdx];
            this.props.setListIdx(listIdx);
            this.props.setStoryIdx(story_idx);
        } else if (this.props.current_profile.currListType === 2) {  // If playing playlist
            if (this.props.current_profile.currListIdx === 0) {
                listIdx = this.props.current_profile.playList.length-1;
            } else {
                listIdx = this.props.current_profile.currListIdx-1;
            }
            story_idx = this.props.current_profile.playList[listIdx];
            this.props.setListIdx(listIdx);
            this.props.setStoryIdx(story_idx);
        }
        // nextStoryTimeout = setTimeout(() => {this.getItAndPlay()}, 2000);
        this.getItAndPlay();
    };
    validateListPlay = () => {
        if ((this.props.current_profile.currListType === 1) &&
            (this.props.current_profile.favorites.length === 0)) {  // This covers case where use removed all from playList while it was playing
            this.props.setListType(0);
        } else if ((this.props.current_profile.currListType === 2) &&
            (this.props.current_profile.playList.length === 0)) {  // This covers case where use removed all from playList while it was playing
            this.props.setListType(0);
        }
    };
    playNext = () => {
        let listIdx;
        this.validateListPlay();

        if (this.props.current_profile.currListType === 1) {  // If playing favorites
            if (this.props.current_profile.currListIdx < this.props.current_profile.favorites.length - 1) {
                listIdx = this.props.current_profile.currListIdx + 1;
            } else {
                listIdx = 0;
            }
            story_idx = this.props.current_profile.favorites[listIdx];
            this.props.setListIdx(listIdx);
            this.props.setStoryIdx(story_idx);
        } else if (this.props.current_profile.currListType === 2) {  // If playing playlist
            if (this.props.current_profile.currListIdx < this.props.current_profile.playList.length - 1) {
                listIdx = this.props.current_profile.currListIdx + 1;
            } else {
                listIdx = 0;
            }
            story_idx = this.props.current_profile.playList[listIdx];
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
                                {this.state.current_profile.currListType === 0  &&
                                <View>
                                    {this.state.current_profile.favorites.length > 0 &&
                                    <Button style={styles.bottomButtons}
                                            onPress={this.playFavorites}>Start Favorites</Button>
                                    }
                                    {this.state.current_profile.playList.length > 0 &&
                                        <Button style={styles.bottomButtons}
                                            onPress={this.playPlayList}>Start Playlist</Button>
                                    }
                                </View>
                                }
                                { (this.state.current_profile.currListType === 1  &&
                                    this.state.current_profile.favorites.length > 0) &&
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
                                { (this.state.current_profile.currListType === 2  &&
                                    this.state.current_profile.playList.length > 0) &&
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
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Button style={styles.selectButton}
                                    onPress={this.goToStoriesScreen}>Select a Story to Play</Button>
                            {this.state.current_profile.favorites.length > 0 &&
                            <Button style={styles.selectButton}
                                    onPress={this.playFavorites}>Play Favorites</Button>
                            }
                            {this.state.current_profile.playList.length > 0 &&
                            <Button style={styles.selectButton}
                                    onPress={this.playPlayList}>Play Playlist</Button>
                            }
                            </View>
                    }
                    </Layout>
            </SafeAreaView>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#ecf0f1',
        // justifyContent: 'space-between',
    },
    playRow: {
        flexDirection: 'row',
        justifyContent: 'center',
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
        bottom: (MyDefines.myBottomTabBarHeight) + 80,
    },
    selectButton: {
        marginVertical: 30,
        marginHorizontal: 30,
        backgroundColor: 'purple',
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
        color: 'purple',
        marginHorizontal: 20,
    },
    audioTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 25,
        color: 'goldenrod',
        marginHorizontal: 10,
        marginVertical: 10,
        paddingTop:10
    },
    currentText: {
        fontSize: 25,
        lineHeight: 35,
        // textAlign: 'justify',
        color: 'purple',
        marginHorizontal: 10,
        paddingTop: 20,
    },
});

const mapStateToProps = (state) => {
    const { story_list } = state;
    const { current_profile } = state;
    return { story_list, current_profile }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateStoryList,
        setStoryIdx,
        setListType,
        setListIdx,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(AudioScreen);
