import React from 'react';
import {SafeAreaView} from "react-navigation";
import {Layout} from "@ui-kitten/components";
import SettingsList from "react-native-settings-list";
import {ThemeButton} from "../components/themeButton";

export default class SettingsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    };

    onItemPress = () => {

    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Layout>
                    <ThemeButton/>
                    <SettingsList borderColor={'purple'} defaultItemSize={50}>
                        <SettingsList.Item
                            hasSwitch={true}
                            switchState={true}
                            switchOnValueChange={this.onItemPress}
                            hasNavArrow={false}
                            title='Dark/Light'
                            titleStyle={{fontSize:20}}
                        />
                        <SettingsList.Item
                            title='Dark/Light'
                            titleInfo='Dark/Light'
                            titleStyle={{fontSize:20}}
                            hasNavArrow={true}
                            onPress={() => {this.onItemPress()}}
                        />
                    </SettingsList>
                </Layout>
            </SafeAreaView>
        );
    }
};


