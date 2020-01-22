import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import { ListItem, SearchBar} from 'react-native-elements';
import { connect } from 'react-redux';

import myStyles from "../myStyles";

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
                        backgroundColor: "#CED0CE",
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
                    if (item.title !== null)
                        itemData = item.title.toLowerCase();
                    // console.log("Here", itemData);
                    // console.log("Her2", wordArray);

                    if (item.date_published !== null)
                        itemData += item.date_published.toLowerCase();

                    if (item.snippet !== null)
                        itemData += item.snippet.toLowerCase();

                    if (item.written_by !== null)
                        itemData += item.written_by.toLowerCase();

                    if (item.keywords !== null)
                        itemData += item.keywords.toLowerCase();

                    for (let j=0; j<wordArray.length; j++) {    // Loop thru all
                        if (itemData.indexOf(wordArray[j]) < 0) {
                            return false;
                        }
                    }

                    return true;
            });
            console.log("newData: ", newData);
            this.setState({data: newData});
        } catch (error) {
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

    renderItem = (({item, index}) => {
            try {
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
                if (item.keywords !== null && item.keywords !== "" && item.keywords !== undefined)
                    subtitle += "\r\n" + item.keywords;

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
                                containerStyle={{borderBottomWidth: 0, backgroundColor: color }}
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
    const { user } = state;
    return {user}
};

export default connect(mapStateToProps)(MyListComponent);