import React from 'react';
import {Alert,StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Button, Layout, Text, Card, CardHeader} from "@ui-kitten/components";
import * as Speech from "expo-speech";
import {ThemeButton} from "../components/themeButton";
import MyDefines from '../constants/MyDefines';
import mystories from '../services/myStories';
import storyconversion from '../services/storyConversion';
import { updateStoriesList } from '../actions/storiesListActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";


let willUnmount = false;
let story_num = 2;
let myStory = null;
let myIdx = 0;
let delayedPlay = null;
let otherTimeout = null;
let overrideTheNextLine = false;
let my_story_list = MyDefines.default_asyncStorage.local_story_list;

class AudioScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            curr_text: "",
            story_title: "",
            paused: false,
            idx: 0,
            num_lines: 0,
        };
    };
    componentDidMount() {
        my_story_list = require('../assets/allStoriesList.json');
        this.props.updateStoriesList(my_story_list);
        console.log(my_story_list.stories);
        this.getItAndPlay();
    }
    componentWillUnmount() {
        willUnmount = true;
        console.log("audioScreen will unmount");
        Speech.stop();
        if (delayedPlay !== null) {
            clearTimeout(delayedPlay);
        }
        if (otherTimeout !== null) {
            clearTimeout(otherTimeout);
        }
    }

    getItAndPlay = () => {
        myStory = mystories.getStory(my_story_list.stories[story_num-1].filename);
        // console.log("Mine", myStory);

        if (myStory !== null) {
            console.log("Found local story");
            this.playIt();
        } else {
             this.getStoryFromServer();
        }
    };
    getStoryFromServer = () => {
        let story_url = MyDefines.stories_url_bucket + my_story_list.stories[story_num-1].filename;
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
            this.setState({story_title: my_story_list.stories[story_num-1].title});
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
            this.setState({idx: myIdx});
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
            // if (story_num < my_story_list.stories.length )
            //     story_num++;      // mk1 temp
            // else
            //     story_num = 1;      // mk1 temp
            // this.getItAndPlay();
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

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                    <Layout style={{flex: 1, justifyContent: 'top', alignItems: 'center'}}>
                        {/*<ThemeButton/>*/}
                        {this.state.playing &&
                            <Text style={styles.audioTitle}>{this.state.story_title}</Text>
                        }

                        <Text style={styles.audioCountdown}>Part {this.state.idx+1} of {this.state.num_lines}</Text>
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
                                    onPress={this.restartIt}>Restart</Button>
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
    const { stories_list } = state;
    return { stories_list }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateStoriesList,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(AudioScreen);
