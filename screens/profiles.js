import React from 'react';
import { SafeAreaView } from 'react-navigation';
import {Layout, Text, Button} from '@ui-kitten/components';

import { connect } from 'react-redux';

class ProfilesScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    };

    logTest = () => {
        // this.props.setTest(!this.props.test);
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
    const { stories_list } = state;
    return { stories_list }
};

export default connect(mapStateToProps)(ProfilesScreen);
