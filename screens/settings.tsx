// import React from 'react';
// import { SafeAreaView } from 'react-navigation';
// import {Layout, Text, Button} from '@ui-kitten/components';
//
// export const SettingsScreen = ({ navigation }) => {
//
//     const navigateAudio = () => {
//         navigation.navigate('Audio');
//     };
//
//     return (
//         <SafeAreaView style={{ flex: 1 }}>
//             <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                 <Text category='h1'>Settings</Text>
//                 <Button style={{ marginVertical: 4, backgroundColor: 'purple' }} onPress={navigateAudio}>Audio</Button>
//             </Layout>
//         </SafeAreaView>
//     );
// };

import React from 'react';
import SettingsList from 'react-native-settings-list';
import { SafeAreaView } from 'react-navigation';
import {Layout} from '@ui-kitten/components';
import { ThemeContext } from '../theme-context';

export const SettingsScreen = ({ navigation }) => {
    const themeContext = React.useContext(ThemeContext);

    const onItemPress = () => {
        themeContext.toggleTheme();
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout>
                <SettingsList borderColor={'purple'} defaultItemSize={50}>
                    <SettingsList.Item
                        hasSwitch={true}
                        switchState={true}
                        switchOnValueChange={onItemPress}
                        hasNavArrow={false}
                        title='Dark/Light'
                        titleStyle={{fontSize:20}}
                    />
                    <SettingsList.Item
                        title='Dark/Light'
                        titleInfo='Dark/Light'
                        titleStyle={{fontSize:20}}
                        hasNavArrow={true}
                        onPress={() => {onItemPress()}}
                    />

                </SettingsList>
            </Layout>
        </SafeAreaView>
    );
};


