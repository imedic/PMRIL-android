import React, { Component } from 'react';
import { Button, Text, View, TextInput } from 'react-native';

class RosSetup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rosIp: "ws://localhost:9090",
            videoIp: "http://localhost:8080"
        }
    }

    save = () => {
        this.props.saveConfiguration(this.state.rosIp, this.state.videoIp);
    }

    changeRosIp = (text) => {
        this.setState({
            rosIp: text
        });
    }

    changeVideoIp = (text) => {
        this.setState({
            videoIp: text
        });
    }

    render() {
        return (
            <View>
                <View>
                    <Text>Ros server address</Text>
                    <TextInput type="text" value={this.state.rosIp} onChangeText={this.changeRosIp}/>
                </View>
                <View>
                    <Text>Video stream address</Text>
                    <TextInput type="text" value={this.state.videoIp} onChangeText={this.changeVideoIp}/>
                </View>
                <Button className="ros-setup-button" onPress={this.save} title="Save" />
            </View>
        );
    }
}

export default RosSetup;