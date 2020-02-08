import React from 'react';
import {StyleSheet, View, Dimensions, Image} from 'react-native'
import {Layout, Select} from '@ui-kitten/components';
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
import myStyles from "../myStyles";

const {height, width} = Dimensions.get('window');

let profiles_data = MyDefines.profiles_data;
let kibityLogo = require('../assets/images/PurpleFaceIcon512.png');

class ProfileSetActive extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'ProfilesScreen');
            return {
                headerTitle: () => <ScreenTitle title={"Profiles"} second={"Set Active"}/>,
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
        };
    };
    componentDidMount() {
        console.log("ProfilesSetActive DidMount");
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
            profiles_data[i].text = this.props.profiles.profile[i].character[0].name;
        }
        this.setState({data_correct: true})
    };
    render () {
        return (
            <SafeAreaView style={myStyles.container}>
                <Layout style={{flex: 1, paddingLeft: 10, justifyContent: 'center'}}>

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
                    </View>
                    <View style={{padding:40}} />
                </Layout>
                <MyHelpIcon onPress={this.onHelpPress}/>
                <MyHelpModal screen={"ProfileSetActive"}
                             onExitPress={this.onHelpExitPress}
                             isVisible={this.state.isModalVisible}/>
            </SafeAreaView>
        );
    }
    updateActive = async (new_prop) => {
        try {
            let new_profiles = {...this.state.profiles, ...new_prop};

            // Note, no need to update state, because state auto-updates in getDerivedState
            // await this.setState({settings: new_settings});
            await this.props.updateProfiles(new_profiles);
            await myfuncs.writeUserDataToLocalStorage("user_profiles", this.props.profiles);
        } catch (error) {
            console.log(error);
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfileSetActive);

