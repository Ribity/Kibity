import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
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

class ProfileCustomize extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AudioScreen');
            const { params = {} } = navigation.state;
            return {
                headerTitle: () => <ScreenTitle title={"Profiles"} second={params.profileNum}/>,
            };
        } catch (error) {
            myfuncs.mySentry(error);
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
        console.log("ProfileCustomize DidMount");
        this.checkCustomizeIdxParm();
    }
    checkCustomizeIdxParm = () => {
        let customizeIdx = this.props.navigation.getParam('customizeIdx', 0);
        this.setState({customizeIdx: customizeIdx});
        let profileNumText = "Profile #" + (customizeIdx+1);
        this.props.navigation.setParams({profileNum: profileNumText});
    };

    onSubmitPress = async () => {
        try {
            myfuncs.myBreadCrumbs('onSubmitPress', this.props.navigation.state.routeName);
            this.refs.toast.show("Saved", 1000);
            this.props.updateProfiles(this.state.profiles);
            await myfuncs.writeUserDataToLocalStorage("user_profiles", this.state.profiles);
        } catch (error) {
            myfuncs.mySentry(error);
        }
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
                                  onPress={this.onSubmitPress}
                                  title={"Save"}>

                        </MyButton>

                        <Text style={myStyles.iFieldLabel}>Name of Main Character</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.profiles.profile[this.state.customizeIdx].character[0].name}
                                   onChangeText={(text) => this.updateStateChar({name: text}, 0)}
                                   clearButtonMode='always'
                                   placeholder={"2nd Character"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={500}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <Radio style={styles.radioHe}
                                   text='He' status='warning'
                                   onChange={(isChecked) => this.updateStateGender(isChecked,0, 0 )}
                                   checked={this.state.profiles.profile[this.state.customizeIdx].character[0].pronoun === 0}/>
                            <Radio style={styles.radioShe}
                                   text='She' status='warning'
                                   onChange={(isChecked) => this.updateStateGender(isChecked,0, 1 )}
                                   checked={this.state.profiles.profile[this.state.customizeIdx].character[0].pronoun === 1}/>
                            <Radio style={styles.radioThey}
                                   text='They' status='warning'
                                   onChange={(isChecked) => this.updateStateGender(isChecked,0, 2 )}
                                   checked={this.state.profiles.profile[this.state.customizeIdx].character[0].pronoun === 2}/>
                        </View>

                        <Text style={myStyles.iFieldLabel}>Name of Second Character</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.profiles.profile[this.state.customizeIdx].character[1].name}
                                   onChangeText={(text) => this.updateStateChar({name: text}, 1)}
                                   clearButtonMode='always'
                                   placeholder={"2nd Character"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={500}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <Radio style={styles.radioHe}
                                   text='He' status='warning'
                                   onChange={(isChecked) => this.updateStateGender(isChecked,1, 0 )}
                                   checked={this.state.profiles.profile[this.state.customizeIdx].character[1].pronoun === 0}/>
                            <Radio style={styles.radioShe}
                                   text='She' status='warning'
                                   onChange={(isChecked) => this.updateStateGender(isChecked,1, 1 )}
                                   checked={this.state.profiles.profile[this.state.customizeIdx].character[1].pronoun === 1}/>
                            <Radio style={styles.radioThey}
                                   text='They' status='warning'
                                   onChange={(isChecked) => this.updateStateGender(isChecked,1, 2 )}
                                   checked={this.state.profiles.profile[this.state.customizeIdx].character[1].pronoun === 2}/>
                        </View>

                        <Text style={myStyles.iFieldLabel}>Name of Third Character</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.profiles.profile[this.state.customizeIdx].character[2].name}
                                   onChangeText={(text) => this.updateStateChar({name: text}, 2)}
                                   clearButtonMode='always'
                                   placeholder={"3rd Character"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={500}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <Radio style={styles.radioHe}
                                   text='He' status='warning'
                                   onChange={(isChecked) => this.updateStateGender(isChecked,2, 0 )}
                                   checked={this.state.profiles.profile[this.state.customizeIdx].character[2].pronoun === 0}/>
                            <Radio style={styles.radioShe}
                                   text='She' status='warning'
                                   onChange={(isChecked) => this.updateStateGender(isChecked,2, 1 )}
                                   checked={this.state.profiles.profile[this.state.customizeIdx].character[2].pronoun === 1}/>
                            <Radio style={styles.radioThey}
                                   text='They' status='warning'
                                   onChange={(isChecked) => this.updateStateGender(isChecked,2, 2 )}
                                   checked={this.state.profiles.profile[this.state.customizeIdx].character[2].pronoun === 2}/>
                        </View>

                        {/*<View style={{paddingTop: 15}}/>*/}
                        {/*<MyButton buttonStyle={myStyles.selectButton}*/}
                                  {/*textStyle={myStyles.selectButtonText}*/}
                                  {/*onPress={this.onSubmitPress}*/}
                                  {/*title={"Save"}>*/}
                        {/*</MyButton>*/}
                        {/*<View style={{paddingTop: 5}}/>*/}

                        <Text style={myStyles.iFieldLabel}>Name of a town/city</Text>
                        <TextInput style={myStyles.iField}
                                   value={this.state.profiles.profile[this.state.customizeIdx].city}
                                   onChangeText={(text) => this.updateState({city: text})}
                                   clearButtonMode='always'
                                   placeholder={"City"}
                                   returnKeyType='done'
                                   placeholderTextColor={"grey"}
                                   maxLength={500}
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
                                   maxLength={500}
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
                                   maxLength={500}
                                   onFocus={this.handleInputFocus}
                                   onBlur={this.handleInputBlur}
                        />

                        <View style={{paddingTop: 15}}/>
                        <MyButton buttonStyle={myStyles.selectButton}
                                  textStyle={myStyles.selectButtonText}
                                  onPress={this.onSubmitPress}
                                  title={"Save"}>

                        </MyButton>

                        <Toast
                        ref="toast"
                        style={{backgroundColor:'mediumpurple',borderRadius: 20,padding: 10}}
                        position='top'
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
            myfuncs.mySentry(error);
        }
    }
    handleInputFocus = () => this.setState({ textIsFocused: true });
    handleInputBlur = () => this.setState({ textIsFocused: false });
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
    updateStateGender = (isChecked, charIdx, value) => {
        console.log("updateStateGender: ", isChecked, charIdx, " ", value);

        // We only need to update something if user is clicking a radio that is not the active radio.
        if (isChecked === true) {
            if (this.state.profiles.profile[this.state.customizeIdx].character[charIdx].pronoun !== value) {
                this.state.profiles.profile[this.state.customizeIdx].character[charIdx].pronoun = value;

                this.updateStateChar({pronoun: value}, charIdx);
            }
        }
    };
    updateStateChar = (new_prop, charIdx) => {
        let newProfiles = {...this.state.profiles};
        newProfiles.profile[this.state.customizeIdx].character[charIdx] =
            {...newProfiles.profile[this.state.customizeIdx].character[charIdx], ...new_prop};
        this.setState({profiles: newProfiles});
    };
    updateState = (new_prop) => {
        let newProfiles = {...this.state.profiles};
        newProfiles.profile[this.state.customizeIdx] =
            {...newProfiles.profile[this.state.customizeIdx], ...new_prop};
        this.setState({profiles: newProfiles});
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
    return { profiles }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateProfiles,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(ProfileCustomize);

