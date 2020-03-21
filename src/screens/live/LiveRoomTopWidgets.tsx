import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView, NativeModules, TouchableOpacity,StatusBar, Platform, TextInput } from 'react-native';
const { StatusBarManager } = NativeModules;
import { observer } from 'mobx-react';
import LiveStore from './LiveStore';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { width: sw, height: sh } = Dimensions.get("window");

const TOP_WIDGET_HEIGHT = 40;
const TOP_WIDGET_WIDTH = sw * 0.41;
const TOP_WIDGET_AVATAR_SIZE = 36; // 2
const TOP_WIDGET_FOLLOW_HEIGHT = TOP_WIDGET_HEIGHT * 0.5;
const TOP_WIDGET_FOLLOW_WIDTH = TOP_WIDGET_FOLLOW_HEIGHT * 2.2;
const TOP_WIDGET_CENTER_WIDTH = TOP_WIDGET_WIDTH - TOP_WIDGET_AVATAR_SIZE - TOP_WIDGET_FOLLOW_WIDTH - 12;
const TOP_WIDGET_CLOSE_SIZE = 30;
const TOP_WIDGET_ONLINE_WRAPPER_HEIGHT = 27;

const LiveRoomTopWidgets = (props:{navigation:any}) => {

    const MoreLiveHandler = () => {
        console.log("设置showlivemodal 为 true")
        LiveStore.setshowlivemodal(true);
    }

    return (
        <View style={styles.TopWidgetContainer}>
            <View style={styles.TopLeftWidget}>
                <View style={{ height: TOP_WIDGET_AVATAR_SIZE, width: TOP_WIDGET_AVATAR_SIZE, overflow: 'hidden', borderRadius: TOP_WIDGET_AVATAR_SIZE / 2 }}>
                    <Image source={require('./res/avatar.png')} resizeMode='cover' style={{ height: TOP_WIDGET_AVATAR_SIZE, width: TOP_WIDGET_AVATAR_SIZE }} />
                </View>
                <View style={{
                    width: TOP_WIDGET_CENTER_WIDTH,
                    height: TOP_WIDGET_HEIGHT,
                    justifyContent: 'center',
                    paddingStart: 4
                }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'white', marginBottom: 1 }}>丫ljfff</Text>
                    <Text style={{ fontSize: 10, color: 'white' }}>当前热度168</Text>
                </View>
                <View style={styles.FollowWrapper}>
                    <Text style={{ fontSize: 13, color: 'white' }}>关注</Text>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}>
                <View style={styles.AudienceCountWrapper}>
                    <Text style={{
                        fontSize: 12,
                        color: 'white'
                    }}>当前在看1000人</Text>
                </View>
                <TouchableOpacity activeOpacity={0.9} onPress={ () => {props.navigation.goBack()} }>
                    <Image source={require('./res/close.png')} resizeMode={'contain'} style={{ height: TOP_WIDGET_CLOSE_SIZE, width: TOP_WIDGET_CLOSE_SIZE }} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.9} onPress={MoreLiveHandler} style={{position:'absolute',right:13,bottom:-30,backgroundColor:'#00000033',paddingHorizontal:8,paddingVertical:2,borderRadius:12}}>
                <Text style={{fontSize:13,color:'white'}}>{'更多直播'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default observer(LiveRoomTopWidgets);

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