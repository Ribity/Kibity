import {StyleSheet} from "react-native";
import MyDefines from "../../constants/MyDefines";

const helpStyles = StyleSheet.create({
    modalStyle: {
        flex: 1,
        borderRadius: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: MyDefines.myStatusBarHeight + 30,
        marginBottom: MyDefines.myStatusBarHeight,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        padding: 5,
    },
    helpBold: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    helpBoldCenter: {
        fontSize: 24,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    helpBoldSmall: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    helpText: {
        fontSize: 22,
    },
});

export default helpStyles;

