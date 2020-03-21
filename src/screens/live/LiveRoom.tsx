import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions,Alert, Image, SafeAreaView,NativeEventEmitter, NativeModules, StatusBar, Platform, TextInput } from 'react-native';
const { StatusBarManager } = NativeModules;
//import { LivePushManager,LivePushView, VOICETYPE } from 'hxf-tencent-live';
// import { LivePullManager,LivePullView } from 'hxf-tencent-live';
const url = 'rtmp://live.dongdezhuan.com/live/lzp';
const licence = 'http://license.vod2.myqcloud.com/license/v1/d7f838e6d9a8f966bf740eda738a1511/TXLiveSDK.licence';
const key = 'f6a65ffa0a5e6b39451e5e4cb666e4ee';
const { width: sw, height: sh } = Dimensions.get("window");

import LiveRoomTopWidgets from './LiveRoomTopWidgets';
import LiveRoomBottomWidgets from './LiveRoomBottomWidgets';
import CommonWidgetLiveRoomMessages from './CommonWidgetLiveRoomMessages';

import LiveRoomListModal from './LiveRoomListModal';
const MemoLiveRoomListModal = React.memo(() => <LiveRoomListModal /> );



export default function LiveRoom(props) {

    useEffect(() => {

    },[]);

    return (
        <View style={{ flex: 1}}>
            <StatusBar hidden={true}/>
            
            <View style={{position:'absolute',zIndex:-2,width:sw,height:sh,backgroundColor:'#333'}}>
                {/* <LivePushView style={{height:sh,width:sw,backgroundColor:'yellow'}}/> */}
                <Image source={require('./res/bg.jpg')} resizeMode='cover' style={{position:'absolute',zIndex:-2,width:sw,height:sh}}/>
            </View>
            <MemoLiveRoomListModal />
            <SafeAreaView style={{ flex: 1,paddingTop:20,paddingBottom:12, justifyContent: 'space-between', alignItems: 'flex-start',backgroundColor:'transparent' }}>
                <LiveRoomTopWidgets navigation={props.navigation} />
                <View style={{height:sh*0.35 + 40}}>
                    <CommonWidgetLiveRoomMessages />
                    <LiveRoomBottomWidgets />
                </View>
            </SafeAreaView>
        </View>
    )
}
