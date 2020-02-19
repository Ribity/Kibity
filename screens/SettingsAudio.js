import React from 'react';
import {
    Text,
    View,
    Picker,
    TextInput, StyleSheet, Dimensions,
} from 'react-native';
import * as Speech from 'expo-speech';

import myfuncs from "../services/myFuncs";
import Toast from 'react-native-easy-toast';

import {MyButton} from "../components/MyButton";
import {ScreenTitle} from "../components/screenTitle";
import MyDefines from "../constants/MyDefines";
import {SafeAreaView} from "react-navigation";
import {Layout} from "@ui-kitten/components";
import {ThemeButton} from "../components/themeButton";
import {bindActionCreators} from "redux";
import {updateSettings} from "../actions/settingsActions";
import {connect} from "react-redux";
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";


const {height, width} = Dimensions.get('window');

const pitch_data = MyDefines.pitch_data;
const rate_data = MyDefines.rate_data;

class SettingsAudio extends React.Component {
    static navigationOptions = ({navigation}) => {
            try {
            myfuncs.myBreadCrumbs('navigationOptions', 'SettingsAudio');
            return {
                headerTitle: () => <ScreenTitle title={"Settings"} second={"Audio"}/>,
                headerRight: () => <ThemeButton/>,

            };
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            myText: "This is only a test. If you like this voice, hit, save this voice",
            voice: JSON.parse(JSON.stringify(this.props.settings.voice)),
            voice_list: [],
        };
    }
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('Did mount', this.props.navigation.state.routeName);
            this.getVoices();
        } catch (error) {
            myfuncs.mySentry(error);
        }
    }
    getVoices = async () => {
        try {
            myfuncs.myBreadCrumbs('Did mount', this.props.navigation.state.routeName);
            let list = await Speech.getAvailableVoicesAsync();

            // myfuncs.mySentry(list);
            // console.log(list);
            await this.setState({voice_list: list});
            if (this.state.voice === "" || this.state.voice === null) {
                let idx = list.length;
                if (idx > 1) {
                    idx = idx / 2;  // start with one in the middle of the list
                    this.setState({voice: list[idx]});
                }
            }
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
            // let pitchStr = pitch_data[this.state.pitchIdx].toString();
            // let rateStr = rate_data[this.state.rateIdx].toString();
            // let rateStr = this.state.rate.toFixed(1).toString();

            let voices = this.state.voice_list.map( (v, i) => {
                return <Picker.Item label={v.name}  value={v.identifier} key={v.identifier}/>
            });

            return (
                <SafeAreaView style={styles.container}>
                    <Layout style={{flex: 1, alignItems: 'center'}}>
                        <View style={{paddingTop: 10}}/>

                        {this.props.settings.voice === "" &&
                            <View>
                            <Text style={styles.thisText}>You're currently using the default</Text>
                            <Text style={styles.thisText}>voice of your device for your</Text>
                            <Text style={styles.thisText}>Kibity presentation voice</Text>
                            </View>
                        }
                        {/*<Text style={myStyles.iFieldLabel}>This text will be spoken:</Text>*/}
                        {/*<TextInput style={styles.iField}*/}
                               {/*value={this.state.myText}*/}
                               {/*onChangeText={(text) => this.setState({myText: text})}*/}
                               {/*clearButtonMode='always'*/}
                               {/*placeholder={"enter text here"}*/}
                               {/*returnKeyType='done'*/}
                               {/*placeholderTextColor={"grey"}*/}
                               {/*maxLength={200}*/}
                        {/*/>*/}

                        <View style={{paddingTop: 10}}/>
                        <MyButton title={'Test a new voice'} onPress={this.speak}/>
                        <View style={{paddingTop: 10}}/>
                        <MyButton title={'Save new voice'} onPress={this.updateSettings}/>
                        {/*<View style={{paddingTop: 10}}/>*/}
                        {/*<View style={{flexDirection: 'row'}}>*/}
                            {/*<MyButton title={'Decrease'} onPress={this.decreasePitch}/>*/}
                            {/*<Text style={styles.thisText}> Pitch {pitchStr} </Text>*/}
                            {/*<MyButton title={'Increase'} onPress={this.increasePitch}/>*/}
                        {/*</View>*/}
                        {/*<View style={{paddingTop: 10}}/>*/}
                        {/*<View style={{flexDirection: 'row'}}>*/}
                            {/*<MyButton title={'Decrease'} onPress={this.decreaseRate}/>*/}
                            {/*<Text style={styles.thisText}> Rate {rateStr} </Text>*/}
                            {/*<MyButton title={'Increase'} onPress={this.increaseRate}/>*/}
                        {/*</View>*/}

                        <View style={{paddingTop: 10}}/>

                    {this.state.voice_list.length > 0 &&
                        <View>
                            <Text style={styles.thisText}>Select a voice to test/save</Text>

                            <View style={{alignSelf: 'center'}}>
                                <Picker
                                    selectedValue={this.state.voice.identifier}
                                    style={{height: 50, width: 200, borderRadius: 10}}
                                    itemStyle={{backgroundColor: 'goldenrod', color: 'purple', borderRadius: 10}}
                                    onValueChange={(identifier) =>
                                        (this.setVoiceState(identifier))}>
                                    {voices}
                                </Picker>
                            </View>
                        </View>
                    }
                    </Layout>

                    <Toast
                        ref="toast"
                        style={{backgroundColor:'mediumpurple',borderRadius: 20,padding: 10}}
                        position='top'
                        positionValue={0}
                        fadeOutDuration={1000}
                        opacity={.9}
                        textStyle={{color:'gold',fontSize:21}}
                    />

                    <MyHelpIcon onPress={this.onHelpPress}/>
                    <MyHelpModal screen={"SettingsAudio"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>
                </SafeAreaView>
            );
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    setVoiceState = (identifier) => {
        // console.log(identifier);
        for (let i=0; i<this.state.voice_list.length; i++) {
            if (this.state.voice_list[i].identifier === identifier){
                // console.log("Found");
                this.setState({voice: this.state.voice_list[i]});
                break;
            }
        }
    };
    updateSettings = async () => {
        try {
            myfuncs.myBreadCrumbs('updateSettings', this.props.navigation.state.routeName);

            // console.log(this.state.voice);
            let new_settings = {...this.props.settings, ...{
                    voice: this.state.voice,
                }};
            await this.props.updateSettings(new_settings);
            await this.updateStorage();

            this.refs.toast.show("New voice saved", 2000);

        } catch (error) {
            // console.log(error);
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

    speak = () => {
        Speech.stop();

        // console.log(this.state.voice);
        Speech.speak(this.state.myText, {
            voice: this.state.voice.identifier,
            // language: this.state.language,
            pitch: pitch_data[this.props.settings.pitchIdx].value,
            rate: pitch_data[this.props.settings.rateIdx].value,
        });
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

    // increasePitch = () => {
    //     this.setState(state => ({
    //         ...state,
    //         pitch: state.pitch + 0.1,
    //     }));
    // };
    // decreasePitch = () => {
    //     this.setState(state => ({
    //         ...state,
    //         pitch: state.pitch - 0.1,
    //     }));
    // };
    // increaseRate = () => {
    //     this.setState(state => ({
    //         ...state,
    //         rate: state.rate + 0.1,
    //     }));
    // };
    // decreaseRate = () => {
    //     this.setState(state => ({
    //         ...state,
    //         rate: state.rate - 0.1,
    //     }));
    // };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyDefines.myTabColor,
    },
    thisContainer: {
        flex: 1,
        width: width,
        // backgroundColor: 'lightgrey',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
        paddingTop: 100
    },
    thisText: {
        fontSize: 17,
        alignSelf: 'center',
        color: 'mediumpurple',
        fontWeight: 'bold',
    },
    iField: {
        width: width-20,
        height: 30,
        borderWidth: 1,
        paddingLeft: 5,
        borderRadius: 10,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'mediumpurple',
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
export default connect(mapStateToProps, mapDispatchToProps)(SettingsAudio);


//     Array [
// Object {
//     "identifier": "com.apple.ttsbundle.Maged-compact",
//     "language": "ar-SA",
//     "name": "Maged",
//     "quality": "Default",
// },
// Object {
//     "identifier": "com.apple.ttsbundle.Zuzana-compact",
//         "language": "cs-CZ",
//         "name": "Zuzana",
//         "quality": "Default",
// },
