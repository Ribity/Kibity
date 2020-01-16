import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from "react-navigation";
import {Button, Layout, Text} from "@ui-kitten/components";
import {connect} from "react-redux";
import myStyles from "../myStyles";
import MyListComponent from '../components/MyListComponent';

class StoriesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myStateList: [],
        };
    };
    onPressStory = () => {
        this.props.navigation.navigate("Audio");
    };
    refresh = () => {
        // console.log(this.props.stories_list);
        this.setState({myStateList: this.props.stories_list})
    };
    render() {
        return (
                <View style={myStyles.container}>
                    <Button style={{}}
                            onPress={this.refresh}>Refresh</Button>
                    {this.props.stories_list.length > 0 ?
                        <View>
                            <View style={myStyles.flatListPadding} />
                            <View style={myStyles.flatListHeader}>
                                <View style={myStyles.flatListLeft}>
                                    <Text style={myStyles.flatListHeaderText}>
                                        <Text>ONE CLICK sends a ribbon</Text>
                                    </Text>
                                </View>
                            </View>
                            <View style={myStyles.flatListHeader}>
                                <View style={myStyles.flatListLeft}>
                                    <Text style={myStyles.flatListHeaderText}>
                                        <Text>Search event/cause/address</Text>
                                    </Text>
                                </View>
                            </View>
                            <MyListComponent navigation={this.props.navigation}
                                             myList={this.state.myStateList}
                                             onPressItem={this.onPressStory}/>

                        </View>
                        :
                        <View>
                            <Text>No Events to List</Text>
                        </View>
                    }
                </View>
        );
    }
};
const mapStateToProps = (state) => {
    const { stories_list } = state;
    return { stories_list }
};

export default connect(mapStateToProps)(StoriesScreen);
