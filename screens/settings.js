import React from 'react';
import { Text, ScrollView, StyleSheet, Switch, View } from 'react-native'
import {SafeAreaView} from "react-navigation";
import {Layout} from "@ui-kitten/components";
import {ThemeButton} from "../components/themeButton";
import myfuncs from "../services/myFuncs";
import MyHelpIcon from "../components/MyHelpIcon";
import MyHelpModal from "../components/MyHelpModal";
import MyDefines from "../constants/MyDefines";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateSettings} from "../actions/settingsActions";

class SettingsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            settings: this.props.settings,
        };
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Layout style={{flex: 1, alignItems: 'flex-start'}}>
                    <ThemeButton/>
                        <Switch
                            value={this.state.settings.keep_awake}
                            onValueChange={(bEvent) => this.updateUser({keep_awake: bEvent})}
                        />







                </Layout>
                <MyHelpIcon onPress={this.onHelpPress}/>
                <MyHelpModal screen={"Settings"}
                             onExitPress={this.onHelpExitPress}
                             isVisible={this.state.isModalVisible}/>
            </SafeAreaView>
        );
    }
    updateUser = async (new_prop) => {
        await this.setState({settings: {...this.state.settings, ...new_prop}});
        this.props.updateSettings(this.state.settings);
        this.updateStorage();
    };
    updateStorage = () => {
        console.log("NewSettings:", this.props.settings);
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
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    switchContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 15
    },
    switchLabel: {
        flex: 0
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
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);



