import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native'
import {SafeAreaView} from "react-navigation";
import {Layout, Select, SelectItem, Text, Toggle} from "@ui-kitten/components";
import myfuncs from "../services/myFuncs";
import MyDefines from "../constants/MyDefines";
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateSettings} from "../actions/settingsActions";
import {ScreenTitle} from "../components/screenTitle";
import {ThemeButton} from "../components/themeButton";
import {MyButton} from "../components/MyButton";
import myStyles from "../myStyles";
import * as Speech from "expo-speech";

const {height, width} = Dimensions.get('window');

const pause_data = MyDefines.pause_data;
const pitch_data = MyDefines.pitch_data;
const rate_data = MyDefines.rate_data;

class SettingsScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'SettingsScreen');
            return {
                headerLeft: () => <MyButton onPress={() => navigation.navigate("About")} title={"About"}/>,
                headerTitle: () => <ScreenTitle title={"Settings"} privacy={() => navigation.navigate("PrivacySettings")}/>,
                headerRight: () => <ThemeButton/>,
            };
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            settings: this.props.settings,
            bVoicesAvailable: false,
        };
    };
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('Did mount', this.props.navigation.state.routeName);
            this.getVoices();
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState){
        try {
            myfuncs.myBreadCrumbs('getDerivedStateFromProps', "Settings");
            let update = {};

            if (prevState.settings !== nextProps.settings) {
                update.settings = nextProps.settings;
            }
            return Object.keys(update).length ? update: null;
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    getVoices = async () => {
        try {
            myfuncs.myBreadCrumbs('getDerivedStateFromProps', "Settings");
            let list = await Speech.getAvailableVoicesAsync();
            if (list !== null  && list !== undefined && list.length > 1 ) {
                // console.log(list);
                this.setState({bVoicesAvailable: true});
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    goToSettingsAudio = () => {
        try {
            myfuncs.myBreadCrumbs('goToSettingsAudio', this.props.navigation.state.routeName);
            this.props.navigation.navigate("SettingsAudio");
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
            return (
                <SafeAreaView style={styles.container}>
                    <Layout style={{flex: 1, paddingLeft: 10, alignItems: 'flex-start'}}>

                        <Toggle
                            style={styles.toggle}
                            status='warning'
                            checked={this.state.settings.keep_awake}
                            onChange={(bEvent) => this.updateSettings({keep_awake: bEvent})}>
                            Keep Screen Awake
                        </Toggle>


                        <Toggle
                            style={styles.toggle}
                            status='warning'

                            textStyle={styles.text}
                            checked={this.state.settings.playEndOfStoryRibbit}
                            onChange={(bEvent) => this.updateSettings({playEndOfStoryRibbit: bEvent})}>
                            Play Ribbit After Each Story
                        </Toggle>

                        <View style={{paddingTop: 5}}/>

                        { (this.state.settings.retrieved_user_data === true) &&
                            <View>
                                <Select
                                    style={styles.select}
                                    status='warning'
                                    label='Pause between each line'
                                    value={pause_data[this.state.settings.pauseLineIdx].text}
                                    onSelect={(index) => this.updateSettings({pauseLineIdx: index-1})} >

                                    {pause_data.map((pause, index) => <SelectItem key={index} title={pause.text} />)}
                                </Select>

                                <Select
                                    style={styles.select}
                                    status='warning'
                                    label='Pause between each story'
                                    value={pause_data[this.state.settings.pauseStoryIdx].text}
                                    onSelect={(index) => this.updateSettings({pauseStoryIdx: index-1})} >

                                    {pause_data.map((pause, index) => <SelectItem key={index} title={pause.text} />)}
                                </Select>

                                <Select
                                    style={styles.select}
                                    status='warning'
                                    label='Voice pitch'
                                    value={pitch_data[this.state.settings.pitchIdx].text}
                                    onSelect={(index) => this.updateSettings({pitchIdx: index-1})} >

                                    {pitch_data.map((pitch, index) => <SelectItem key={index} title={pitch.text} />)}
                                </Select>
                                <Select
                                    style={styles.select}
                                    status='warning'
                                    label='Voice speed'
                                    value={rate_data[this.state.settings.rateIdx].text}
                                    onSelect={(index) => this.updateSettings({rateIdx: index-1})}>

                                    {rate_data.map((rate, index) => <SelectItem key={index} title={rate.text} />)}
                                </Select>

                            </View>
                        }
                        {(!myfuncs.isAndroid() && this.state.bVoicesAvailable === true) &&
                        <View style={{alignSelf: 'center'}}>
                            <View style={{padding: 5}}/>
                            <MyButton buttonStyle={myStyles.selectButton}
                                      textStyle={myStyles.selectButtonText}
                                      onPress={() => this.goToSettingsAudio()}
                                      title="Select Voice"/>
                        </View>
                        }
                    </Layout>

                    <MyHelpIcon onPress={this.onHelpPress}/>
                    <MyHelpModal screen={"Settings"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>
                </SafeAreaView>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    updateSettings = async (new_prop) => {
        try {
            myfuncs.myBreadCrumbs('updateSettings', this.props.navigation.state.routeName);
            let new_settings = {...this.state.settings, ...new_prop};

            // Note, no need to update state, because state auto-updates in getDerivedState
            // await this.setState({settings: new_settings});
            await this.props.updateSettings(new_settings);
            await this.updateStorage();

            if (new_prop.keep_awake !== undefined) {
                myfuncs.setAwakeorNot(new_prop.keep_awake);
            }
        } catch (error) {
            console.log(error);
            myfuncs.myRepo(error);
        }
    };
    updateStorage = async () => {
        try {
            myfuncs.myBreadCrumbs('updateStorage', this.props.navigation.state.routeName);
            await myfuncs.writeUserDataToLocalStorage("user_settings", this.props.settings);
            // console.log("storage updated NewSettings:", this.props.settings);
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onHelpPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: true});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onHelpExitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onHelpExitPress', this.props.navigation.state.routeName);
            this.setState({isModalVisible: false});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyDefines.myTabColor,
    },
    toggle: {
        margin: 6,
    },
    select: {
        margin: 6,
        width: width-30,
    },
    text: {
        color: 'mediumpurple',
        fontSize: 15,
    },
    textStyle: {
        color: 'mediumpurple',

        fontSize: 20,
        lineHeight: 22,
        alignSelf: 'center',
    },
    labelStyle: {
        color: 'mediumpurple',
        fontSize: 15,
    },
    controlStyle: {
        borderRadius: 8,
        width: width-30,
        color: 'mediumpurple',
    },

    buttonText: {textAlign: 'center', color: 'mediumpurple', fontSize: 20, fontWeight: 'bold'},

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



