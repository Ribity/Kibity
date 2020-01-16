import {Dimensions, StyleSheet, TextInput} from "react-native";
import Constants from 'expo-constants';
import MyDefines from "./constants/MyDefines";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import React from "react";

const {height, width} = Dimensions.get('window');

// Note, 'honeydew' is a nice light green. See search/leaps list. Claimed ribbons
const myStyles = StyleSheet.create({
    myHeaderTouch: {
        // padding: 5,
        //     backgroundColor: '#79c879',
        backgroundColor: '#AFC0AB',
        opacity: .7,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'green',
    },
    myHeaderText: {
        fontSize: 17,
        opacity: 1.0,
        color: 'darkblue',
        alignItems: 'center',
        padding: 2,
    },
    firstContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        // paddingTop: 50,
        // paddingBottom: 50,

    },
    ribbonHeader: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'green',
    },
    flatListPadding: {
        paddingTop: MyDefines.myStatusBarHeight + 35,
    },
    flatListHeader: {
        flexDirection: 'row',
        // width: width,
    },
    flatListLeft: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingLeft: 20,
    },
    flatListRight: {
        justifyContent: 'flex-end',
        alignSelf: 'stretch',
        paddingRight: 5,
    },
    smallButtonText: {
        fontSize: 13,
        opacity: 1.0,
        color: 'darkblue',
        padding: 1,
        alignItems: 'center',
    },
    flatListHeaderText: {
        fontSize: 13,
        color: 'green',
    },
    // searchHeaderText: {
    //     fontSize: 15,
    //     color: 'green',
    //     // opacity: 0.7,
    //     alignItems: "left",
    // },
    infoText: {
        fontSize: 17,
        color: 'green',
        alignItems: 'center',
        padding: 5,
    },
    infoLargerText: {
        fontSize: 23,
        color: 'green',
        textAlign: 'center',
        // alignItems: 'center',
        // justifyContent: 'center',
        // flexDirection: 'row',
        // flexWrap: 'wrap',
    },
    iFieldLabel: {
        fontSize: 17,
        // fontWeight: 'bold',
        // opacity: .8,
        paddingLeft: 5,
        textAlign: 'left',
        alignSelf: 'stretch',
        paddingTop: 15,
        color: 'darkgreen',
        fontWeight: 'bold',
    },
    iFieldLabelSmaller: {
        fontSize: 15,
        // fontWeight: 'bold',
        // opacity: .8,
        paddingLeft: 5,
        textAlign: 'left',
        alignSelf: 'stretch',
        paddingTop: 15,
        color: 'darkgreen',
        fontWeight: 'bold',
    },
    iField: {
        width: width-20,
        height: 40,
        borderWidth: 1,
        paddingLeft: 5,
        borderRadius: 10,
    },
    regularButton: {
        backgroundColor: '#AFC0AB',
        opacity: .7,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'green',
    },
    regularButtonText: {
        fontSize: 17,
        opacity: 1.0,
        color: 'darkblue',
        alignItems: 'center',
        padding: 2,
    },
    floatingButtonTopRight: {
        position: 'absolute',
        backgroundColor: '#AFC0AB',
        opacity: .7,
        bottom: height - (MyDefines.myStatusBarHeight + 15),
        right: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'green',
    },
    floatingButtonMiddleRight: {
        position: 'absolute',
        backgroundColor: '#AFC0AB',
        opacity: .7,
        bottom: height - (MyDefines.myStatusBarHeight + 50),
        right: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'green',
    },
    floatingButtonOneFourthOnRight: {
        position: 'absolute',
        backgroundColor: '#AFC0AB',
        opacity: .7,
        bottom: height - ((height/4)+30) ,
        left: 110,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'green',
    },
    floatingButtonText: {
        fontSize: 17,
        opacity: 1.0,
        color: 'darkblue',
        alignItems: 'center',
        padding: 2,
    },
    ribbonView: {
        alignItems: 'center',
    },
    ribbonImage: {
        justifyContent:'flex-end',
        // alignItems: 'center',
        width: 33,
        height: 46,
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    },
    calloutBox: {
        padding: 7,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
        width: ((width/2) + (width/4)),
    },
    myCenter: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    myText: {
        fontSize: 20,
    },
    myBoldText: {
        fontWeight:"bold",
        fontSize: 20,
    },
    myBigToastStyle: {
        backgroundColor:'lightgreen',
        borderRadius: 20,
        padding: 10
    },
    myBigToast: {
        color:'black',
        fontSize:20,
        fontWeight: 'bold'
    },
});


export default myStyles;

