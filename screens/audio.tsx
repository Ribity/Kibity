import React from 'react';
import { SafeAreaView } from 'react-navigation';
import {Button, Layout, Text} from '@ui-kitten/components';
import * as Speech from 'expo-speech';

let myStory;
export const AudioScreen = ({ navigation }) => {
    const getItAndPlay = () => {
        myStory = require("../assets/stories/testTwoStory.json");
        playLine(0);
    };
    const playLine = (idx) => {
        if (idx < myStory.line.length) {
            console.log(myStory.line[idx]);
            sayIt(myStory.line[idx]);
            setTimeout(() => {
                checkForSpeech(idx)
            }, 1000);
        } else {
            console.log("Finished story");
        }
    };
    const checkForSpeech = async (idx) => {
        if ( await Speech.isSpeakingAsync() === true) {
            console.log("speaking " + idx);
            let mSecs = 500;

            setTimeout(() => {  checkForSpeech(idx) }, mSecs);
        } else {
            console.log("Done speaking " + idx);
            playLine(idx+1);
        }
    };

    const sayIt = (myText) => {
        Speech.speak(myText, {
            // voice: "com.apple.ttsbundle.Samantha-compact",
            // language: 'en',
            pitch: 0.9,
            rate: 0.8,
            // onDone: this.Done,
            // onStopped: this.Stopped,
            // onStart: this.Started,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text category='h5'>Audio Play</Text>
                <Button style={{ marginVertical: 4, backgroundColor: 'purple' }} onPress={getItAndPlay}>GetItAndPlay</Button>
            </Layout>
        </SafeAreaView>
    );
};


