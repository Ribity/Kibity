import React from 'react';
import Modal from "react-native-modal";
import MyHelpExit from "./MyHelpExit";
import HelpComponent from './HelpComponent';

export default class MyHelpModal extends React.Component {
    render() {
        return (
            <Modal style={{ margin: 5 }}
                   isVisible={this.props.isVisible}
                // backdropColor={'#AFC0AB'}
                   backdropColor={'purple'}
                   backdropOpacity={.5}
                   onBackdropPress={this.props.onExitPress}
                   supportedOrientations={['portrait', 'landscape']}
            >
                <HelpComponent screen={this.props.screen} parm1={this.props.parm1}/>

                <MyHelpExit onPress={this.props.onExitPress}/>

            </Modal>
        );
    }
}