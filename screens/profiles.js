import React from 'react';
import { SafeAreaView } from 'react-navigation';
import {Layout, Text, Button} from '@ui-kitten/components';

import { connect } from 'react-redux';
import myfuncs from "../services/myFuncs";
import MyHelpIcon from "../components/MyHelpIcon";
import MyHelpModal from "../components/MyHelpModal";

class ProfilesScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    };

    logTest = () => {
        // this.props.setTest(!this.props.test);
        // console.log(this.props);
        this.props.navigation.navigate("ProfileSettings");

    };

    render () {
        return (
            <SafeAreaView style={{flex: 1}}>
                <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text category='h5'>Configure Profiles Here</Text>
                    <Button style={{marginVertical: 4, backgroundColor: 'purple'}} onPress={this.logTest}>Profile0</Button>
                </Layout>
                <MyHelpIcon onPress={this.onHelpPress}/>
                <MyHelpModal screen={"Profiles"}
                             onExitPress={this.onHelpExitPress}
                             isVisible={this.state.isModalVisible}/>
            </SafeAreaView>
        );
    }
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
const mapStateToProps = (state) => {
    const { stories_list } = state;
    return { stories_list }
};

export default connect(mapStateToProps)(ProfilesScreen);
