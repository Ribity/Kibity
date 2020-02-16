import React from 'react';
import {View, AppState} from 'react-native';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateStoryList} from "../actions/storyListActions";
import MyDefines from "../constants/MyDefines";
import myfuncs from "../services/myFuncs";

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
            myfuncs.myBreadCrumbs('DidMount', "TasksComponent");

            this.buildStoryList();
            sixtyMinute = setInterval(this.sixtyMinuteTask, 10 * 60 * 1000);
            // sixtyMinute = setInterval(this.sixtyMinuteTask, 10 * 1000);
            // myfuncs.setAwakeorNot(this.props.settings.keep_awake);
        } catch (error) {
            myfuncs.mySentry(error);
        }
    }
    componentWillUnmount() {
        try {
            myfuncs.myBreadCrumbs('WillUnMount', "TasksComponent");

            if (sixtyMinute !== null)
                clearInterval(sixtyMinute);

            AppState.removeEventListener('change', this._handleAppStateChange);

        } catch (error) {
            myfuncs.mySentry(error);
        }
    }
    _handleAppStateChange = (nextAppState) => {
        try {
            myfuncs.myBreadCrumbs('handleAppStateChange', "TasksComponent");
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                if (MyDefines.log_details)
                    console.log("App has come to foreground");
                if (this.props.keep_awake) {
                    myfuncs.setAwakeorNot(true);
                }
            } else {    // Else gone to the background
                // if (MyDefines.detail_logging)
                    console.log("App has gone to background");
                myfuncs.setAwakeorNot(false);
            }
            appState = nextAppState;
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    buildStoryList = () => {
        try {
            myfuncs.myBreadCrumbs('buildStoryList', "TasksComponent");
            let local_story_list = require('../assets/allStoriesList.json');
            this.props.updateStoryList(local_story_list);

            this.getStoryListFromServer();
            // setTimeout(() => {this.getStoryListFromServer()}, 10000);    // This is for testing

        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    getStoryListFromServer = () => {
        try {
            myfuncs.myBreadCrumbs('getStoryListFromServer', "TasksComponent");
            let storyList_url = MyDefines.stories_url_bucket + "allStoriesList.json";
            console.log("serverStoryList url:", storyList_url);
            fetch(storyList_url)
                .then(response => response.json())
                .then(responseJson => {
                    // if (MyDefines.log_details)
                    console.log("fetched remote storyList");
                    let serverStoryList = responseJson;
                    this.appendServerStoryList(serverStoryList);
                })
                .catch(error => {
                    if (MyDefines.log_details)
                        console.log("file NOT retrieved from server", storyList_url);
                    console.error(error);
                });
            return null;
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    appendServerStoryList = async (serverStoryList) => {
        // console.log("StoryList Server: ", serverStoryList.stories.length);
        // console.log("StoryList Props: ", this.props.story_list.stories.length);
        if (serverStoryList.stories.length > this.props.story_list.stories.length) {
            let numExistingStories = this.props.story_list.stories.length;
            let numServerStories = serverStoryList.stories.length;
            console.log(numServerStories-numExistingStories, " new stories from serverStoryList:");

            // let newList = this.clone(this.props.story_list);
            let newList = this.clone(this.props.story_list);
            for (let idx=numExistingStories; idx<numServerStories; idx++) {
                let newStory = this.clone(serverStoryList.stories[idx]);
                newStory.remoteStory = true;
                newList.stories.push(newStory);
            }
            await this.props.updateStoryList(newList);
            // console.log("NewStoryList:", this.props.story_list);
        } else {
            console.log("No new stories from serverStoryList");
        }
    };
    clone = (obj) => {
        if (null == obj || "object" != typeof obj) return obj;
        let copy = obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    };
    sixtyMinuteTask = () => {
        try {
            myfuncs.myBreadCrumbs('sixtyMinuteTask', "TasksComponent");
            if (MyDefines.detail_logging)
                console.log("sixtyMinuteTask");
            this.getStoryListFromServer();
        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    render() {
        try {
            myfuncs.myBreadCrumbs('render', "TasksComponent");
            return (
                <View style={{padding:0}} />
            );
        } catch (error) {
            myfuncs.mySentry(error);
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