import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions,} from 'react-native';
import { ListItem, SearchBar} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import Toast from 'react-native-easy-toast';
import MyButton from "../components/MyButton";

import { connect } from 'react-redux';

import myStyles from "../myStyles";
import {bindActionCreators} from "redux";
import {addFavorite, addPlayList, removeFavorite, removePlayList} from "../actions/profilesActions";

const {height, width} = Dimensions.get('window');

class MyListComponent extends React.Component {

    constructor(props) {
        try {
            super(props);
            this.state = {
                data: [],
            };
            this.arrayholder = [];
            this.query = "";

        } catch (error) {
            // myfuncs.mySentry(error);
        }
    };
    componentDidMount() {
        try {
            console.log("MyListComponent DidMount");
            this.setState({data: this.props.myList});
            this.arrayholder = this.props.myList;
        } catch (error) {
            // myfuncs.mySentry(error);
        }
    }
    // static getDerivedStateFromProps(nextProps, prevState){
    //     console.log("GetDerivedStateFromProps myListComponent");
    //     if (prevState.myList !== nextProps.myList) {
    //         return{data: nextProps.myList};
    //     } else return null;
    // };
    // componentDidUpdate(prevProps, prevState) {
    //     console.log("MyListComponentDidUpdate");
    //     this.arrayholder = this.props.myList;
    // }

    renderSeparator = () => {
        try {
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
            // myfuncs.mySentry(error);
        }
    };

    searchFilterFunction = text => {
        try {
            this.query = text;
            const searchString = this.query.toLowerCase();
            const wordArray = searchString.split(" ");

            const newData = this.arrayholder.filter(item => {
                let itemData = "";
                    if (item.title !== null && item.title !== undefined)
                        itemData = item.title.toLowerCase();

                    if (item.date_published !== null && item.date_published !== undefined)
                        itemData += item.date_published.toLowerCase();

                    if (item.snippet !== null && item.snippet !== undefined)
                        itemData += item.snippet.toLowerCase();

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
            console.log("newData");
            this.setState({data: newData});
        } catch (error) {
            console.log(error);
            // myfuncs.mySentry(error);
        }
    };

    renderHeader = () => {
        try {
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
            // myfuncs.mySentry(error);
        }
    };
    addToFaves = (index) => {
        let msg = "Added to " + this.props.profiles.profile[this.props.profiles.profilesIdx].mainChar + "'s Favorites";
        this.refs.toast.show(msg, 500);
        this.props.addFavorite(index);
        this.setState({data: this.props.myList});
        this.props.updateParentStoriesCurrentProfile();
    };
    removeFromFaves = (index) => {
        let msg = "Removed from " + this.props.profiles.profile[this.props.profiles.profilesIdx].mainChar + "'s Favorites";
        this.refs.toast.show(msg, 500);
        this.props.removeFavorite(index);
        this.setState({data: this.props.myList});
        this.props.updateParentStoriesCurrentProfile();
    };
    addToPlayList = (index) => {
        let msg = "Added to " + this.props.profiles.profile[this.props.profiles.profilesIdx].mainChar + "'s PlayList";
        this.refs.toastPlay.show(msg, 500);
        this.props.addPlayList(index);
        this.setState({data: this.props.myList});
        this.props.updateParentStoriesCurrentProfile();
    };
    removeFromPlayList = (index) => {
        let msg = "Removed from " + this.props.profiles.profile[this.props.profiles.profilesIdx].mainChar + "'s PlayList";
        this.refs.toastPlay.show(msg, 500);
        this.props.removePlayList(index);
        this.setState({data: this.props.myList});
        this.props.updateParentStoriesCurrentProfile();
    };
    rightIcons = (index) => {
        // console.log("item:", index);
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
                    <Ionicons name={"ios-heart"} onPress={() => this.removeFromFaves(index)} size={25} color={'red'}/>
                    :
                    <Ionicons name={"ios-heart-empty"} onPress={() => this.addToFaves(index)}  size={25} color={'gray'}/>
                }
                {bPlayList ?
                    <Ionicons name={"ios-list-box"} onPress={() => this.removeFromPlayList(index)} size={25} color={'goldenrod'}/>
                    :
                    <Ionicons name={"ios-list"} onPress={() => this.addToPlayList(index)} size={25} color={'gray'}/>
                }
            </View>
        )
    };
    renderItem = (({item, index}) => {
            try {
                // console.log("Insight renderItem. FilterType = ", this.props.filterType);

                if (this.props.filterType === 1) {
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
                                                      buttonStyle={{marginVertical: 15}}
                                                      onPress={this.props.resetFilter}/>
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
                        if (index === faves[i]) {
                            bIsItemInFaves = true;
                            break;
                        }
                    }
                    if (bIsItemInFaves === false)
                        return;
                } else if (this.props.filterType === 2) {
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
                                                      buttonStyle={{marginVertical: 15}}
                                                      onPress={this.props.resetFilter}/>
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
                        if (index === list[i]) {
                            bIsItemInList = true;
                            break;
                        }
                    }
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
                if (item.snippet !== null && item.snippet !== "" && item.snippet !== undefined)
                    subtitle += "\r\n" + item.snippet;
                // if (item.keywords !== null && item.keywords !== "" && item.keywords !== undefined)
                //     subtitle += "\r\n" + item.keywords;
                if (item.ages !== null && item.ages !== "" && item.ages !== undefined)
                    subtitle += "\r\nAges: " + item.ages;

                if (item.color !== null && item.color !== "" && item.color !== undefined)
                    color = item.color;
                // else if (item.gender === 1)
                //     color = 'powderblue';
                // else if (item.gender === 2)
                //     color = 'mistyrose';

                if (image === "") {
                    return (
                                <TouchableOpacity onPress={() => this.props.onPressItem(item, index)}>
                                    <ListItem
                                        title={
                                            <Text style={styles.titleView}>{title}</Text>
                                        }
                                        subtitle={
                                            <Text style={styles.subtitleView}>{subtitle}</Text>
                                        }
                                        containerStyle={{borderBottomWidth: 0, backgroundColor: color, borderRadius: 10 }}
                                        // rightElement={this.rightIcons show=true}
                                        rightElement={() => this.rightIcons(index)}

                                    />
                                </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity onPress={() => this.props.onPressItem(item, index)}>
                            <ListItem
                                title={
                                    <Text style={styles.titleView}>{title}</Text>
                                }
                                subtitle={
                                    <Text style={styles.subtitleView}>{subtitle}</Text>
                                }
                                leftAvatar={{source: image, height: 45, width: 31}}
                                containerStyle={{borderBottomWidth: 0, backgroundColor: color }}
                            />
                        </TouchableOpacity>
                    )
                }
            } catch (error) {
                // myfuncs.mySentry(error);
            }
    });

    render() {
        try {
            // console.log("render state.data:", this.state.data);
            return (
                <View>
                    <Toast
                        ref="toast"
                        style={{backgroundColor:'red',borderRadius: 20,padding: 10}}
                        position='top'
                        positionValue={0}
                        fadeOutDuration={1000}
                        opacity={.8}
                        textStyle={{color:'white',fontSize:15}}
                    />
                    <Toast
                        ref="toastPlay"
                        style={{backgroundColor:'purple',borderRadius: 20,padding: 10}}
                        position='top'
                        positionValue={0}
                        fadeOutDuration={1000}
                        opacity={.8}
                        textStyle={{color:'gold',fontSize:15}}
                    />
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
            // myfuncs.mySentry(error);
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
    }
});

const mapStateToProps = (state) => {
    const { profiles } = state;
    return {profiles}
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