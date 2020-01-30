import React from 'react';
import { StyleSheet, Picker, View, Text } from 'react-native'
import {SafeAreaView} from "react-navigation";
import SettingsList from 'react-native-settings-list';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import myfuncs from "../services/myFuncs";
import MyDefines from "../constants/MyDefines";
import MyHelpIcon from "../components/MyHelpIcon";
import MyHelpModal from "../components/MyHelpModal";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateSettings} from "../actions/settingsActions";
import {ThemeButton} from "../components/themeButton";
import {ScreenTitle} from "../components/screenTitle";

class SettingsScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AudioScreen');
            return {
                headerTitle: () => <ScreenTitle title={"Settings"}/>,
            };
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            settings: this.props.settings,
            test: "test",
        };
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>

                {/*<ThemeButton/>*/}

                <SettingsList style={styles.listItem} defaultItemSize={50}>
                    <SettingsList.Item
                        hasSwitch={true}
                        switchState={this.state.settings.keep_awake}
                        switchOnValueChange={(bEvent) => this.updateUser({keep_awake: bEvent})}
                        hasNavArrow={false}
                        title='Keep Screen Awake'
                        titleStyle={styles.listTitle}
                        onTintColor='purple'
                        // backgroundColor='purple'
                        underlayColor='purple'
                    />
                    <SettingsList.Item
                        hasSwitch={true}
                        switchState={this.state.settings.playEndOfStoryRibbit}
                        switchOnValueChange={(bEvent) => this.updateUser({playEndOfStoryRibbit: bEvent})}
                        hasNavArrow={false}
                        title='Play Ribbit After Each Story'
                        titleStyle={styles.listTitle}
                    />
                    <SettingsList.Item
                        title='Audio Rate and Pitch'
                        // titleInfo='Audio'
                        titleInfoStyle={styles.titleInfoStyle}
                        titleStyle={styles.listTitle}
                        onPress={() => this.props.navigation.navigate("SettingsAudio")}
                    />

                    {/*<SettingsList.Header headerStyle={{marginTop:15}}/>*/}

                    <SettingsList.Item
                        title='About'
                        titleInfoStyle={styles.titleInfoStyle}
                        titleStyle={styles.listTitle}
                        onPress={() => this.props.navigation.navigate("SettingsAbout")}
                    />
                </SettingsList>

                <MyHelpIcon onPress={this.onHelpPress}/>
                <MyHelpModal screen={"Settings"}
                             onExitPress={this.onHelpExitPress}
                             isVisible={this.state.isModalVisible}/>
            </SafeAreaView>
        );
    }
    updateTest = async (value) => {
        try {
            console.log("Value:", value+1);
            this.setState({test: value});

        } catch (error) {
            console.log(error);
            myfuncs.mySentry(error);
        }
    };
    updateUser = async (new_prop) => {
        try {
            await this.setState({settings: {...this.state.settings, ...new_prop}});
            this.props.updateSettings(this.state.settings);
            await this.updateStorage();
            if (new_prop.keep_awake !== undefined) {
                if (new_prop.keep_awake === true) {
                    // console.log("settings activate keepAwake")
                    activateKeepAwake();
                } else {
                    // console.log("settings de-activate keepAwake")
                    deactivateKeepAwake();
                }
            }

        } catch (error) {
            console.log(error);
            myfuncs.mySentry(error);
        }
    };
    updateStorage = async () => {
        await myfuncs.writeUserSettingsToLocalStorage(this.props.settings);
        console.log("storage updated NewSettings:", this.props.settings);
    };
    onHelpPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: true});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    onHelpExitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpExitPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: false});
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyDefines.myTabColor,
    },
    titleInfoStyle: {
        fontSize: 20,
    },
    listItem: {
        borderColor: MyDefines.myTabColor,
    },
    listTitle: {
        fontSize:20,
        color: 'purple',
    },
});

const mapStateToProps = (state) => {
    const { settings } = state;
    return { settings }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateSettings,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);



