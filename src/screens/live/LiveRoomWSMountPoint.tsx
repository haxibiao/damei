import React,{useEffect,useState} from 'react';
import { View,Text } from 'react-native';
import { DataCenter,observer,when } from '../../data';
import LiveStore from './LiveStore';
import Echo from 'laravel-echo';
const SocketIO = require('socket.io-client');
import * as KissBoBoModal from './EasterEggs/KissBoBoModal';
import {SocketServer} from '../../../app.json';

enum ColorfulEgg {
    bbobbo = 'BboBbo'
}

const LiveRoomWSMountPoint = (props:{id:string}) => {

    useEffect(() => {
        console.log("LiveRoomMountPoint函数useEffect执行了",SocketServer,props.id);
        let LiveEcho:any = new Echo({
            broadcaster: 'socket.io',
            host: SocketServer,
            client: SocketIO,
        });
        if(LiveEcho){
            console.log("echo对象创建成功");
        }

        LiveEcho.channel(`live_room.${props.id}`)
            .listen('.user_come_in',e => {
                console.log(e);
                LiveStore.pushDankamu({name:`用户 ${e.user_name} 进入直播间`,message:''});
                if(e.count_audience) LiveStore.setCountAudience(e.count_audience);
            })
            .listen('.new_comment',e => {
                console.log("新消息",e);
                let msg:string = e?.message ?? '';
                LiveStore.pushDankamu({name:e?.user_name ?? ''  ,message: msg});
                console.log("直播间新消息",LiveStore.dankamu[LiveStore.dankamu.length-1])
                if(e.egg.popup){
                    switch(e.egg.type){
                        case ColorfulEgg.bbobbo:
                            KissBoBoModal.showBoBo(msg);
                            break;
                    }
                }
            })
            .listen('.close_room',e => {
                console.log(e);
                //TODO: 主播下播
                if(LiveEcho){
                    LiveEcho.leaveChannel(`live_room.${props.id}`);
                }
                LiveStore.setStreamerLeft(true);
                LiveEcho = undefined;
            })
            .listen('.user_go_out',e => {
                console.log(e);
                //if(e.message) LiveStore.pushDankamu({name:e.message,message:''});
                if(e.count_audience) LiveStore.setCountAudience(e.count_audience);
            })

        return () => {
            if(LiveEcho){
                LiveEcho.leaveChannel(`live_room.${props.id}`);
                console.log("观众端Echo离开channel:"+`live_room.${props.id}`);
            }
            LiveEcho = undefined;
            if(LiveEcho == undefined){
                console.log("观众端Echo销毁成功")
            }
        }
    },[])

    return <View style={{position:'absolute'}}/>
}
export default observer(LiveRoomWSMountPoint);

