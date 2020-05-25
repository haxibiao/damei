import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, Animated, Easing, Image } from 'react-native';
import LiveStore from './LiveStore';
import { observer } from 'mobx-react';
import { when } from 'mobx';
import { Overlay } from 'teaset';
import { Avatar } from 'hxf-react-native-uilib';
import {GQL} from 'apollo'
import { app } from 'store';

const { width: sw, height: sh } = Dimensions.get('window');
const FollowWidth = sw * 0.6;
const FollowHeight = 38;
const AvatarSize = 75;

let key: any = null;
let client:any = null;
const ContentView = observer((props: any) => {

    const navigation = props.navigation;

    useEffect(() => {
        client = app.client;
    },[]);
    function followMutate(){
        if(client){
            client.mutate({
                mutation: GQL.FollowToggbleMutation,
                variables:{followed_type: 'users',followed_id:props.streamerid}
            }).then((rs:any) => {
                console.log("关注成功",rs);
                if(rs.data.followToggle == null){
                    LiveStore.setFollowedStreamer(false);
                }else{
                    LiveStore.setFollowedStreamer(true);
                }
            }).catch((err:any) => {
                console.log("关注mutation错误",err);
                Toast({content: '网络错误，请稍后重试'});
            });
        }
    }

    return (
        <View style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
            paddingBottom: 50,
            backgroundColor:'white'
        }}>
            <Avatar uri={''} size={AvatarSize} borderWidth={1} borderColor={'white'} frameStyle={{ marginTop: -25, marginBottom: 10, backgroundColor: 'orange' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                <Text style={{ color: "#222", marginEnd: 12, fontSize: 16 }}>哈哈哈哈哈</Text>
                <Image source={require('./res/level_badge.png')} resizeMode={'contain'} style={{ height: 20, width: 20, marginEnd: 6 }} />
                <Text style={{ fontSize: 16, color: '#888' }}>2级</Text>
            </View>
            <Text style={{color:'#888',marginTop:20,marginBottom:8}}>关注主播，不错过任何一次直播</Text>
            <TouchableOpacity 
            onPress={followMutate}
            style={{
                justifyContent:'center',
                alignItems:'center',
                width:FollowWidth,
                height:FollowHeight,
                backgroundColor: LiveStore.followedStreamer ? '#ddd' : '#FDF187',
                borderRadius:FollowHeight/2,
                marginTop:30
            }}>
                <Text style={{color:'#555',fontSize:15}}>{LiveStore.followedStreamer ? "取消关注" : "关注"}</Text>
            </TouchableOpacity>
        </View>
    );
});
const show = (navigation:any) => {
    let v = (
        <Overlay.PullView
            side={'bottom'}
            containerStyle={{ justifyContent: 'flex-end',backgroundColor:'transparent' }}
            overlayOpacity={0.3}>
            <ContentView navigation={navigation}/>
        </Overlay.PullView>
    );
    key = Overlay.show(v);
};
const hide = () => {
    Overlay.hide(key);
};

export { show, hide }

const styles = StyleSheet.create({
    button: {
        width: 120,
        height: 32,
        borderRadius: 16,
    },
})