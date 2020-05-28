import React,{ useEffect,useState} from 'react';
import { View,Text,TouchableOpacity,Dimensions } from 'react-native';
import { Overlay } from 'teaset';
const {width:sw,height:sh} = Dimensions.get('window');

const Content = () => {

    const ReportHandler = () => {
        hide();
        Toast.show({content: '收到举报成功、我们将会对内容进行违规判断处理'})
    };
    const CancelHandler = () => {
        hide();
    };

    return (
        <View>
            <TouchableOpacity 
            onPress={ReportHandler}
            style={{
                width: sw,
                height:46,
                borderRadius:6,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'white',
                marginBottom:13
            }}>
                <Text>举报违规弹幕</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={CancelHandler}
            style={{
                width: sw,
                height:46,
                borderRadius:6,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'white',
                marginBottom: 50
            }}>
                <Text>取消</Text>
            </TouchableOpacity>
        </View>
    )
}

let key:any = null;
const show = () => {
    let v = (
        <Overlay.PullView
        side={'bottom'}
        containerStyle={{ justifyContent: 'flex-end', backgroundColor: 'transparent' }}
        overlayOpacity={0.6}>
            <Content />
        </Overlay.PullView>
    );
    key = Overlay.show(v);
};
const hide = () => {
    Overlay.hide(key);
};

export {
    show,
    hide
}