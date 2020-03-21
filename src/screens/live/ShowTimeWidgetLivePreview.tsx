import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, Slider } from 'react-native';
const { width: sw, height: sh } = Dimensions.get('window');
// import {LivePushView} from 'hxf-tencent-live';

const ShowTimeWidgetLivePreview = React.memo(() => {
    return (
        <View style={{ position: 'absolute', zIndex: -9, height: sh, width: sw }}>
            <Image source={require('./res/bg.jpg')} resizeMode='cover' style={{height:sh,width:sw}}/>
            {/* <LivePushView style={{height:sh,width:sw}}/> */}
        </View>
    )
});

export default ShowTimeWidgetLivePreview;