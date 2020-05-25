import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Overlay } from 'teaset';
import { sh, sw } from '../../tools';
import { observer,DataCenter } from '../../data';
import {GQL as NewGQL} from '../../network';
import LiveStore from './LiveStore';
import { ApolloClient } from 'apollo-boost';
import {LivePullManager} from 'hxf-tencent-live';

let overlaykey: any = null;
let client:ApolloClient<unknown> ;

const Content = observer((props: { navigation: any }) => {

    useEffect(() => {
        client = DataCenter.App.newclient;
    },[DataCenter.App.newclient])

    useEffect(() => {
        return () => {
            hideStreamerLeft();
        }
    }, []);

    const iKnowHandler = () => {
        props.navigation.goBack();
        //销毁直播
        LivePullManager.liveStopPull();
        console.log("停止拉流");
        //清除弹幕
        LiveStore.clearDankamu();
        console.log("清除弹幕数据");

        //离开直播间接口调用
        client.mutate({
            mutation: NewGQL.LeaveLiveRoom,
            variables: { roomid: LiveStore.roomidForOnlinePeople }
        }).then(rs => {
            //离开成功
            console.log("用户离开直播间", rs);
        }).catch(err => {
            //TODO: 离开接口调用失败
            console.log("用户离开直播间接口错误", err);
        });
        LiveStore.setStreamerLeft(false);
        hideStreamerLeft();
    }

    return (
        <View style={{ height: sh, width: sw, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0 }}>
            <View style={{ width: sw * 0.78, minHeight: sw * 0.62, justifyContent: 'space-around',alignItems:'center',backgroundColor:'white',borderRadius:20 }}>
                <View style={{width:'100%',alignItems:'center'}}>
                    <Image source={require('./res/offline.png')} resizeMode='contain' style={{ height: sw * 0.3, width: sw * 0.3 }} />
                    <Text style={{ color: '#999', fontSize: 16 }}>主播已下播~</Text>
                </View>
                <TouchableOpacity onPress={iKnowHandler} style={{paddingHorizontal:18,paddingVertical:8,backgroundColor:'#f1f1f1',borderRadius:12,marginBottom:8,marginTop:14}}>
                    <Text style={{color:'#999'}}>知道了</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
});

const showStreamerLeft = (navigation: any) => {

    const view = (
        <Overlay.View>
            <Content navigation={navigation} />
        </Overlay.View>
    );
    overlaykey = Overlay.show(view);
}

const hideStreamerLeft = () => {
    Overlay.hide(overlaykey);
}

export { showStreamerLeft, hideStreamerLeft }