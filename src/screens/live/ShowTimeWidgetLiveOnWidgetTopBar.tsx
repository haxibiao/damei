import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView, NativeModules, TouchableOpacity,StatusBar, Platform, TextInput } from 'react-native';
const { StatusBarManager } = NativeModules;
import { observer } from 'mobx-react';
import LiveStore from './LiveStore';
import {Avatar} from 'hxf-react-native-uilib';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as OnlinePeopleModal from './ShowTimeWidgetOnlinePeopleModal';
const { width: sw, height: sh } = Dimensions.get("window");

const TOP_WIDGET_HEIGHT = 40;
const TOP_WIDGET_WIDTH = sw * 0.33;
const TOP_WIDGET_AVATAR_SIZE = 36; // 2
const TOP_WIDGET_FOLLOW_HEIGHT = TOP_WIDGET_HEIGHT * 0.5;
const TOP_WIDGET_FOLLOW_WIDTH = TOP_WIDGET_FOLLOW_HEIGHT * 2.2;
const TOP_WIDGET_CENTER_WIDTH = TOP_WIDGET_WIDTH - TOP_WIDGET_AVATAR_SIZE - 12;
const TOP_WIDGET_CLOSE_SIZE = 30;
const TOP_WIDGET_ONLINE_WRAPPER_HEIGHT = 27;

const ShowTimeWidgetLiveOnWidgetTopBar = (props:{navigation:any}) => {

    const MoreLiveHandler = () => {
        console.log("设置showlivemodal 为 true")
        LiveStore.setshowlivemodal(true);
    }

    return (
        <View style={styles.TopWidgetContainer}>
            <View style={styles.TopLeftWidget}>
                <Avatar file={require('./res/avatar.png')} size={TOP_WIDGET_AVATAR_SIZE}/>
                <View style={{
                    width: TOP_WIDGET_CENTER_WIDTH,
                    height: TOP_WIDGET_HEIGHT,
                    justifyContent: 'center',
                    paddingStart: 8
                }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'white', marginBottom: 1 }}>丫ljfff</Text>
                    <Text style={{ fontSize: 10, color: 'white' }}>当前热度168</Text>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => {OnlinePeopleModal.showOnlinePeopleModal()}} style={styles.AudienceCountWrapper}>
                    <Text style={{
                        fontSize: 12,
                        color: 'white'
                    }}>当前在看1000人</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} onPress={ () => {props.navigation.goBack()} }>
                    <Image source={require('./res/close.png')} resizeMode={'contain'} style={{ height: TOP_WIDGET_CLOSE_SIZE, width: TOP_WIDGET_CLOSE_SIZE }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default observer(ShowTimeWidgetLiveOnWidgetTopBar);

const styles = StyleSheet.create({
    TopWidgetContainer: {
        width: sw,
        height: TOP_WIDGET_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    TopLeftWidget: {
        height: TOP_WIDGET_HEIGHT,
        width: TOP_WIDGET_WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#00000033',
        borderRadius: TOP_WIDGET_HEIGHT / 2,
        overflow: 'hidden',
        paddingHorizontal: 5
    },
    FollowWrapper:{
        height: TOP_WIDGET_FOLLOW_HEIGHT,
        width: TOP_WIDGET_FOLLOW_WIDTH,
        borderRadius: TOP_WIDGET_FOLLOW_HEIGHT / 2,
        overflow: 'hidden',
        backgroundColor: '#FE5F5F',
        justifyContent: 'center',
        alignItems: 'center'
    },
    AudienceCountWrapper:{
        paddingHorizontal: 5,
        height: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT,
        backgroundColor: '#00000033',
        borderRadius: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 3
    }
});