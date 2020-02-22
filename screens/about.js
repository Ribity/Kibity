import React from 'react';
import {
    View,
    ScrollView, StyleSheet,
} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Layout, Text} from "@ui-kitten/components";


import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";

import {ScreenTitle} from "../components/screenTitle";
import {ThemeButton} from "../components/themeButton";

export default class AboutScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AudioScreen');
            return {
                headerTitle: () => <ScreenTitle title={"About"}/>,
                headerRight: () => <ThemeButton/>,
            };
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    constructor(props) {
	super(props);
    }

    render() {
	try {
	    myfuncs.myBreadCrumbs('render', this.props.navigation.state.routeName);
	    return (

            <SafeAreaView style={myStyles.container}>
                <Layout style={{flex: 1, alignItems: 'center'}}>

					<View style={{padding: 20}}>

						<ScrollView
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: 'space-between'
						}}>

						<View>

						<Text style={styles.aboutText}>
							Welcome to Kibity.
							{"\n"}
							{"\n"}
                            'Magical Adventures' was originally developed as an Alexa skill presenting personalized kid stories.
							The participation and feedback on Alexa led to the development of the Kibity Mobile Application
							for iOS and Android devices.
							The phone application allows us to display the words as they are spoken.
                            We are pleased Kibity has become a tool to engage kids while learning to read.
							{"\n"}
							{"\n"}
                            We value your privacy. We do not collect any data from your device. We are not
                            interested in your data. We are just a couple of normal people with a hobby. We'd love to get
                            to know our users, but we value your privacy. We will never ask for you EMail or any other data.
                            Please enjoy the stories with no worries of your data being breached, because we do not have servers
                            or anything to be hacked.
                            {"\n"}
                            {"\n"}
                            Beth and I will write stories and add them to the library of stories as time permits. We will also
							add public domain stories.
							{"\n"}
							{"\n"}
							We LOVE when users send us their own stories they have written to be publiYou simply write the story
							with regular characters' names as you normally would write a story.  Once you email your story to
							us we will modify it into the correct format.  The Kibity logic will then insert other users'
							customized parameters. Your story will be presented to other users with their own specified
							characters' names. Your story may be as long or as short as you desire. Please mail your stories to
							ribity@yahoo.com or mark_king@yahoo.com
							{"\n"}
							{"\n"}
							Ribity LLC was formed to protect us from liabilities. We cannot imagine us doing anything
							that would trigger a liability, but we were advised to created Ribity LLC just in case.
							{"\n"}
							{"\n"}
							EMail:  Ribity@yahoo.com
							{"\n"}
							{"\n"}
							- Mark and Beth in Raleigh, North Carolina, USA

						</Text>
						</View>
						</ScrollView>
					</View>
				</Layout>
			</SafeAreaView>
		);
	} catch (error) {
	    myfuncs.myRepo(error);
	}
    };
};
const styles = StyleSheet.create({

    aboutText: {
        color: 'mediumpurple',

        fontSize: 20,
        lineHeight: 22,

        // fontWeight: "bold",
        paddingTop: 15
    },

});