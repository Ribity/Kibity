import React from 'react';
import {StyleSheet, View, Dimensions, Image} from 'react-native'
import {Layout, Text} from '@ui-kitten/components';
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

let kibityLogo = require('../assets/images/PurpleFace_512x512.png');

class ProfilesScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'ProfilesScreen');
            return {
                headerTitle: () => <ScreenTitle title={"Profiles"} privacy={() => navigation.navigate("PrivacyProfiles")}/>,
                headerRight: () => <ThemeButton/>,
            };
        } catch (error) {
            myfuncs.myRepo(error);
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
        try {
            myfuncs.myBreadCrumbs('getDerivedStateFromProps', "ProfilesScreen");
            let update = {};

            if (prevState.profiles !== nextProps.profiles) {
                update.profiles = nextProps.profiles;
            }
            return Object.keys(update).length ? update: null;
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    render () {
        try {
            myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
            return (
                <SafeAreaView style={styles.container}>
                    <Layout style={{flex: 1, paddingLeft: 10}}>
                        <View>
                            <View style={{padding: 10}}/>

                            <Text style={styles.buttonText}>Active Profile</Text>
                            <Text style={styles.textStyle}>{myfuncs.shortenName(this.props.profiles.profile[this.props.profiles.profilesIdx].character[0].name, 20)}</Text>
                            <MyButton buttonStyle={myStyles.selectButton}
                                      textStyle={myStyles.selectButtonText}
                                      onPress={() => this.goToSetActiveProfile(0)}
                                      title="Select Active Profile"/>
                            <View style={{padding: 15}}/>


                            <Image style={styles.kibityLogoSmall} source={kibityLogo}/>
                            <View style={{padding: 10}}/>
                            <Text style={styles.buttonText}>Customize profile #1</Text>
                            <MyButton buttonStyle={myStyles.selectButton}
                                      textStyle={myStyles.selectButtonText}
                                      onPress={() => this.goToSpecificProfile(0)}
                                      title={myfuncs.shortenName(this.props.profiles.profile[0].character[0].name, 20)}/>
                            <View style={{padding: 10}}/>

                            <Text style={styles.buttonText}>Customize profile #2</Text>
                            <MyButton buttonStyle={myStyles.selectButton}
                                      textStyle={myStyles.selectButtonText}
                                      onPress={() => this.goToSpecificProfile(1)}
                                      title={myfuncs.shortenName(this.props.profiles.profile[1].character[0].name, 20)}/>
                            <View style={{padding: 10}}/>

                            <Text style={styles.buttonText}>Customize profile #3</Text>
                            <MyButton buttonStyle={myStyles.selectButton}
                                      textStyle={myStyles.selectButtonText}
                                      onPress={() => this.goToSpecificProfile(2)}
                                      title={myfuncs.shortenName(this.props.profiles.profile[2].character[0].name, 20)}/>
                        </View>

                    </Layout>
                    <MyHelpIcon onPress={this.onHelpPress}/>
                    <MyHelpModal screen={"Profiles"}
                                 onExitPress={this.onHelpExitPress}
                                 isVisible={this.state.isModalVisible}/>
                </SafeAreaView>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    goToSetActiveProfile = () => {
        try {
            myfuncs.myBreadCrumbs('getToSetActiveProfile', this.props.navigation.state.routeName);
            this.props.navigation.navigate("ProfileSetActive");
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    goToSpecificProfile = (profileIdx) => {
        try {
            myfuncs.myBreadCrumbs('goToSpecificProfile', this.props.navigation.state.routeName);
            this.props.navigation.navigate("ProfileCustomize", {customizeIdx: profileIdx});
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
    kibityLogoSmall: {
        justifyContent:'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 40,
        height: 40,
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

