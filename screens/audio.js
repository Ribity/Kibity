import React from 'react';
import {Alert,StyleSheet, AppState} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Button, Layout, Text} from "@ui-kitten/components";
import * as Speech from "expo-speech";
import {ThemeButton} from "../components/themeButton";
import MyDefines from '../constants/MyDefines';
import mystories from '../services/myStories';
import storyconversion from '../services/storyConversion';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateStoryIdx} from "../actions/storyIdxActions";
import {updateCurrentProfile} from "../actions/currentProfileActions";
import {setFavoritesIdx} from "../actions/currentProfileActions";
import {setPlayListIdx} from "../actions/currentProfileActions";

import AUDIO_PLAYING_FAVORITES from '../constants/MyDefines';
import AUDIO_PLAYING_PLAYLIST from '../constants/MyDefines';

let willUnmount = false;
let myStory = null;
let myIdx = 0;
let delayedPlay = null;
let otherTimeout = null;
let playingStory = null;
let overrideTheNextLine = false;
let story_idx = -1;


class AudioScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            curr_text: "",
            story_title: "",
            paused: false,
            line_idx: 0,
            num_lines: 0,
        };
        this.componentWillFocus = this.componentWillFocus.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    };
    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener('willFocus', this.componentWillFocus),
        ];
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
            console.log("Focused props.story_idx:", this.props.story_idx, "story_idx:", story_idx);
            if (this.props.story_idx !== story_idx) {
                console.log("FocusingToAudio, props.story_idx:", this.props.story_idx, "story_idx:", story_idx);
                story_idx = this.props.story_idx;
                if (story_idx !== -1)
                    this.getItAndPlay();
            }
        } catch (error) {
            // myfuncs.mySentry(error);
        }
    }
    componentWillUnmount() {
        willUnmount = true;
        AppState.removeEventListener('change', this._handleAppStateChange);
        console.log("audioScreen will unmount");
        Speech.stop();
        if (delayedPlay !== null) {
            clearTimeout(delayedPlay);
        }
        if (otherTimeout !== null) {
            clearTimeout(otherTimeout);
        }
        if (playingStory !== null) {
            clearTimeout(playingStory);
        }
        this.subs.forEach(sub => sub.remove());  // removes the componentWillFocus listener
    };
    getItAndPlay = () => {
        // console.log("getItAndPlay:", this.props.story_list);
        myStory = mystories.getStory(this.props.story_list.stories[story_idx].filename);
        // console.log("Mine", myStory);

        if (myStory !== null) {
            console.log("Found local story");
            this.playIt();
        } else {
             this.getStoryFromServer();
        }
    };
    getStoryFromServer = () => {
        let story_url = MyDefines.stories_url_bucket + this.props.story_list.stories[story_idx].filename;
        // console.log("mystory1", story_url);

        fetch(story_url)
            .then(response => response.json())
            .then(responseJson => {
                console.log("fetched remote story");
                // console.log("fetch",responseJson);
                myStory = responseJson;
                this.playIt();
            })
            .catch(error => {
                console.log("file NOT retrieved from server", story_url);
                Alert.alert("Error accessing the story you selected",
                    "Please select a different story for now",
                    );
                // console.error(error);
            });
        return null;
    };
    playIt = () => {
        // console.log("playIt", myStory);
        if (myStory !== null) {

            myStory = storyconversion.convertIt(myStory, null);
            // console.log("convertedStory:", myStory);

            console.log("Setting state vars");
            this.setState({num_lines: myStory.line.length});
            this.setState({story_title: this.props.story_list.stories[story_idx].title});
        }
        overrideTheNextLine = true;
        Speech.stop();
        this.clearPotentialPlay();
        myIdx = 0;
        if (myStory !== null) {
            this.playLineNum(0);
        }
    };

    playLineNum = (lineNum) => {
        console.log("playLineNum:", lineNum+1);
        Speech.stop();
        this.clearPotentialPlay();
        myIdx = lineNum;
        if (overrideTheNextLine === true)
            otherTimeout = setTimeout(() => {overrideTheNextLine = false;}, 1000);
        this.playLine();
    };
    playLine = () => {
        this.setState({curr_text: myStory.line[myIdx]})
        this.setState({paused: false});
        this.setState({playing: true});
        if (myIdx < myStory.line.length) {
            this.setState({line_idx: myIdx});
            console.log("speak: ", myStory.line[myIdx]);
            Speech.speak(myStory.line[myIdx], {
                // voice: "com.apple.ttsbundle.Samantha-compact",
                // language: 'en',
                pitch: 1.0,
                rate: 1.0,
                onDone: this.playNextLine,
                // onStopped: speechStopped,
                // onStart: scheduleTheCheckSpeech,
            });
        } else {
            this.setState({playing: false});
            console.log("Finished story");
            // console.log(this.props.current_profile);
            if (this.props.current_profile.audioPlayType === 1) {  // If playing favorites
                console.log("Play next favorite story");
                if (this.props.current_profile.currFavoritesIdx < this.props.current_profile.favorites.length-1) {
                    console.log("attempt play next fave");
                    story_idx = this.props.current_profile.favorites[this.props.current_profile.currFavoritesIdx+1];
                    this.props.updateStoryIdx(story_idx);
                    console.log("calling setFavoritesIdx");
                    this.props.setFavoritesIdx(this.props.current_profile.currFavoritesIdx+1);
                    this.getItAndPlay();
                } else {
                    this.resetAndGoToStoriesScreen();
                }
            } else if (this.props.current_profile.audioPlayType === 2) {  // If playing playlist
                if (this.props.current_profile.currPlayListIdx < this.props.current_profile.playList.length-1) {
                    story_idx = this.props.current_profile.favorites[this.props.current_profile.currPlayListIdx+1];
                    this.props.updateStoryIdx(story_idx);
                    this.props.setPlayListIdx(this.props.current_profile.currPlayListIdx+1);
                    this.getItAndPlay();
                } else {
                    this.resetAndGoToStoriesScreen();
                }
            } else {
                this.resetAndGoToStoriesScreen();
            }

        }
    };
    playNextLine = () => {
        if (!willUnmount) {             // Added this because when speech.speak finishes, it might call playNextLine inadvertently
            this.clearPotentialPlay();
            console.log("Done, playNext");
            if (!overrideTheNextLine) {
                let mSecs = 1000;
                Speech.stop();
                myIdx++;
                delayedPlay = setTimeout(() => {
                    this.playLineNum(myIdx);
                }, mSecs);
            }
        }
    };
    pauseIt = () => {
        this.clearPotentialPlay();
        Speech.pause();
        this.setState({paused: true});
    };
    resumeIt = () => {
        overrideTheNextLine = true;
        this.clearPotentialPlay();
        if (Speech.isSpeakingAsync() === true)
            Speech.resume();
        else
            this.playLineNum(myIdx);
        this.setState({paused: false});
    };
    restartIt = () => {
        this.playIt();
    };
    backward = () => {
        overrideTheNextLine = true;
        this.clearPotentialPlay();
        Speech.stop();
        if (myIdx > 0)
            myIdx--;
        // delayedPlay = setTimeout(() => {  this.playLineNum(myIdx); }, 1000);
        this.playLineNum(myIdx);
    };
    forward = () => {
        overrideTheNextLine = true;
        this.clearPotentialPlay();
        Speech.stop();
        myIdx++;
        // delayedPlay = setTimeout(() => {  this.playLineNum(myIdx); }, 1000);
        this.playLineNum(myIdx);
    };
    clearPotentialPlay = () => {
        if (delayedPlay !== null) {
            clearTimeout(delayedPlay);
            delayedPlay = null;
        }
    };

    resetAndGoToStoriesScreen = () => {
        this.setState({
            playing: false,
            curr_text: "",
            story_title: "",
            paused: false,
            line_idx: 0,
            num_lines: 0
        });

        this.goToStoriesScreen();
    };
    goToStoriesScreen = () => {
        this.props.navigation.navigate("Stories");
    };

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                    <Layout style={{flex: 1, justifyContent: 'top', alignItems: 'center'}}>
                        {/*<ThemeButton/>*/}
                        {this.state.playing &&
                        <Text style={styles.audioTitle}>{this.state.story_title}</Text>
                        }

                        {this.state.num_lines > 0 ?
                            <Text
                                style={styles.audioCountdown}>Part {this.state.line_idx + 1} of {this.state.num_lines}</Text>
                            :
                            <Button style={styles.selectButton}
                                    onPress={this.goToStoriesScreen}>Select a Story to Play</Button>
                        }
                        <Layout style={{flexDirection: 'row'}}>
                            {!this.state.paused ?
                                <Button style={styles.audioButton}
                                        onPress={this.pauseIt}> Pause </Button>
                                :
                                <Button style={styles.audioButton}
                                        onPress={this.resumeIt}>Resume</Button>
                            }
                            <Button style={styles.audioButton}
                                    onPress={this.backward}>Back</Button>
                            <Button style={styles.audioButton}
                                    onPress={this.forward}>Forward</Button>
                            <Button style={styles.audioButton}
                                    onPress={this.restartIt}>Start Over</Button>
                        </Layout>

                        {this.state.playing &&
                        <Text style={styles.currentText}>{this.state.curr_text}</Text>
                        }
                    </Layout>
            </SafeAreaView>
        );
    }
};
const styles = StyleSheet.create({
    selectButton: {
        marginVertical: 30,
        marginHorizontal: 30,
        backgroundColor: 'green',
    },
    audioButton: {
        marginVertical: 4,
        marginHorizontal: 4,
        backgroundColor: 'purple',
    },
    audioCountdown: {
        fontSize: 20,
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
    const { story_idx } = state;
    const { current_profile } = state;
    return { story_list, story_idx, current_profile }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateStoryIdx,
        updateCurrentProfile,
        setFavoritesIdx,
        setPlayListIdx,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(AudioScreen);
