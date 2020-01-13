import React from 'react';
import { SafeAreaView } from 'react-navigation';
import {Layout, Text, Button} from '@ui-kitten/components';

import { connect } from 'react-redux';
import {bindActionCreators} from "redux";
import { setTest } from '../actions/testActions';

class ProfilesScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    };

    logTest = () => {
        this.props.setTest(!this.props.test);
        console.log(this.props);
    };

    render () {
        return (
            <SafeAreaView style={{flex: 1}}>
                <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text category='h5'>Configure Profiles Here</Text>
                    <Button style={{marginVertical: 4, backgroundColor: 'purple'}} onPress={this.logTest}>Test</Button>
                </Layout>
            </SafeAreaView>
        );
    }
}
const mapStateToProps = (state) => {
    const { test } = state;
    return { test }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setTest,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ProfilesScreen);
