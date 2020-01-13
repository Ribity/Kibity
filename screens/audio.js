import React from 'react';
import {SafeAreaView} from "react-navigation";
import {Button, Layout, Text} from "@ui-kitten/components";
import * as Speech from "expo-speech";
import {ThemeButton} from "../components/themeButton";
import MyDefines from '../constants/MyDefines';
import mystories from '../services/myStories';

let story_num = 1;
let myStory = null;
let myIdx = 0;
let delayedPlay = null;
let overrideTheNextLine = false;
let my_story_list = MyDefines.default_asyncStorage.local_story_list;
export default class AudioScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storySelected: false,
            paused: false,
            idx: 0,
            num_lines: 0,
        };
    };
    componentDidMount() {
        my_story_list = require('../assets/allStoriesList.json')
        console.log(my_story_list.stories);
    }

    getItAndPlay = () => {
        myStory = mystories.getStory(my_story_list.stories[story_num-1].filename);
        // console.log("Mine", myStory);

        if (myStory !== null) {
            console.log(myStory);
            this.playIt();
        } else {
             this.getStoryFromServer();
        }
    };
    getStoryFromServer = () => {
        let story_url = MyDefines.stories_url_bucket + my_story_list.stories[story_num-1].filename;
        fetch(story_url)
            .then(response => response.json())
            .then(responseJson => {
                console.log("fetch json json");
                // console.log(responseJson);
                myStory = responseJson;
                this.playIt();
            })
            .catch(error => {
                console.error(error);
            });
        return null;
    };
    playIt = () => {
        if (myStory !== null) {
            console.log("Setting state vars");
            this.setState({storySelected: true});
            this.setState({num_lines: myStory.line.length});
        }
        overrideTheNextLine = true;
        Speech.stop();
        this.clearPotentialPlay();
        myIdx = 0;
        console.log("playIt");
        if (myStory !== null) {
            // setTimeout(() => {  this.playLineNum(0); }, 100);
            this.playLineNum(0);
        }
    };

    playLineNum = (lineNum) => {
        console.log("playLineNum:", lineNum+1);
        Speech.stop();
        this.clearPotentialPlay();
        myIdx = lineNum;
        if (overrideTheNextLine === true)
            setTimeout(() => {overrideTheNextLine = false;}, 1500);
        this.playLine();
    };
    playLine = () => {
        this.setState({paused: false});
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
            console.log("Finished story");
            if (story_num < my_story_list.stories.length )
                story_num++;      // mk1 temp
            else
                story_num = 1;      // mk1 temp
            this.getItAndPlay();
        }
    };
    playNextLine = () => {
        this.clearPotentialPlay();
        console.log("Done, playNext");
        if (!overrideTheNextLine) {
            let mSecs = 1000;
            Speech.stop();
            myIdx++;
            delayedPlay = setTimeout(() => {this.playLineNum(myIdx);}, mSecs);
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
                <ThemeButton/>
                <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                    <Text category='h5'>Audio Play</Text>
                    {!this.state.storySelected ?
                        <Button style={{marginVertical: 4, backgroundColor: 'purple'}}
                                onPress={this.getItAndPlay}>GetItAndPlay</Button>
                        :
                        <Layout>
                            {!this.state.paused ?
                                <Button style={{marginVertical: 4, backgroundColor: 'purple'}}
                                        onPress={this.pauseIt}>Pause</Button>
                                :
                                <Button style={{marginVertical: 4, backgroundColor: 'purple'}}
                                        onPress={this.resumeIt}>Resume</Button>
                            }
                            <Text>Part {this.state.idx+1} of {this.state.num_lines}</Text>
                            <Button style={{marginVertical: 4, backgroundColor: 'purple'}}
                                    onPress={this.restartIt}>Restart</Button>
                            <Button style={{marginVertical: 4, backgroundColor: 'purple'}}
                                    onPress={this.backward}>Back</Button>
                            <Button style={{marginVertical: 4, backgroundColor: 'purple'}}
                                    onPress={this.forward}>Forward</Button>
                        </Layout>
                    }
                </Layout>
            </SafeAreaView>
        );
    }
};


