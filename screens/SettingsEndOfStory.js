import React from 'react';
import {
    Text,
    View,
	TextInput
} from 'react-native';

// import {SafeAreaView} from "react-navigation";
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";
import MyButton from '../components/MyButton';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateSettings} from "../actions/settingsActions";
import {ScreenTitle} from "../components/screenTitle";
import Toast from 'react-native-easy-toast';

import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";

class ProfilesCu extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'EndOfStory');
            return {
                headerTitle: () => <ScreenTitle title={"Settings"} second={"End Of Story"}/>,
            };
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    constructor(props) {
		super(props);
        this.state = {
        	submitShow: false,
            settings: this.props.settings,
        };
    }
    render() {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
            return (
            	<View style={myStyles.container}>
                    <Text style={myStyles.iFieldLabel}>
                        <Text>Number of Seconds to Pause between stories</Text>
                    </Text>
                    <TextInput style={myStyles.iField}
                               value={this.state.settings.pauseBetweenStories.toString()}
                               onChangeText={(text) => this.updateState({pauseBetweenStories: text})}
                               clearButtonMode='always'
                               placeholder={this.state.settings.pauseBetweenStories.toString()}
                               maxLength={2}
                               keyboardType={'numeric'}
                               // returnKeyType="done"
                               placeholderTextColor={"grey"}
                               onFocus={this.handleInputFocus}
                               onBlur={this.handleInputBlur}
                    />
                    <Text style={{textAlign: 'left'}}> Valid values: 0 to 99</Text>

                    {this.state.submitShow === true &&
                    <View>
                        <View style={{paddingTop: 40}}/>
                        <MyButton title={'Submit / Save'} onPress={this.onSubmitPress}/>
                    </View>
                    }
                    <Toast
                        ref="toast"
                        style={{backgroundColor:'goldenrod',borderRadius: 20,padding: 10}}
                        position='top'
                        positionValue={0}
                        fadeOutDuration={2000}
                        opacity={.8}
                        textStyle={{color:'purple',fontSize:21}}
                    />
                    <MyHelpIcon onPress={this.onHelpPress}/>
                    <MyHelpModal screen={"SettingsRibbits"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>
				</View>
            );
        } catch (error) {
            myfuncs.mySentry(error);
        }
	};
    handleInputFocus = () => this.setState({ textIsFocused: true });
    handleInputBlur = () => this.setState({ textIsFocused: false });
    updateState = async (new_prop) => {
        try {
            this.setState({submitShow: true});
            await this.setState({settings: {...this.state.settings, ...new_prop}});

        } catch (error) {
            console.log(error);
            myfuncs.mySentry(error);
        }
    };
    onSubmitPress = async () => {
    	this.setState({submitShow: false});
        await this.props.updateSettings(this.state.settings);
        console.log("state Settings:", this.state.settings);
        console.log("redux Settings:", this.props.settings);

        await myfuncs.writeUserSettingsToLocalStorage(this.props.settings);
        this.refs.toast.show("Saved");
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
const mapStateToProps = (state) => {
    const { settings } = state;
    return { settings }
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateSettings,
    }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(SettingsEndOfStory);