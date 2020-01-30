import React from 'react';
import {
    View,
	ScrollView,
} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Layout, Text} from "@ui-kitten/components";


import myStyles from "../myStyles";
import myfuncs from "../services/myFuncs";

import {ScreenTitle} from "../components/screenTitle";

export default class SettingsAboutScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        try {
            myfuncs.myBreadCrumbs('navigationOptions', 'AudioScreen');
            return {
                headerTitle: () => <ScreenTitle title={"Settings"} second={"About"}/>,
            };
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };

    constructor(props) {
	super(props);
	this.state = {};
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

						<Text style={myStyles.myText}>
							Hello, I'm Mark.
							{"\n"}
							{"\n"}
							The idea behind Ribity originated during a February 2018 national tragedy
							which dominated the national media outlets.  Beth and I were talking: "There should be
							a way for the general population to show their personal empathy
							for such an event".
							{"\n"}
							{"\n"}
							That idea coupled with desire to learn mobile software platforms
							along with cloud storage and cloud services ... all led to the birth of Ribity.
							{"\n"}
							{"\n"}
							I'm 56-years-old and not the most technical person in the world.
							I had zero experience or knowledge in mobile application development,
							AWS hosting, databases, Google Services, etc. For 18 months I researched, scratched my head,
							struggled, researched, struggled. Ribity became more than an idea. Ribity became more than a pastime. Ribity became an entity.
							I remember my excitement the first time the map displayed on the simulator. I also remember
							the first time ribbons displayed on the map. There was new excitement each week.
							The weekly excitement and Beth's encouragement kept me going.
							Our hopes for Ribity were becoming reality.
							{"\n"}
							{"\n"}
							October of 2019 Ribity was launched to the App stores.
							{"\n"}
							{"\n"}
							We hope Ribity serves the intended purpose of unity and compassion.
							{"\n"}
							{"\n"}
							Beth and I support and promote inclusiveness and tolerance.  However, we will
							not allow extreme opinions, hate or vulgarities as part of a Ribbon or Event.
							We ask you to report
							vulgar or extreme ribbons or events. We'll take subjective action for each
							report. The reported ribbon or event will likely not
							be deleted, but instead the text will be modified. The plan for the future is to enable users
							that reach a certain "Point total" the ability to modify ribbons and
							events that have been reported as vulgar or extreme.
							Basically we see Ribity becoming a self-reporting, self-moderating community.
							{"\n"}
							{"\n"}
							Thank you for creating and advancing ribbons.  Thank you for your part in Ribbon Serendipity.
							{"\n"}
							{"\n"}
							EMail:  Ribity@yahoo.com
							{"\n"}
							{"\n"}
							- Mark and Beth

						</Text>
						</View>
						</ScrollView>
					</View>
				</Layout>
			</SafeAreaView>
		);
	} catch (error) {
	    myfuncs.mySentry(error);
	}
    };
};
