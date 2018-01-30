import React, { Component } from 'react';
import { Button, Text, View, TextInput } from 'react-native';

class RosSpeedControl extends Component {
    render() {
        return (
            <View>
                <Button onPress={() => this.props.increaseSpeed()} title="Increase Speed" />
                <Button onPress={() => this.props.decreaseSpeed()} title="Decrease Speed" />
            </View>
        );
    }
}

export default RosSpeedControl;