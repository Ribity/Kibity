import React from 'react';
import { SafeAreaView } from 'react-navigation';
import {Layout, Text, Button} from '@ui-kitten/components';

export const ProfilesScreen = ({ navigation }) => {

    const navigateAudio = () => {
        navigation.navigate('Audio');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text category='h5'>Configure Profiles Here</Text>
                <Button style={{ marginVertical: 4, backgroundColor: 'purple' }} onPress={navigateAudio}>Audio</Button>
            </Layout>
        </SafeAreaView>
    );
};
