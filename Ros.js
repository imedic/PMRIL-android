import React, { Component } from 'react';
import { Button, Text, View, Image } from 'react-native';

import * as ROSLIB from 'roslib';

import RosButtonControl from './RosButtonControl';
import RosSpeedControl from './RosSpeedControl'
import RosSetup from './RosSetup';

class Ros extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            hasError: false,
            connected: false,
            msg: {
                linear: {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0
                },
                angular: {
                    x: -0.0,
                    y: -0.0,
                    z: -0.0
                }
            },
            speed: 1,
            configured: false,
            videoIp: "",
            videoTopic: "/stream?topic=/camera/rgb/image_raw&bitrate=5000&type=mjpeg"
        }

        this.ros = {}
        this.command = {}
    }

    configure = (rosIp, videoIp) => {
        this.ros = new ROSLIB.Ros({
            url: rosIp
        });

        this.ros.on('connection', () => {
            this.setState({
                isLoading: false,
                hasError: false,
                connected: true
            });
        });

        this.ros.on('error', () => {
            this.setState({
                isLoading: false,
                hasError: true,
                connected: false
            });
        });

        this.ros.on('close', () => {
            console.log('Connection to websocket server closed.');
        });

        this.command = new ROSLIB.Topic({
            ros: this.ros,
            name: '/mobile_base/commands/velocity',
            messageType: 'geometry_msgs/Twist'
        });

        this.setState({
            configured: true,
            videoIp: videoIp
        });
    }

    sendCommand = () => {
        this.command.publish(new ROSLIB.Message(this.state.msg));
    }

    increaseSpeed = () => {
        this.setState({
            speed: this.state.speed + 0.5
        })
    }

    decreaseSpeed = () => {
        if((this.state.speed - 0.5) > 0) {
            this.setState({
                speed: this.state.speed - 0.5
            })
        }
    }

    moveUp = () => {
        this.setState({
            msg: {...this.state.msg, 
                    linear: {...this.state.msg.linear, x: this.state.speed}, 
                    angular: {...this.state.msg.angular, z: 0}}
            
        }, () => {
            this.sendCommand();
        })
    }

    moveDown = () => {
        this.setState({
            msg: {...this.state.msg, 
                linear: {...this.state.msg.linear, x: -this.state.speed},
                angular: {...this.state.msg.angular, z: 0}}
        }, () => {
            this.sendCommand();
        })
    }

    turnLeft = () => {
        this.setState({
            msg: {...this.state.msg, 
                linear: {...this.state.msg.linear, x: 0},
                angular: {...this.state.msg.angular, z: 0.3}}
        }, () => {
            this.sendCommand();
        })
    }

    turnRight = () => {
        this.setState({
            msg: {...this.state.msg, 
                linear: {...this.state.msg.linear, x: 0},
                angular: {...this.state.msg.angular, z: -0.3}}
        }, () => {
            this.sendCommand();
        })
    }

    configuration() {
        if(!this.state.configured) {
            return <RosSetup saveConfiguration={this.configure}></RosSetup>
        }
    }

    isLoading() {
        if (this.state.isLoading && this.state.configured) {
            return <Text>Connecting to websocket server...</Text>
        }
    }

    hasError() {
        if (this.state.hasError && this.state.configured) {
            return <Text>Error in connection establishment</Text>
        }
    }

    rosControl() {
        if(this.state.connected && this.state.configured) {
            return (
                <View>
                    <RosSpeedControl increaseSpeed={this.increaseSpeed}
                                     decreaseSpeed={this.decreaseSpeed}></RosSpeedControl>
                    <RosButtonControl moveUp={this.moveUp}
                                      moveDown={this.moveDown}
                                      turnLeft={this.turnLeft}
                                      turnRight={this.turnRight}></RosButtonControl>
                    <View>
                    <Button onPress={()=>this.setState({videoTopic: "/stream?topic=/camera/rgb/image_raw&bitrate=5000&type=mjpeg"})}
                            title="RGV" />             
                    <Button onPress={()=>this.setState({videoTopic: "/stream?topic=/camera/depth/image_raw"})}
                            title="Depth" />
                    </View>
                    
                    <Image source={{ uri: this.state.videoIp + this.state.videoTopic}}/>
                </View>
            )
        }
    }

    render() {
        return (
            <View>
                {this.configuration()}
                {this.isLoading()}
                {this.hasError()}
                {this.rosControl()}
            </View>
        );
    }
}

export default Ros;
