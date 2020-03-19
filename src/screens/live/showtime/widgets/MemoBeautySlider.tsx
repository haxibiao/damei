import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, Slider } from 'react-native';

const { width: sw, height: sh } = Dimensions.get('window');

const MemoBeautySlider = React.memo(() => {
    
    return (
        <View style={{ width: sw * 0.5 }}>
            <Text style={styles.option_title}>磨皮</Text>
            <View style={styles.slider_wrapper}>
                <Slider 
                value={0} 
                thumbTintColor='#ffffffdd' 
                minimumTrackTintColor='#fff' 
                onValueChange={(value) => { console.log(value) }}/>
            </View>
            <Text style={styles.option_title}>美白</Text>
            <View style={styles.slider_wrapper}>
                <Slider 
                value={0} 
                thumbTintColor='#ffffffdd' 
                minimumTrackTintColor='#fff' 
                onValueChange={(value) => { }}/>
            </View>
        </View>
    )
});

export default MemoBeautySlider;

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