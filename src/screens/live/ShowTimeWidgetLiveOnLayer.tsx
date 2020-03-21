import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions,SafeAreaView, TouchableOpacity, Text, TextInput, Image, Slider } from 'react-native';
import { RoundedImage } from 'hxf-react-native-uilib';
// import { LivePushManager } from 'hxf-tencent-live';
import MemoBeautySlider from './ShowTimeWidgetBeautySlider';
import {DataCenter} from '../../data';
import {app} from '../../store'; //TODO: replace this import later
import { GQL } from '../../network';
const { width: sw, height: sh } = Dimensions.get('window');

import ShowTimeWidgetLiveOnWidgetTopBar from './ShowTimeWidgetLiveOnWidgetTopBar';
import CommonWidgetLiveRoomMessages from './CommonWidgetLiveRoomMessages';

const ShowTimeWidgetLiveOnLayer = (props:any) => {

    return (
        <View style={styles.body}>
            <SafeAreaView style={{ flex: 1,paddingTop:30,paddingBottom:12, justifyContent: 'space-between', alignItems: 'flex-start',backgroundColor:'transparent' }}>
                <ShowTimeWidgetLiveOnWidgetTopBar navigation={null}/>
                <CommonWidgetLiveRoomMessages/>
            </SafeAreaView>
        </View>
    )
}

export default ShowTimeWidgetLiveOnLayer;

const styles = StyleSheet.create({
    body: {
        height:sh,
        width:sw
    }
});