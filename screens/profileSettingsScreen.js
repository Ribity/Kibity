import React from 'react';
import {
    Text,
    View,
    Alert,
    TextInput,
    Keyboard,
    TouchableHighlight,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';

import { connect } from 'react-redux';

import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";
import MyTouchableLogo from '../components/MyTouchableLogo';
import MyHelpIcon from '../components/MyHelpIcon';
import MyHelpModal from "../components/MyHelpModal";
import MyButton from "../components/MyButton";

//***********************************************************************************
// The idea here is to NOT perform the reverseGeo often because each one cost money.
//***********************************************************************************

class ProfileSettingsScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'ProfileSettingsScreen');
            return {
                headerTitle:
                    <View style={{alignItems: 'center'}}>
                        <Text style = {{color: 'green', fontWeight: 'bold', fontSize: 18}}>
                            Settings
                        </Text>
                        <Text style = {{color: 'green', fontWeight: 'bold', fontSize: 18}}>
                            Map Settings
                        </Text>
                    </View>
                ,
                headerLeft:
                    <MyTouchableLogo onPress={() => navigation.navigate("Audio")}/>,
                headerRight:
                    <TouchableHighlight style={myStyles.myHeaderTouch}  onPress={() => navigation.navigate("Profiles")}>
                        <Text style={myStyles.myHeaderText}>{"<Profiles"}</Text>
                    </TouchableHighlight>,
            };
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            profiles: this.props.profiles,
            submitPressed: false,
            textIsFocused: false,
        };
    }
    onSubmitPress = () => {
        try {
            myfuncs.myBreadCrumbs('onSubmitPress', this.props.navigation.state.routeName);
            Keyboard.dismiss();


            this.setState( {submitPressed: true});

            this.postTheUpdate(this.state.profile);
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    // resetMap = () => {
    //     console.log("PUT MAP BACK !!!");
    //     this.props.setRefreshMap(false);
    // };
    postTheUpdate = async (new_props) => {
        try {
            myfuncs.myBreadCrumbs('PostTheUpdate', this.props.navigation.state.routeName);

        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
            // let topContentSpace = 140;
            // if (myfuncs.isAndroid())
            //     topContentSpace += 100;

            let androidPad = myfuncs.androidPadding(this.state.textIsFocused, 200);

            return (<KeyboardAwareScrollView
                    style={myStyles.firstContainer}
                    resetScrollToCoords={{x:0, y:0}}
                    onSubmitEditing={this.onSubmitPress}
                    blurOnSubmit={false}
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={myStyles.container}
                >
                    <View style={{paddingTop: androidPad}}/>

                    <Text style={myStyles.iFieldLabel}>
                    <Text>Map Snap-Back Seconds</Text>
                </Text>

                    <Text style={myStyles.iFieldLabel}>
                        <Text>Default Title for Ribbon Creates</Text>
                    </Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.profiles.profile[0].mainChar}
                               onChangeText={(text) => this.updateState({mainChar: text})}
                               clearButtonMode='always'
                               placeholder={"Main Character"}
                               returnKeyType='done'
                               placeholderTextColor={"grey"}
                               maxLength={500}
                               onFocus={this.handleInputFocus}
                               onBlur={this.handleInputBlur}
                    />

                    <View style={{padding: 5}}/>

                    { (this.state.submitPressed === false) &&
                        <View>
                        <View style={{paddingTop: 5}}/>
                        <MyButton title={'Submit'} onPress={this.onSubmitPress}/>
                        </View>
                    }

                    <Toast
                        ref="toast"
                        style={{backgroundColor:'lightgreen',borderRadius: 20,padding: 10}}
                        position='center'
                        positionValue={0}
                        fadeOutDuration={2000}
                        opacity={.8}
                        textStyle={{color:'black',fontSize:21}}
                    />

                    <MyHelpIcon onPress={this.onHelpPress}/>
                    <MyHelpModal screen={"ProfileSettings"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>
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
    updateState = (new_prop) => {
        // this.setState({profiles: {...this.state.profiles.profile[0], ...new_prop}});
    };
};

const mapStateToProps = (state) => {
    const { profiles } = state;
    return { profiles }
};

export default connect(mapStateToProps, )(ProfileSettingsScreen);
