import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput, Image, Slider } from 'react-native';
import { RoundedImage } from 'hxf-react-native-uilib';

import MemoBeautySlider from './widgets/MemoBeautySlider';
import MemoLivePreview from './widgets/MemoLivePreview';

const { width: sw, height: sh } = Dimensions.get('window');

const StartLiveButtonWidth = sw * 0.72;
const StartLiveButtonHeight = StartLiveButtonWidth * 0.2;
const CardWidth = sw * 0.8;
const CardHeight = CardWidth * 0.23;

const StartLive = (props: any) => {

    const [titlevalue, settitlevalue] = useState('Ylzppp的直播');
    const [showBeauty,setshowbeauty] = useState(false);

    const titleHandler = (text: string) => {
        settitlevalue(text);
    }

    const StartLiveHandler = () => {

    }

    return (
        <View style={styles.body}>
            <MemoLivePreview />

            <TouchableOpacity onPress={() => {props.navigation.goBack()}} style={{position:'absolute',left:10,top: sh * 0.06}}>
                <Image source={require('../res/close.png')} style={{height:34,width:34}} resizeMode='contain'/>
            </TouchableOpacity>

            <View style={{ width: CardWidth, backgroundColor: '#00000055', borderRadius: 10, padding: 6, marginTop: sh * 0.15, flexDirection: 'row', alignItems: 'center' }}>
                <RoundedImage file={require('../res/avatar.png')} width={60} height={60} radius={5} />
                <View style={{ marginLeft: 12 }}>
                    <Text style={{ color: '#ffffffaa', fontSize: 16, marginStart: 3.8 }}>直播标题</Text>
                    <TextInput value={titlevalue} onChangeText={titleHandler} style={{ paddingVertical: 0, color: '#ffffffcc', fontSize: 14 }} maxLength={15} />
                </View>
                <TouchableOpacity style={{position:'absolute',right:10}}>
                    <Image source={require('../res/switch_camera.png')} resizeMode='contain' style={{height:27,width:27,opacity:0.86}}/>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => {setshowbeauty(!showBeauty)}} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 20, marginTop: 20, backgroundColor: '#00000055' }}>
                <Text style={{ fontSize: 18, color: 'white', marginEnd: 5 }}>美颜</Text>
                <Image source={require('../res/meiyan.png')} style={{ height: 17, width: 17 }} resizeMode='contain' />
            </TouchableOpacity>

            { showBeauty && <MemoBeautySlider /> }

            <TouchableOpacity onPress={StartLiveHandler} style={styles.StartButton}>
                <Text style={{ fontSize: 19, color: '#ffffffdd' }}>开始直播</Text>
            </TouchableOpacity>
        </View>
    )
}

export default StartLive;

const styles = StyleSheet.create({
    body: {
        height: sh,
        width: sw,
        alignItems: 'center',
        backgroundColor: '#999'
    },
    StartButton: {
        width: StartLiveButtonWidth,
        height: StartLiveButtonHeight,
        borderRadius: StartLiveButtonHeight / 2,
        backgroundColor: '#F2CB17ee',
        position: 'absolute',
        bottom: sh * 0.1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})