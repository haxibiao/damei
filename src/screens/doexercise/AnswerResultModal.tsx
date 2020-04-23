import React from 'react';
import { View,Text,Image } from 'react-native';
import { Overlay } from 'teaset';
import {sh,sw} from '../../tools';

const ModalWidth = sw * 0.72;
const ModalHeight = sh * 0.32;
const ImgHeight = 592*ModalWidth/1005;
const Radius = 20;

//1005 * 592

const Content = () => {
    return (
        <View style={{flex:1,backgroundColor:'#00000055',justifyContent:'center',alignItems:'center'}}>
            <View style={{width:ModalWidth,minHeight:ModalHeight,alignItems:'center',backgroundColor:'white',borderRadius:Radius,overflow:'hidden'}}>
                <Image source={{uri: 'result_modal_bg'}} style={{width:ModalWidth,height:ImgHeight}} resizeMode='contain'/>
                <Text style={{fontSize:16,marginTop:13}}>恭喜回答正确</Text>
                <View></View>
            </View>
        </View>
    )
}

let key:any = null;
const show = () => {
    let view = (
        <Overlay.View>
            <Content />
        </Overlay.View>
    );
    key = Overlay.show(view);
}

const hide = () => {
    Overlay.hide(key);
}

export {show,hide}