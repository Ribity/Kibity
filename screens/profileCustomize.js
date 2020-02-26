import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert
} from 'react-native';
import {Layout, Text, Radio} from '@ui-kitten/components';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';

import { connect } from 'react-redux';

import myStyles from "../myStyles";

import myfuncs from "../services/myFuncs";
import {MyHelpIcon} from '../components/MyHelpIcon';
import {MyHelpModal} from "../components/MyHelpModal";
import {MyButton} from "../components/MyButton";
import {ScreenTitle} from "../components/screenTitle";
import MyDefines from "../constants/MyDefines";
import {bindActionCreators} from "redux";
import {updateProfiles} from "../actions/profilesActions";
import * as Speech from "expo-speech";

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
// TextInput.defaultProps.allowFontScaling=false;

const characters_list =  [
    {idx: 0, text: 'Main Character'},
    {idx: 1, text: 'Second Character'},
    {idx: 2, text: 'Third Character'},
    {idx: 3, text: 'Guardian #1'},
    {idx: 4, text: 'Guardian #2'},
    {idx: 5, text: 'Guardian #3'},
];

class ProfileCustomize extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AudioScreen');
            const { params = {} } = navigation.state;
            return {
                headerTitle: () => <ScreenTitle title={"Customize"} second={params.profileNum}/>,
            };
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            // profiles: this.props.profiles,
            profiles: JSON.parse(JSON.stringify(this.props.profiles)),
            customizeIdx: 0,
            submitPressed: false,
            textIsFocused: false,
        };
    }
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('Did Mount', this.props.navigation.state.routeName);
            // console.log("ProfileCustomize DidMount");
            // console.log(this.props.profiles);
            this.checkCustomizeIdxParm();
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    // static getDerivedStateFromProps(nextProps, prevState){
    //     try {
    //         myfuncs.myBreadCrumbs('getDerivedStateFromProps', "ProfileCustomize");
    //         let update = {};
    //         if (prevState.profiles !== nextProps.profiles) {
    //             update.profiles = JSON.parse(JSON.stringify(nextProps.profiles));
    //         }
    //         return Object.keys(update).length ? update: null;
    //     } catch (error) {
    //         myfuncs.myRepo(error);
    //         return null;
    //     }
    // };
    checkCustomizeIdxParm = () => {
        try {
            myfuncs.myBreadCrumbs('checkCustomizeIdxParm', this.props.navigation.state.routeName);
            let customizeIdx = this.props.navigation.getParam('customizeIdx', 0);
            this.setState({customizeIdx: customizeIdx});
            let profileNumText = "Profile #" + (customizeIdx+1);
            this.props.navigation.setParams({profileNum: profileNumText});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    onSubmitPress = async (test) => {
        try {
            myfuncs.myBreadCrumbs('onSubmitPress', this.props.navigation.state.routeName);
            let myProfile = this.state.profiles.profile[this.state.customizeIdx];

            for (let i = 0; i < characters_list.length; i++) {
                if (myProfile.character[i].name.indexOf(' ') === 0) {
                    Alert.alert("Error with input for " + characters_list[i].text,
                        "First character cannot be a space");
                    return;
                }
                if (myProfile.character[i].name.length < 1) {
                    Alert.alert("Error with input for " + characters_list[i].text,
                        "Please ensure the field actually contains a value");
                    return;
                }
            }
            if (myProfile.city.indexOf(' ') === 0) {
                Alert.alert("Error with input for city",
                    "First character cannot be a space");
                return;
            }
            if (myProfile.city.length < 1) {
                Alert.alert("Error with input for city",
                    "Please ensure the city actually contains a value");
                return;
            }

            if (myProfile.pet.indexOf(' ') === 0) {
                Alert.alert("Error with input for Type of Pet",
                    "First character cannot be a space");
                return;
            }
            if (myProfile.pet.length < 1) {
                Alert.alert("Error with input for Type of pet",
                    "Please ensure the pet actually contains a value");
                return;
            }

            if (myProfile.petName.indexOf(' ') === 0) {
                Alert.alert("Error with input for pet's name",
                    "First character cannot be a space");
                return;
            }
            if (myProfile.petName.length < 1) {
                Alert.alert("Error with input for pet's name",
                    "Please ensure the pet's name actually contains a value");
                return;
            }

            if (test) {
                this.testInputFields(myProfile);
            } else {
                this.refs.toast.show("Saved", 1000);
                this.refs.toast_bottom.show("Saved", 1000);
                this.props.updateProfiles(this.state.profiles);
                await myfuncs.writeUserDataToLocalStorage("user_profiles", this.state.profiles);
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    testInputFields = (myProfile) => {
        let text = "";

        let pronoun = ['he', 'she', 'they'];
        for (let i=0; i<6; i++)
            text += myProfile.character[i].name + ', ' + pronoun[myProfile.character[i].pronoun] + ', ';
        text +=  ' city is ' + myProfile.city + ', ' ;
        text +=  ' pet is a ' + myProfile.pet + ', ' ;
        text += 'named ' + myProfile.petName + ', ' ;
        text +=  ' favorite celebrity is ' + myProfile.celebrity + ', ' ;
        text += '  ' + myProfile.event + ', ';
        text +=  ' favorite snacks are ' + myProfile.snack + ', ' ;

        this.speak(text);
    };
    speak = (text) => {
        Speech.stop();

        // console.log(this.state.voice);
        Speech.speak(text, {
            voice: this.props.settings.voice.identifier,
            // language: this.state.language,
            // pitch: pitch_data[this.props.settings.pitchIdx].value,
            // rate: pitch_data[this.props.settings.rateIdx].value,
        });
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);

            // let androidPad = myfuncs.androidPadding(this.state.textIsFocused, 200);

            return (
                <KeyboardAwareScrollView
                    style={myStyles.firstContainer}
                    resetScrollToCoords={{x:0, y:0}}
                    keyboardShouldPersistTaps={'handled'}
                    blurOnSubmit={false}
                    onSubmitEditing={this.onSubmitPress}
                    contentContainerStyle={myStyles.container}
                >
                    <Layout style={myStyles.container}>

                    <View style={{marginTop: 20}}/>

                        <MyButton buttonStyle={myStyles.selectButton}
                                  textStyle={myStyles.selectButtonText}
                                  onPress={() => this.onSubmitPress(false)}
                                  title={"Save"}/>

                        {this.state.profiles.profile[this.state.customizeIdx].character.map((character, index) => (
                            <View key={character.idx}>
                                <Text style={myStyles.iFieldLabel}>Name of {characters_list[index].text}</Text>
                                <TextInput style={myStyles.iField}
                                           value={this.state.profiles.profile[this.state.customizeIdx].character[index].name}
                                           onChangeText={(text) => this.updateStateChar({name: text}, index)}
                                           clearButtonMode='always'
                                           placeholder={characters_list[index].text}
                                           returnKeyType='done'
                                           placeholderTextColor={"grey"}
                                           maxLength={30}
                                           onFocus={this.handleInputFocus}
                                           onBlur={this.handleInputBlur}
                                />
                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <Radio style={styles.radioHe}
                                           text='He' status='warning'
                                           onChange={(isChecked) => this.updateStateGender(isChecked,index, 0 )}
                                           checked={this.state.profiles.profile[this.state.customizeIdx].character[index].pronoun === 0}/>
                                    <Radio style={styles.radioShe}
                                           text='She' status='warning'
                                           onChange={(isChecked) => this.updateStateGender(isChecked,index, 1 )}
                                           checked={this.state.profiles.profile[this.state.customizeIdx].character[index].pronoun === 1}/>
                                    <Radio style={styles.radioThey}
                                           text='They' status='warning'
                                           onChange={(isChecked) => this.updateStateGender(isChecked,index, 2 )}
                                           checked={this.state.profiles.profile[this.state.customizeIdx].character[index].pronoun === 2}/>
                                </View>
                            </View>
                        ))}

                        <Text style={myStyles.iFieldLabel}>Name of a town/city</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.profiles.profile[this.state.customizeIdx].city}
                                   onChangeText={(text) => this.updateState({city: text})}
                                   clearButtonMode='always'
                                   placeholder={"City"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={100}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />
                        <Text style={myStyles.iFieldLabel}>Type of animal/pet</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.profiles.profile[this.state.customizeIdx].pet}
                                   onChangeText={(text) => this.updateState({pet: text})}
                                   clearButtonMode='always'
                                   placeholder={"Pet"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={40}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />
                        <Text style={myStyles.iFieldLabel}>Pet's name</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.profiles.profile[this.state.customizeIdx].petName}
                                   onChangeText={(text) => this.updateState({petName: text})}
                                   clearButtonMode='always'
                                   placeholder={"Pet Name"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={30}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />
                        <Text style={myStyles.iFieldLabel}>Favorite Living Celebrity</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.profiles.profile[this.state.customizeIdx].celebrity}
                                   onChangeText={(text) => this.updateState({celebrity: text})}
                                   clearButtonMode='always'
                                   placeholder={"Famous Person"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={100}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />
                        <Text style={myStyles.iFieldLabel}>Event:</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.profiles.profile[this.state.customizeIdx].event}
                                   onChangeText={(text) => this.updateState({event: text})}
                                   clearButtonMode='always'
                                   placeholder={"event"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={100}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />
                        <Text style={myStyles.iFieldLabel}>Favorite snacks (plural)</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.profiles.profile[this.state.customizeIdx].snack}
                                   onChangeText={(text) => this.updateState({snack: text})}
                                   clearButtonMode='always'
                                   placeholder={"snacks"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={100}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />

                        <View style={{paddingTop: 15}}/>
                        <MyButton buttonStyle={myStyles.selectButton}
                                  textStyle={myStyles.selectButtonText}
                                  onPress={() => this.onSubmitPress(true)}
                                  title={"Test"}/>

                        <View style={{paddingTop: 15}}/>
                        <MyButton buttonStyle={myStyles.selectButton}
                                  textStyle={myStyles.selectButtonText}
                                  onPress={() => this.onSubmitPress(false)}
                                  title={"Save"}/>

                        <Toast
                        ref="toast"
                        style={{backgroundColor:'mediumpurple',borderRadius: 20,padding: 10}}
                        position='top'
                        positionValue={0}
                        fadeOutDuration={1000}
                        opacity={.8}
                        textStyle={{color:'gold',fontSize:21}}
                        />
                        <Toast
                            ref="toast_bottom"
                            style={{backgroundColor:'mediumpurple',borderRadius: 20,padding: 10}}
                            position='bottom'
                            positionValue={0}
                            fadeOutDuration={1000}
                            opacity={.8}
                            textStyle={{color:'gold',fontSize:21}}
                        />

                    <MyHelpIcon onPress={this.onHelpPress}/>
                    <MyHelpModal screen={"ProfileCustomize"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>

                        <View style={{marginBottom: 50}}/>


                    </Layout>
                </KeyboardAwareScrollView>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    handleInputFocus = () => this.setState({ textIsFocused: true });
    handleInputBlur = () => this.setState({ textIsFocused: false });
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
    updateStateGender = (isChecked, charIdx, value) => {
        try {
            myfuncs.myBreadCrumbs('updateStateGender', this.props.navigation.state.routeName);
            // console.log("updateStateGender: ", isChecked, charIdx, " ", value);

            // We only need to update something if user is clicking a radio that is not the active radio.
            if (isChecked === true) {
                if (this.state.profiles.profile[this.state.customizeIdx].character[charIdx].pronoun !== value) {
                    this.state.profiles.profile[this.state.customizeIdx].character[charIdx].pronoun = value;

                    this.updateStateChar({pronoun: value}, charIdx);
                }
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    updateStateChar = (new_prop, charIdx) => {
        try {
            myfuncs.myBreadCrumbs('updateStateChar', this.props.navigation.state.routeName);
            let newProfiles = {...this.state.profiles};
            newProfiles.profile[this.state.customizeIdx].character[charIdx] =
                {...newProfiles.profile[this.state.customizeIdx].character[charIdx], ...new_prop};
            this.setState({profiles: newProfiles});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    updateState = (new_prop) => {
        try {
            myfuncs.myBreadCrumbs('updateState', this.props.navigation.state.routeName);
            let newProfiles = {...this.state.profiles};
            newProfiles.profile[this.state.customizeIdx] =
                {...newProfiles.profile[this.state.customizeIdx], ...new_prop};
            this.setState({profiles: newProfiles});
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
    radioHe: {
        backgroundColor: 'mediumpurple',
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
    },
    radioShe: {
        backgroundColor: 'mediumpurple',
    },
    radioThey: {
        backgroundColor: 'mediumpurple',
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    },
});

const mapStateToProps = (state) => {
    const { profiles } = state;
    const { settings } = state;
    return { profiles, settings }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateProfiles,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(ProfileCustomize);

