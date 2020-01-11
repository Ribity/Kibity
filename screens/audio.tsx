import React from 'react';
import { SafeAreaView } from 'react-navigation';
import {Button, Layout, Text} from '@ui-kitten/components';
import * as Speech from 'expo-speech';

let myStory = null;
let myIdx = 0;
// let myCheck = null;
// let myPlay = null;
export const AudioScreen = ({ navigation }) => {
    const getItAndPlay = () => {
        Speech.stop();

        // myStory = require("../assets/stories/testTwoStory.json");
        myStory = getStoryFromServer();

        playIt();
        };
    const playIt = () => {
        if (myStory !== null) {
            myIdx = 0;
            playLine();
        }
    };
    const getStoryFromServer = () => {
        fetch('https://ribity.com/stories/testTwoStory2.json')
            .then(response => response.json())
            .then(responseJson => {
                console.log("fetch json json");
                console.log(responseJson);
                myStory = responseJson;
                playIt();
            })
            .catch(error => {
                console.error(error);
            });
        return null;
    };

    const playLine = () => {
        if (myIdx < myStory.line.length) {
            console.log(myStory.line[myIdx]);
            Speech.speak(myStory.line[myIdx], {
                // voice: "com.apple.ttsbundle.Samantha-compact",
                // language: 'en',
                pitch: 1.0,
                rate: 1.0,
                onDone: playNext,
                // onStopped: speechStopped,
                // onStart: scheduleTheCheckSpeech,
            });
        } else {
            console.log("Finished story");
        }
    };
    const playNext = () => {
        myIdx++;
        playLine();
    };
    // const scheduleTheCheckSpeech = () => {
    //     let mSecs = 500;
    //     myCheck = setTimeout(() => {  checkForSpeech(); }, mSecs);
    // };
    // const speechStopped = () => {
    //     if (myCheck !== null) {
    //         clearTimeout(myCheck);
    //         myCheck = null;
    //     }
    //     if (myPlay !== null) {
    //         clearTimeout(myCheck);
    //         myPlay = null;
    //     }
    // };
    // const checkForSpeech = async () => {
    //     if ( await Speech.isSpeakingAsync() === true) {
    //         console.log("speaking " + myIdx);
    //         scheduleTheCheckSpeech();
    //     } else {
    //         console.log("Done speaking " + myIdx);
    //         myIdx++;
    //         myPlay = setTimeout(() => {  playLine(); }, 1000);
    //     }
    // };
    const pauseIt = () => {
        Speech.pause();
    };
    const resumeIt = () => {
        Speech.resume();
    };
    const restartIt = () => {
        Speech.stop();
        myIdx = 0;
        playLine();
    };
    const backward = () => {
        Speech.stop();
        if (myIdx > 0)
            myIdx--;
        playLine();
    };
    const forward = () => {
        Speech.stop();
        myIdx++;
        playLine();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text category='h5'>Audio Play</Text>
                <Button style={{ marginVertical: 4, backgroundColor: 'purple' }} onPress={getItAndPlay}>GetItAndPlay</Button>
                <Button style={{ marginVertical: 4, backgroundColor: 'purple' }} onPress={pauseIt}>Pause</Button>
                <Button style={{ marginVertical: 4, backgroundColor: 'purple' }} onPress={resumeIt}>Resume</Button>
                <Button style={{ marginVertical: 4, backgroundColor: 'purple' }} onPress={restartIt}>Restart</Button>
                <Button style={{ marginVertical: 4, backgroundColor: 'purple' }} onPress={backward}>Back</Button>
                <Button style={{ marginVertical: 4, backgroundColor: 'purple' }} onPress={forward}>Forward</Button>

            </Layout>
        </SafeAreaView>
    );
};


