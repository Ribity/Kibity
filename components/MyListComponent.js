import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions,} from 'react-native';
import { ListItem, SearchBar} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import Toast from 'react-native-root-toast';

import {MyButton} from "./MyButton";

import { connect } from 'react-redux';

import myStyles from "../myStyles";
import {bindActionCreators} from "redux";
import {addFavorite, addPlayList, removeFavorite, removePlayList} from "../actions/profilesActions";
import myfuncs from "../services/myFuncs";
import MyDefines from "../constants/MyDefines";

const {height, width} = Dimensions.get('window');
const pause_data = MyDefines.pause_data;

class MyListComponent extends React.Component {

    constructor(props) {
        try {
            super(props);
            this.state = {
                data: [],
                arrayholder: [],
            };
            this.query = "";

        } catch (error) {
            // myfuncs.myRepo(error);
        }
    };
    componentDidMount() {
        try {
            myfuncs.myBreadCrumbs('DidMount', "MyListComponent");
            this.setState({data: this.props.myList});
            this.setState({arrayholder: this.props.myList});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.myList.length !== this.state.arrayholder.length) {
            setTimeout(this.refresh_list, 1);
        }
    }
    refresh_list = async () => {
        await this.setState({data: this.props.myList});
        await this.setState({arrayholder: this.props.myList});
        this.searchFilterFunction(this.query);
    };
    renderSeparator = () => {
        try {
            myfuncs.myBreadCrumbs('renderSeparator', "MyListComponent");

            return (
                <View
                    style={{
                        height: 1,
                        width: "86%",
                        backgroundColor: "gray",
                        marginLeft: "14%",
                    }}
                />
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };

    searchFilterFunction = text => {
        try {
            myfuncs.myBreadCrumbs('searchFilter', "MyListComponent");

            this.query = text;
            const searchString = this.query.toLowerCase();
            const wordArray = searchString.split(" ");

            const newData = this.state.arrayholder.filter(item => {
                let itemData = "";
                    if (item.title !== null && item.title !== undefined)
                        itemData = item.title.toLowerCase();

                    if (item.date_published !== null && item.date_published !== undefined)
                        itemData += item.date_published.toLowerCase();

                    // if (item.snippet !== null && item.snippet !== undefined)
                    //     itemData += item.snippet.toLowerCase();

                    if (item.written_by !== null && item.written_by !== undefined)
                        itemData += item.written_by.toLowerCase();

                    if (item.keywords !== null && item.keywords !== undefined)
                        itemData += item.keywords.toLowerCase();

                    if (item.color !== null && item.color !== undefined)
                        itemData += item.color.toLowerCase();

                    for (let j=0; j<wordArray.length; j++) {    // Loop thru all
                        if (itemData.indexOf(wordArray[j]) < 0) {
                            return false;
                        }
                    }
                    return true;
            });
            // console.log("newData");
            this.setState({data: newData});
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    renderHeader = () => {
        try {
            myfuncs.myBreadCrumbs('renderHeader', "MyListComponent");

            return (
                <SearchBar
                    placeholder="Search this list..."
                    lightTheme
                    round
                    onChangeText={this.searchFilterFunction}
                    autoCorrect={false}
                    value={this.query}
                />
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    addToFaves = (index) => {
        try {
            myfuncs.myBreadCrumbs('addToFaves', "MyListComponent");
            let tMsg = "Added to " + this.props.profiles.profile[this.props.profiles.profilesIdx].character[0].name + "'s Favorites";
            Toast.show(tMsg, {
                duration: 1500,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                textColor: 'white',
                backgroundColor: 'red',
                shadowColor: 'purple',
                opacity: 0.9,
            });

            this.props.addFavorite(index);
            // this.setState({data: this.props.myList});
            this.props.updateParentStoriesCurrentProfile();
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    removeFromFaves = (index) => {
        try {
            myfuncs.myBreadCrumbs('removeFromFaves', "MyListComponent");
            let tMsg = "Removed from " + this.props.profiles.profile[this.props.profiles.profilesIdx].character[0].name + "'s Favorites";
            Toast.show(tMsg, {
                duration: 1500,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                textColor: 'white',
                backgroundColor: 'red',
                shadowColor: 'purple',
                opacity: 0.9,
            });
            this.props.removeFavorite(index);
            // this.setState({data: this.props.myList});
            this.props.updateParentStoriesCurrentProfile();
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    addToPlayList = (index) => {
        try {
            myfuncs.myBreadCrumbs('addToPlayList', "MyListComponent");
            let tMsg = "Added to " + this.props.profiles.profile[this.props.profiles.profilesIdx].character[0].name + "'s PlayList";
            Toast.show(tMsg, {
                duration: 1500,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                textColor: 'gold',
                backgroundColor: 'purple',
                shadowColor: 'gold',
                opacity: 0.9,
            });
            this.props.addPlayList(index);
            // this.setState({data: this.props.myList});
            this.props.updateParentStoriesCurrentProfile();
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    removeFromPlayList = (index) => {
        try {
            myfuncs.myBreadCrumbs('removeFromPlayList', "MyListComponent");
            let tMsg = "Removed from " + this.props.profiles.profile[this.props.profiles.profilesIdx].character[0].name + "'s PlayList";
            Toast.show(tMsg, {
                duration: 1500,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                textColor: 'gold',
                backgroundColor: 'purple',
                shadowColor: 'gold',
                opacity: 0.9,
            });
            this.props.removePlayList(index);
            // this.setState({data: this.props.myList});
            this.props.updateParentStoriesCurrentProfile();
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    rightIcons = (index) => {
        try {
            myfuncs.myBreadCrumbs('rightIcons', "MyListComponent");
            let bFave = false;
            for (let fave of this.props.profiles.profile[this.props.profiles.profilesIdx].favorites) {
                if (index === fave)
                    bFave = true;
            }
            let bPlayList = false;
            for (let play of this.props.profiles.profile[this.props.profiles.profilesIdx].playList) {
                if (index === play)
                    bPlayList = true;
            }

            return (
                <View>
                    {bFave ?
                        <View>
                            <TouchableOpacity hitSlop={styles.hitSlop} onPress={() => this.removeFromFaves(index)}>
                                <Ionicons name={"ios-heart"}  size={40} color={'red'}/>
                            </TouchableOpacity>
                        </View>
                        :
                        <View>
                            <TouchableOpacity hitSlop={styles.hitSlop} onPress={() => this.addToFaves(index)}>
                                <Ionicons name={"ios-heart-outline"}  size={40} color={'gray'}/>
                            </TouchableOpacity>
                        </View>
                    }
                    {bPlayList ?
                        <View>
                            <TouchableOpacity hitSlop={styles.hitSlop} onPress={() => this.removeFromPlayList(index)}>
                                <Ionicons name={"ios-list-circle"}  size={40} color={'goldenrod'}/>
                            </TouchableOpacity>
                        </View>
                        :
                        <View>
                            <TouchableOpacity hitSlop={styles.hitSlop} onPress={() => this.addToPlayList(index)}>
                                <Ionicons name={"ios-list"}  size={40} color={'gray'}/>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            )
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    renderItem = (({item, index}) => {
        try {
            myfuncs.myBreadCrumbs('renderItem', "MyListComponent");

            if (this.props.listType === 1) {
                let bIsItemInFaves = false;
                let faves = this.props.profiles.profile[this.props.profiles.profilesIdx].favorites;

                if (faves.length === 0) {
                    if (index === 0) {
                        return (
                            <ListItem
                                title={
                                    <Text style={styles.titleView}>You have no Favorites</Text>
                                }
                                subtitle={
                                    <View>
                                        <View style={{paddingTop: 5}}/>
                                        <Text style={styles.subtitleView}>To add to your Favorites</Text>

                                        <View style={{paddingTop: 5}}/>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitleView}>Click  </Text>
                                            <Ionicons name={"ios-heart-empty"} size={25} color={'gray'}/>
                                            <Text style={styles.subtitleView}>  next to a story</Text>
                                        </View>
                                        <Text style={styles.subtitleView}>Then you can play your Favorites</Text>

                                        <MyButton title={'Go back to All Stories'}
                                                  buttonStyle={styles.selectButton}
                                                  textStyle={styles.selectButtonText}
                                                  onPress={this.props.resetList}/>
                                    </View>
                                }
                                containerStyle={{borderBottomWidth: 0, backgroundColor: 'goldenrod', borderRadius: 10}}
                            />
                        )
                    } else {
                        return;
                    }
                }

                for (let i = 0; i < faves.length; i++) {
                    if ((item.story_num-1) === faves[i]) {
                        bIsItemInFaves = true;
                        break;
                    }
                }
                if (bIsItemInFaves === false)
                    return;
            } else if (this.props.listType === 2) {
                let bIsItemInList = false;
                let list = this.props.profiles.profile[this.props.profiles.profilesIdx].playList;
                if (list.length === 0) {
                    if (index === 0) {
                        return (
                            <ListItem
                                title={
                                    <Text style={styles.titleView}>You have no PlayList</Text>
                                }
                                subtitle={
                                    <View>
                                        <View style={{paddingTop: 5}}/>
                                        <Text style={styles.subtitleView}>To add to your PlayList</Text>

                                        <View style={{paddingTop: 5}}/>

                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.subtitleView}>Click  </Text>
                                            <Ionicons name={"ios-list"} size={25} color={'gray'}/>
                                            <Text style={styles.subtitleView}>  next to a story</Text>
                                        </View>
                                        <Text style={styles.subtitleView}>Then you can play your PlayList</Text>
                                        <MyButton title={'Go back to All Stories'}
                                                  buttonStyle={styles.selectButton}
                                                  textStyle={styles.selectButtonText}
                                                  onPress={this.props.resetList}/>
                                    </View>
                                }
                                containerStyle={{borderBottomWidth: 0, backgroundColor: 'goldenrod', borderRadius: 10}}
                            />
                        )
                    } else {
                        return;
                    }
                }

                for (let i = 0; i < list.length; i++) {
                    if ((item.story_num-1) === list[i]) {
                        bIsItemInList = true;
                        break;
                    }
                }
                if (bIsItemInList === false)
                    return;
            }

            if (this.props.otherFilter !== "") {
                let bIsItemInList = false;
                let searchWords = "";

                if (item.title !== null && item.title !== "" && item.title !== undefined)
                    searchWords += item.title;
                if (item.keywords !== null && item.keywords !== "" && item.keywords !== undefined)
                    searchWords += item.keywords;
                if (item.written_by !== null && item.written_by !== "" && item.written_by !== undefined)
                    searchWords += item.written_by;
                if (item.ageSearch !== null && item.ageSearch !== "" && item.ageSearch !== undefined)
                    searchWords += item.ageSearch;

                if (searchWords.toLowerCase().indexOf(this.props.otherFilter.toLowerCase()) > -1)
                    bIsItemInList = true;
                if (bIsItemInList === false)
                    return;
            }

            let color = 'white';
            let image = "";
            let subtitle = "";

            // console.log(item);

            let title = item.title;

            if (item.written_by !== null && item.written_by !== "" && item.written_by !== undefined)
                subtitle += "Written by: " + item.written_by + "\r\n";
            if (item.date_published !== null && item.date_published !== "" && item.date_published !== undefined)
                subtitle += item.date_published + "  ";
            if (item.num_lines !== null && item.num_lines !== "" && item.num_lines !== undefined)
                subtitle += " #Lines: " + item.num_lines.toString();
            // if (item.snippet !== null && item.snippet !== "" && item.snippet !== undefined)
            //     subtitle += "\r\n" + item.snippet;
            // if (item.keywords !== null && item.keywords !== "" && item.keywords !== undefined)
            //     subtitle += "\r\n" + item.keywords;
            if (item.ages !== null && item.ages !== "" && item.ages !== undefined)
                subtitle += "\r\nAges: " + item.ages;
            if (item.toddler_pause !== null && item.toddler_pause !== 0 &&
                item.toddler_pause !== undefined)
                subtitle += "\r\nAdditional toddler pause: " +
                    (item.toddler_pause + pause_data[this.props.settings.pauseLineIdx].value) + " Secs";

            if (item.color !== null && item.color !== "" && item.color !== undefined)
                color = item.color;

            if (image === "") {
                return (
                    <TouchableOpacity onPress={() => this.props.onPressItem(item.story_num-1)}>
                        <ListItem
                            title={
                                <Text style={styles.titleView}>{title}</Text>
                            }
                            subtitle={
                                <Text style={styles.subtitleView}>{subtitle}</Text>
                            }
                            containerStyle={{borderBottomWidth: 0, backgroundColor: color, borderRadius: 10 }}
                            rightElement={() => this.rightIcons(item.story_num-1)}

                        />
                    </TouchableOpacity>
                )
            } else {
                return (
                    <TouchableOpacity onPress={() => this.props.onPressItem(item.story_num-1)}>
                        <ListItem
                            title={
                                <Text style={styles.titleView}>{title}</Text>
                            }
                            subtitle={
                                <Text style={styles.subtitleView}>{subtitle}</Text>
                            }
                            leftAvatar={{source: image, height: 45, width: 31}}
                            containerStyle={{borderBottomWidth: 0, backgroundColor: color }}
                            rightElement={() => this.rightIcons(item.story_num-1)}
                        />
                    </TouchableOpacity>
                )
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    });

    render() {
        try {
            myfuncs.myBreadCrumbs('render', "MyListComponent");
            return (
                <View>
                    {this.props.myList.length > 0 ?
                        <View>
                            <FlatList
                                style={styles.myFlat}
                                data={this.state.data}
                                keyExtractor={item => item.story_num.toString()}
                                ItemSeparatorComponent={this.renderSeparator}
                                ListHeaderComponent={this.renderHeader}
                                renderItem={this.renderItem}
                                // renderItem={(item, index) => this.renderItem(item, index)}

                                contentContainerStyle={{paddingBottom: 150}}
                            />
                        </View>
                        :
                        <View>
                            <Text style={myStyles.myText}>No Stories to list</Text>
                        </View>
                    }
                </View>
            );
        } catch (error) {
            myfuncs.myRepo(error);
        }
    }
}

const styles = StyleSheet.create({
    listitem: {
        // justifyContent: 'flex-end',
        position: 'absolute',
        // alignItems: 'center',
        left: 0,
        // flexDirection: 'column'
        flexGrow: 1,
        flexBasis: 80,
        flex: 1,
    },
    lastbutton: {
        backgroundColor: 'purple',
    },
    titleView: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'purple',
    },
    subtitleView: {
        fontStyle: 'italic',
        // fontWeight: '100',
        fontSize: 17,
    },
    myFlat: {
        backgroundColor: 'lightgrey',
        width: width-5,
    },
    selectButton: {
        marginVertical: 15,
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
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 70,
        right: 70,
    },
});

const mapStateToProps = (state) => {
    const { profiles } = state;
    const { settings } = state;
    return {profiles, settings}
};
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addFavorite,
        addPlayList,
        removeFavorite,
        removePlayList,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MyListComponent);