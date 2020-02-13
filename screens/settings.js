import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native'
import {SafeAreaView} from "react-navigation";
import {Layout, Select, Text, Toggle} from "@ui-kitten/components";
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
                headerTitle: () => <ScreenTitle title={"Settings"}/>,
                headerRight: () => <ThemeButton/>,
            };
        } catch (error) {
            myfuncs.mySentry(error);
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
            myfuncs.mySentry(error);
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
            myfuncs.mySentry(error);
        }
    };
    getVoices = async () => {
        let list = await Speech.getAvailableVoicesAsync();
        if (list !== null && list.length > 1 )
            this.setState({bVoicesAvailable: true});
    };
    goToSettingsAudio = () => {
        try {
            myfuncs.myBreadCrumbs('goToSettingsAudio', this.props.navigation.state.routeName);
            this.props.navigation.navigate("SettingsAudio");
        } catch (error) {
            myfuncs.mySentry(error);
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

                            text='Keep Screen Awake'
                            textStyle={styles.text}
                            checked={this.state.settings.keep_awake}
                            onChange={(bEvent) => this.updateSettings({keep_awake: bEvent})}
                        />

                        <Toggle
                            style={styles.toggle}
                            status='warning'

                            text='Play Ribbit After Each Story'
                            textStyle={styles.text}
                            checked={this.state.settings.playEndOfStoryRibbit}
                            onChange={(bEvent) => this.updateSettings({playEndOfStoryRibbit: bEvent})}
                        />

                        <View style={{paddingTop: 5}}/>

                        { (this.state.settings.retrieved_user_data === true) &&
                            <View>
                                <Select
                                style={styles.select}
                                data={pause_data}
                                status='warning'
                                label='Pause between each line'
                                onSelect={(event) =>
                                    this.updateSettings({pauseLineIdx: event.idx})}
                                selectedOption={pause_data[this.state.settings.pauseLineIdx]}
                                textStyle={styles.textStyle}
                                labelStyle={styles.labelStyle}
                                controlStyle={styles.controlStyle}
                                />
                                <Select
                                    style={styles.select}
                                    data={pause_data}
                                    status='warning'
                                    label='Pause between each story'
                                    onSelect={(event) =>
                                        this.updateSettings({pauseStoryIdx: event.idx})}
                                    selectedOption={pause_data[this.state.settings.pauseStoryIdx]}
                                    textStyle={styles.textStyle}
                                    labelStyle={styles.labelStyle}
                                    controlStyle={styles.controlStyle}
                                />

                                <Select
                                    style={styles.select}
                                    data={pitch_data}
                                    status='warning'
                                    label='Voice pitch'
                                    onSelect={(event) =>
                                        this.updateSettings({pitchIdx: event.idx})}
                                    selectedOption={pitch_data[this.state.settings.pitchIdx]}
                                    textStyle={styles.textStyle}
                                    labelStyle={styles.labelStyle}
                                    controlStyle={styles.controlStyle}
                                />
                                <Select
                                    style={styles.select}
                                    data={rate_data}
                                    status='warning'
                                    label='Voice speed'
                                    onSelect={(event) =>
                                        this.updateSettings({rateIdx: event.idx})}
                                    selectedOption={rate_data[this.state.settings.rateIdx]}
                                    textStyle={styles.textStyle}
                                    labelStyle={styles.labelStyle}
                                    controlStyle={styles.controlStyle}
                                />
                            </View>
                        }
                        {this.state.bVoicesAvailable === true &&
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
            myfuncs.mySentry(error);
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
            myfuncs.mySentry(error);
        }
    };
    updateStorage = async () => {
        try {
            myfuncs.myBreadCrumbs('updateStorage', this.props.navigation.state.routeName);
            await myfuncs.writeUserDataToLocalStorage("user_settings", this.props.settings);
            // console.log("storage updated NewSettings:", this.props.settings);
        } catch (error) {
            myfuncs.mySentry(error);
        }
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
    toggle: {
        margin: 6,
    },
    select: {
        margin: 6,
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



