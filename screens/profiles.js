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

const {height, width} = Dimensions.get('window');

let profiles_data = MyDefines.profiles_data;
let kibityLogo = require('../assets/images/PurpleFaceIcon512.png');

class ProfilesScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'ProfilesScreen');
            return {
                headerLeft: () => <ThemeButton/>,
                headerTitle: () => <ScreenTitle title={"Profiles"}/>,
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
    componentDidMount() {
        console.log("Profiles DidMount");
        this.updateActiveProfilesList();
    }
    static getDerivedStateFromProps(nextProps, prevState){
        let update = {};

        if (prevState.profiles !== nextProps.profiles) {
            update.profiles = nextProps.profiles;
        }
        return Object.keys(update).length ? update: null;
    };
    updateActiveProfilesList = () => {
        for (let i=0; i<profiles_data.length; i++) {
            profiles_data[i].text = this.props.profiles.profile[i].mainChar;
        }
        this.setState({data_correct: true})
    };
    render () {
        return (
            <SafeAreaView style={styles.container}>
                <Layout style={{flex: 1, paddingLeft: 10}}>

                    { ( (this.state.data_correct === true) &&
                        (this.state.profiles.retrieved_user_data === true) ) ?
                    <View  style={{alignItems: 'flex-start'}}>

                        <Select
                            style={styles.select}
                            data={profiles_data}
                            status='warning'
                            label='Active Profile'
                            onSelect={(event) =>
                                this.updateActive({profilesIdx: event.idx})}
                            selectedOption={profiles_data[this.state.profiles.profilesIdx]}
                            textStyle={styles.textStyle}
                            labelStyle={styles.labelStyle}
                            controlStyle={styles.controlStyle}
                        />
                    </View>
                        :
                        <View>
                        <View style={{padding:40}} />
                        </View>
                    }

                    <View>
                        <View style={{padding: 25}}/>

                        <Image style={styles.kibityLogo} source={kibityLogo}/>
                        <View style={{padding: 10}}/>
                        <View>
                            <Text style={styles.buttonText}>Customize profile #1</Text>
                            <MyButton buttonStyle={styles.selectButton}
                                      textStyle={styles.selectButtonText}
                                      onPress={() => this.updateSpecificProfile(0)}
                                      title={this.props.profiles.profile[0].mainChar}>
                            </MyButton>
                            <View style={{padding: 10}}/>

                            <Text style={styles.buttonText}>Customize profile #2</Text>
                            <MyButton buttonStyle={styles.selectButton}
                                      textStyle={styles.selectButtonText}
                                      onPress={() => this.updateSpecificProfile(1)}
                                      title={this.props.profiles.profile[1].mainChar}>
                            </MyButton>
                            <View style={{padding: 10}}/>

                            <Text style={styles.buttonText}>Customize profile #3</Text>
                            <MyButton buttonStyle={styles.selectButton}
                                      textStyle={styles.selectButtonText}
                                      onPress={() => this.updateSpecificProfile(2)}
                                      title={this.props.profiles.profile[2].mainChar}>
                            </MyButton>
                        </View>
                    </View>

                </Layout>
                <MyHelpIcon onPress={this.onHelpPress}/>
                <MyHelpModal screen={"Profiles"}
                             onExitPress={this.onHelpExitPress}
                             isVisible={this.state.isModalVisible}/>
            </SafeAreaView>
        );
    }
    updateActive = async (new_prop) => {
        try {
            // console.log("new_prop:", new_prop);

            let new_profiles = {...this.state.profiles, ...new_prop};

            // Note, no need to update state, because state auto-updates in getDerivedState
            // await this.setState({settings: new_settings});
            await this.props.updateProfiles(new_profiles);
            await this.updateStorage();

        } catch (error) {
            console.log(error);
            myfuncs.mySentry(error);
        }
    };
    updateStorage = async () => {
        await myfuncs.writeUserDataToLocalStorage("user_profiles", this.props.profiles);
        // console.log("storage updated NewProfiles:", this.props.profiles);
    };
    updateSpecificProfile = (profileIdx) => {
        console.log("updateSoecificProfile:", profileIdx);
        this.props.navigation.navigate("ProfileCustomize", {profileIdx: profileIdx});

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
        color: 'purple',
        fontSize: 23,
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
    selectButton: {
        // marginVertical: 15,
        marginHorizontal: 70,
        backgroundColor: 'purple',
        alignSelf: 'center',
        borderColor: 'goldenrod',
        borderWidth: 2,
    },
    selectButtonText: {
        color: 'goldenrod',
        fontWeight: 'bold',
        margin: 5,
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfilesScreen);

