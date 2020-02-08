import React from 'react';
import {StyleSheet, View, Dimensions, Image} from 'react-native'
import {Layout, Text, Select, Button} from '@ui-kitten/components';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import myfuncs from "../services/myFuncs";
import {MyHelpIcon} from "../components/MyHelpIcon";
import {MyHelpModal} from "../components/MyHelpModal";
import {ThemeButton} from "../components/themeButton";
import {ScreenTitle} from "../components/screenTitle";
import MyDefines from "../constants/MyDefines";
import {bindActionCreators} from "redux";
import {updateProfiles} from "../actions/profilesActions";
import {MyButton} from "../components/MyButton";
import myStyles from "../myStyles";

const {height, width} = Dimensions.get('window');

let kibityLogo = require('../assets/images/PurpleFaceIcon512.png');

class ProfilesScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'ProfilesScreen');
            return {
                headerTitle: () => <ScreenTitle title={"Profiles"}/>,
                headerRight: () => <ThemeButton/>,
            };
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            profiles: this.props.profiles,
            data_correct: false,
        };
    };
    static getDerivedStateFromProps(nextProps, prevState){
        let update = {};

        if (prevState.profiles !== nextProps.profiles) {
            update.profiles = nextProps.profiles;
        }
        return Object.keys(update).length ? update: null;
    };
    render () {
        return (
            <SafeAreaView style={styles.container}>
                <Layout style={{flex: 1, paddingLeft: 10}}>
                    <View>
                        <View style={{padding: 20}}/>

                        <Text style={styles.buttonText}>Active Profile</Text>
                        <Text style={styles.textStyle}>{this.props.profiles.profile[this.props.profiles.profilesIdx].character[0].name}</Text>
                        <MyButton buttonStyle={myStyles.selectButton}
                                  textStyle={myStyles.selectButtonText}
                                  onPress={() => this.goToSetActiveProfile(0)}
                                  title="Select Active Profile"/>
                        <View style={{padding: 25}}/>


                        <Image style={styles.kibityLogo} source={kibityLogo}/>
                        <View style={{padding: 10}}/>
                        <Text style={styles.buttonText}>Customize profile #1</Text>
                        <MyButton buttonStyle={myStyles.selectButton}
                                  textStyle={myStyles.selectButtonText}
                                  onPress={() => this.goToSpecificProfile(0)}
                                  title={this.props.profiles.profile[0].character[0].name}/>
                        <View style={{padding: 10}}/>

                        <Text style={styles.buttonText}>Customize profile #2</Text>
                        <MyButton buttonStyle={myStyles.selectButton}
                                  textStyle={myStyles.selectButtonText}
                                  onPress={() => this.goToSpecificProfile(1)}
                                  title={this.props.profiles.profile[1].character[0].name}/>
                        <View style={{padding: 10}}/>

                        <Text style={styles.buttonText}>Customize profile #3</Text>
                        <MyButton buttonStyle={myStyles.selectButton}
                                  textStyle={myStyles.selectButtonText}
                                  onPress={() => this.goToSpecificProfile(2)}
                                  title={this.props.profiles.profile[2].character[0].name}/>
                    </View>

                </Layout>
                <MyHelpIcon onPress={this.onHelpPress}/>
                <MyHelpModal screen={"Profiles"}
                             onExitPress={this.onHelpExitPress}
                             isVisible={this.state.isModalVisible}/>
            </SafeAreaView>
        );
    }
    goToSetActiveProfile = () => {
        // console.log("updateSetActiveProfile");
        this.props.navigation.navigate("ProfileSetActive");
    };
    goToSpecificProfile = (profileIdx) => {
        // console.log("updateSoecificProfile:", profileIdx);
        this.props.navigation.navigate("ProfileCustomize", {customizeIdx: profileIdx});
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyDefines.myTabColor,
    },
    select: {
        margin: 8,
    },
    text: {
        color: 'mediumpurple',
        fontSize: 20,
    },
    textStyle: {
        color: 'mediumpurple',
        fontSize: 23,
        lineHeight: 25,

        alignSelf: 'center',
    },
    labelStyle: {
        color: 'mediumpurple',
        fontSize: 20,
        lineHeight: 20,

    },
    controlStyle: {
        borderRadius: 8,
        width: width-30,
        color: 'mediumpurple',
    },
    kibityLogo: {
        justifyContent:'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 60,
        height: 60,
    },
    buttonText: {textAlign: 'center', color: 'mediumpurple', fontSize: 20, fontWeight: 'bold'},


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
export default connect(mapStateToProps, mapDispatchToProps)(ProfilesScreen);

