import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,KeyboardAvoidingView, Dimensions,Keyboard, Image, SafeAreaView, NativeModules, StatusBar, Platform, TextInput,TouchableOpacity } from 'react-native';
const { StatusBarManager } = NativeModules;
import LiveStore from '../livestore';
import { observer } from 'mobx-react';
const { width: sw, height: sh } = Dimensions.get("window");


const TOP_WIDGET_HEIGHT = 40;
const TOP_WIDGET_WIDTH = sw * 0.41;
const TOP_WIDGET_AVATAR_SIZE = 36; // 2
const TOP_WIDGET_FOLLOW_HEIGHT = TOP_WIDGET_HEIGHT * 0.5;
const TOP_WIDGET_FOLLOW_WIDTH = TOP_WIDGET_FOLLOW_HEIGHT * 2.2;
const TOP_WIDGET_CENTER_WIDTH = TOP_WIDGET_WIDTH - TOP_WIDGET_AVATAR_SIZE - TOP_WIDGET_FOLLOW_WIDTH - 12;
const TOP_WIDGET_CLOSE_SIZE = 30;
const TOP_WIDGET_ONLINE_WRAPPER_HEIGHT = 27;

const BOTTOM_INPUT_WIDTH = sw * 0.78;
const BOTTOM_INPUT_MINHEIGHT = 35;
const BOTTOM_BUTTON_SIZE = 36;

const LiveRoomBottomWidgets = () => {

    // Keyboard.addListener("keyboardDidChangeFrame",(e)=>{
    //     console.log(e);
    // })

    return (
        <KeyboardAvoidingView behavior={'height'} keyboardVerticalOffset={50}>
            <View style={{flexDirection:'row',width:sw,alignItems:'center',justifyContent:"space-evenly"}}>
            <View style={{
                minHeight: BOTTOM_INPUT_MINHEIGHT,
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: '#00000066',
            }}>
                <TextInput
                    multiline={true}
                    placeholder={'说点什么 ...'}
                    placeholderTextColor={'#ffffffdd'}
                    style={{
                        minHeight: BOTTOM_INPUT_MINHEIGHT,
                        width: BOTTOM_INPUT_WIDTH,
                        paddingTop:8,
                        paddingBottom:0,
                        paddingHorizontal:10
                    }}
                />
            </View>
            <TouchableOpacity onPress={() => {
                let temp = LiveStore.dankamu;
                temp.push({name: 'hello',message:'我滴个乖乖'});
                LiveStore.setDankamu([...temp]);
            }}>
            <Image source={require('../res/send.png')} resizeMode='contain' style={{height:BOTTOM_BUTTON_SIZE,width:BOTTOM_BUTTON_SIZE}}/>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    )
}
export default observer(LiveRoomBottomWidgets);