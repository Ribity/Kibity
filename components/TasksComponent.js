import React from 'react';
import {View, AppState} from 'react-native';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateStoryList} from "../actions/storyListActions";
import MyDefines from "../constants/MyDefines";
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

// import _ from 'lodash'


let sixtyMinute = null;
let appState = AppState.currentState;

class TasksComponent extends React.Component {
    constructor(props) {
        try {
            super(props);

            this.loadStorageIntoRedux();

            AppState.addEventListener('change', this._handleAppStateChange);
        } catch (error) {
        }
    }
    componentDidMount() {
        try {
            this.buildStoryList();
            sixtyMinute = setInterval(this.sixtyMinuteTask, 10 * 60 * 1000);
            // sixtyMinute = setInterval(this.sixtyMinuteTask, 10 * 1000);

            if (this.props.settings.keep_awake) {
                activateKeepAwake();
            } else {
                deactivateKeepAwake();
            }
        } catch (error) {
        }
    }
    componentWillUnmount() {
        try {
            if (sixtyMinute !== null)
                clearInterval(sixtyMinute);

            AppState.removeEventListener('change', this._handleAppStateChange);

        } catch (error) {
            console.log(error);
        }
    }
    _handleAppStateChange = (nextAppState) => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            // if (MyDefines.detail_logging)
                console.log("App has come to foreground");
            if (this.props.keep_awake) {
                activateKeepAwake();
            }
        } else {    // Else gone to the background
            // if (MyDefines.detail_logging)
                console.log("App has gone to background");
            deactivateKeepAwake();
        }
        appState = nextAppState;
    };
    buildStoryList = () => {
        let local_story_list = require('../assets/allStoriesList.json');
        this.props.updateStoryList(local_story_list);

        this.getStoryListFromServer();
    };
    getStoryListFromServer = () => {
        // let storyList_url = MyDefines.stories_url_bucket + "allStoriesList.json";
        // console.log("serverStoryList url:", storyList_url);
        // fetch(storyList_url)
        //     .then(response => response.json())
        //     .then(responseJson => {
        //         // if (MyDefines.log_details)
        //         console.log("fetched remote storyList");
        //         let serverStoryList = responseJson;
        //         this.appendServerStoryList(serverStoryList);
        //     })
        //     .catch(error => {
        //         if (MyDefines.log_details)
        //             console.log("file NOT retrieved from server", storyList_url);
        //         console.error(error);
        //     });
        // return null;
    };
    // appendServerStoryList = (serverStoryList) => {
    //     if (serverStoryList.stories.length > this.props.story_list.stories.length) {
    //         let numExistingStories = this.props.story_list.stories.length;
    //         let numServerStories = serverStoryList.stories.length;
    //         console.log(numServerStories-numExistingStories, " new stories from serverStoryList:");
    //
    //         // let newList = this.clone(this.props.story_list);
    //         let newList = _.cloneDeep(this.props.story_list);
    //         for (let idx=numExistingStories; idx<numServerStories; idx++) {
    //             let newStory = _.cloneDeep(serverStoryList.stories[idx]);
    //             newStory.remoteStory = true;
    //             newList.stories.push(newStory);
    //         }
    //         this.props.updateStoryList(newList);
    //         console.log("NewStoryList:", this.props.story_list);
    //     } else {
    //         console.log("No new stories from serverStoryList");
    //     }
    // };
    // clone = (obj) => {
    //     if (null == obj || "object" != typeof obj) return obj;
    //     let copy = obj.constructor();
    //     for (let attr in obj) {
    //         if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    //     }
    //     return copy;
    // };
    sixtyMinuteTask = () => {
        try {
            if (MyDefines.detail_logging)
                console.log("sixtyMinuteTask");
            this.getStoryListFromServer();
        } catch (error) {
            console.log(error);
        }
    };
    render() {
        try {
            return (
                <View style={{padding:0}} />
            );
        } catch (error) {
            console.log(error);
        }
    }
}

const mapStateToProps = (state) => {
    const { story_list } = state;
    const { settings } = state;
    return { story_list, settings }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        updateStoryList,
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(TasksComponent);