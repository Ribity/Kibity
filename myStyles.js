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
        borderColor: 'gold',
    },
    myHeaderText: {
        fontSize: 17,
        opacity: 1.0,
        color: 'purple',
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
        backgroundColor: MyDefines.myTabColor,
        // paddingTop: 50,
        // paddingBottom: 50,

    },
    ribbonHeader: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'purple',
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
        color: 'purple',
    },
    // searchHeaderText: {
    //     fontSize: 15,
    //     color: 'green',
    //     // opacity: 0.7,
    //     alignItems: "left",
    // },
    infoText: {
        fontSize: 17,
        color: 'purple',
        alignItems: 'center',
        padding: 5,
    },
    infoLargerText: {
        fontSize: 23,
        color: 'purple',
        textAlign: 'center',
    },
    iFieldLabel: {
        fontSize: 17,
        // fontWeight: 'bold',
        // opacity: .8,
        paddingLeft: 15,
        textAlign: 'left',
        alignSelf: 'stretch',
        paddingTop: 15,
        color: 'purple',
        fontWeight: 'bold',
    },
    iFieldLabelSmaller: {
        fontSize: 15,
        // fontWeight: 'bold',
        // opacity: .8,
        paddingLeft: 15,
        textAlign: 'left',
        alignSelf: 'stretch',
        paddingTop: 15,
        color: 'purple',
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
        backgroundColor: 'purple',
        opacity: 1.0,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'goldenrod',
    },
    regularButtonText: {
        fontSize: 17,
        opacity: 1.0,
        color: 'goldenrod',
        alignItems: 'center',
        padding: 2,
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
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
        backgroundColor:'goldenrod',
        borderRadius: 20,
        padding: 10
    },
    myBigToast: {
        color:'purple',
        fontSize:20,
        fontWeight: 'bold'
    },
});


export default myStyles;

