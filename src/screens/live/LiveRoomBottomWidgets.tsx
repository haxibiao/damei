import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    NativeModules,
    TouchableOpacity,
} from "react-native";
const { StatusBarManager } = NativeModules;
import { observer } from "mobx-react";
const { width: sw, height: sh } = Dimensions.get("window");
import { DataCenter } from '../../data';
import { ApolloClient } from "apollo-boost";

import * as Dankamu from './DankamuInputModal';

const BOTTOM_INPUT_WIDTH = sw * 0.45;
const BOTTOM_INPUT_MINHEIGHT = 32;

var client: ApolloClient<unknown>;

const LiveRoomBottomWidgets = () => {

    useEffect(() => {
        client = DataCenter.App.newclient;
    }, [DataCenter.App.newclient])

    return (
        <TouchableOpacity activeOpacity={1.0} style={styles.inputWrapper} onPress={() => {
            Dankamu.showInput();
        }}>
            <Text style={styles.input}>{'说点什么'}</Text>
        </TouchableOpacity>
    );
};
export default observer(LiveRoomBottomWidgets);

const styles = StyleSheet.create({
    input: {
        color: '#ffffffcc',
        marginStart: 10
    },
    inputWrapper: {
        minHeight: BOTTOM_INPUT_MINHEIGHT,
        width: BOTTOM_INPUT_WIDTH,
        borderRadius: 8,
        justifyContent: 'center',
        overflow: "hidden",
        backgroundColor: "#00000066",
        marginStart: 15,
    }
})