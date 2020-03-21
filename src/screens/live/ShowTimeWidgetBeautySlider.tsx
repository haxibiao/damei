import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, Slider } from 'react-native';
const { width: sw, height: sh } = Dimensions.get('window');
// import { LivePushManager } from 'hxf-tencent-live';

const ShowTimeWidgetBeautySlider = React.memo(() => {

    useEffect(() => {
        //LivePushManager.liveSetBeautyMode('NATURAL');
    },[])

    const BlurHandler = (value:number) => {
        //LivePushManager.liveSetBeautyLevel(Math.round(value)*10);
    }

    const WhiteHandler = (value:number) => {
        //LivePushManager.liveSetWhitenessLevel(Math.round(value)*10);
    }
    
    return (
        <View style={{ width: sw * 0.5 }}>
            <Text style={styles.option_title}>磨皮</Text>
            <View style={styles.slider_wrapper}>
                <Slider 
                value={0} 
                thumbTintColor='#ffffffdd' 
                minimumTrackTintColor='#fff' 
                onValueChange={BlurHandler}/>
            </View>
            <Text style={styles.option_title}>美白</Text>
            <View style={styles.slider_wrapper}>
                <Slider 
                value={0} 
                thumbTintColor='#ffffffdd' 
                minimumTrackTintColor='#fff' 
                onValueChange={WhiteHandler}/>
            </View>
        </View>
    )
});

export default ShowTimeWidgetBeautySlider;

const styles = StyleSheet.create({
    option_title:{ 
        color: '#ffffffdd', 
        marginBottom: 5,
        fontWeight:'bold',
        textShadowColor:'#000',
        textShadowRadius:2 
    },
    slider_wrapper:{ 
        width: sw * 0.5, 
        height: 18, 
        borderRadius: 12, 
        backgroundColor: '#00000066' 
    },
})