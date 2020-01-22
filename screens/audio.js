import React from 'react';
import {Alert,StyleSheet, View, Dimensions} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Button, ButtonGroup, Layout, Text} from "@ui-kitten/components";
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
        this.props.setFavoritesIdx(0);
        this.props.setPlayListIdx(0);
        this.props.updateStoryIdx(-1);
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
        // AppState.removeEventListener('change', this._handleAppStateChange);
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
            this.playNext();
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
    finishedStories = () => {
        this.setState(initialState);
        story_idx = -1;
        overrideTheNextLine = false;
        this.props.setFavoritesIdx(0);
        this.props.setPlayListIdx(0);
        this.props.updateStoryIdx(-1);

        if (this.props.current_profile.favorites.length < 1 && this.props.current_profile.playList.length < 1)
            this.goToStoriesScreen();
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
    };
    playPlayList = () => {
    };
    playPrevious = () => {
        let listIdx;
        if (this.props.current_profile.audioPlayType === 1) {  // If playing favorites
            if (this.props.current_profile.currFavoritesIdx === 0) {
                listIdx = this.props.current_profile.favorites.length-1;
            } else {
                listIdx = this.props.current_profile.currFavoritesIdx-1;
            }
            story_idx = this.props.current_profile.favorites[listIdx];
            this.props.setFavoritesIdx(listIdx);
            this.props.updateStoryIdx(story_idx);
        } else if (this.props.current_profile.audioPlayType === 2) {  // If playing playlist
            if (this.props.current_profile.currPlayListIdx === 0) {
                listIdx = this.props.current_profile.playList.length-1;
            } else {
                listIdx = this.props.current_profile.currPlayListIdx-1;
            }
            story_idx = this.props.current_profile.playList[listIdx];
            this.props.setPlayListIdx(listIdx);
            this.props.updateStoryIdx(story_idx);
        }
        // nextStoryTimeout = setTimeout(() => {this.getItAndPlay()}, 2000);
        this.getItAndPlay();
    };
    playNext = () => {
        let listIdx;
        if (this.props.current_profile.audioPlayType === 1) {  // If playing favorites
            if (this.props.current_profile.currFavoritesIdx < this.props.current_profile.favorites.length - 1) {
                listIdx = this.props.current_profile.currFavoritesIdx + 1;
            } else {
                listIdx = 0;
            }
            story_idx = this.props.current_profile.favorites[listIdx];
            this.props.setFavoritesIdx(listIdx);
            this.props.updateStoryIdx(story_idx);
        } else if (this.props.current_profile.audioPlayType === 2) {  // If playing playlist
            if (this.props.current_profile.currPlayListIdx < this.props.current_profile.playList.length - 1) {
                listIdx = this.props.current_profile.currPlayListIdx + 1;
            } else {
                listIdx = 0;
            }
            story_idx = this.props.current_profile.playList[listIdx];
            this.props.setPlayListIdx(listIdx);
            this.props.updateStoryIdx(story_idx);
        }
        // nextStoryTimeout = setTimeout(() => {this.getItAndPlay()}, 2000);
        this.getItAndPlay();
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Layout style={{flex: 1, alignItems: 'center'}}>
                    <ThemeButton/>
                    {this.state.playing &&
                    <Text style={styles.audioTitle}>{this.state.story_title}</Text>
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
                                { ((this.props.current_profile.audioPlayType === 1  &&
                                    this.props.current_profile.favorites.length > 1) ||
                                (this.props.current_profile.audioPlayType === 2  &&
                                    this.props.current_profile.playList.length > 1)) &&
                                <View>
                                    <Button style={styles.bottomButtons}
                                            onPress={this.playPrevious}>Previous Story</Button>
                                        <Button style={styles.bottomButtons}
                                                onPress={this.playNext}>Next Story</Button>
                                </View>
                                }
                            </View>
                        </View>
                        :
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Button style={styles.selectButton}
                                    onPress={this.goToStoriesScreen}>Select a Story to Play</Button>
                            {this.props.current_profile.favorites.length > 0 &&
                            <Button style={styles.selectButton}
                                    onPress={this.playFavorites}>Play Favorites</Button>
                            }
                            {this.props.current_profile.playList.length > 0 &&
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
    bottom: {
        // position: 'absolute',
        // flexDirection: 'row',
        alignItems: 'center',
        bottom: (MyDefines.myBottomTabBarHeight) + 100,
    },
    selectButton: {
        marginVertical: 30,
        marginHorizontal: 30,
        backgroundColor: 'purple',
    },
    bottomButtons: {
        marginVertical: 5,
        marginHorizontal: 5,
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
