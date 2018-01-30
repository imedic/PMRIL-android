import React, { Component } from 'react';
import { Button, Text, View, TextInput } from 'react-native';

class RossButtonControl extends Component {
    render() {
        return (
            <View>
                <Button onPress={() => this.props.turnLeft()} title="Left"/>
                <Button onPress={() => this.props.moveUp()} title="Up"/>
                <Button onPress={() => this.props.moveDown()} title="Down"/>
                <Button onPress={() => this.props.turnRight()} title="Right"/>
            </View>
        );
    }
}

export default RossButtonControl;