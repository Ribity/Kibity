import React from 'react';
import {SafeAreaView} from "react-navigation";
import {Button, Layout, Text} from "@ui-kitten/components";
export default class AudioScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    };
    navigateAudio = () => {
        this.props.navigation.navigate("Audio");
    };
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text category='h5'>List of Stories</Text>
                    <Button style={{ marginVertical: 4, backgroundColor: 'purple' }}
                            onPress={this.navigateAudio}>Audio</Button>
                </Layout>
            </SafeAreaView>
        );
    }
};