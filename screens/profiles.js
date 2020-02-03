import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native'
import {Layout, Text, Select, Button} from '@ui-kitten/components';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import myfuncs from "../services/myFuncs";
import MyHelpIcon from "../components/MyHelpIcon";
import MyHelpModal from "../components/MyHelpModal";
import {ThemeButton} from "../components/themeButton";
import {ScreenTitle} from "../components/screenTitle";
import MyDefines from "../constants/MyDefines";
import {bindActionCreators} from "redux";
import {updateProfiles} from "../actions/profilesActions";

const {height, width} = Dimensions.get('window');

let profiles_data = MyDefines.profiles_data;

class ProfilesScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AudioScreen');
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
                <Layout style={{flex: 1, paddingLeft: 10, alignItems: 'flex-start'}}>

                    { ( (this.state.data_correct === true) &&
                        (this.state.profiles.retrieved_user_data === true) ) &&
                    <View>
                        <Select
                            style={styles.select}
                            data={profiles_data}
                            status='warning'
                            label='Active Profile'
                            onSelect={(event) =>
                                this.updateProfiles({profilesIdx: event.idx})}
                            selectedOption={profiles_data[this.state.profiles.profilesIdx]}
                            textStyle={styles.textStyle}
                            labelStyle={styles.labelStyle}
                            controlStyle={styles.controlStyle}
                        />

                    </View>
                    }

                </Layout>
                <MyHelpIcon onPress={this.onHelpPress}/>
                <MyHelpModal screen={"Profiles"}
                             onExitPress={this.onHelpExitPress}
                             isVisible={this.state.isModalVisible}/>
            </SafeAreaView>
        );
    }
    updateProfiles = async (new_prop) => {
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

