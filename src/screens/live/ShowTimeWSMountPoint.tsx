import React,{useEffect,useState} from 'react';
import { View,Text } from 'react-native';
import { DataCenter,observer,when } from '../../data';
import LiveStore from './LiveStore';
import Echo from 'laravel-echo';
const SocketIO = require('socket.io-client');
import * as KissBoBoModal from './EasterEggs/KissBoBoModal';
import {SocketServer} from '../../../app.json';

var LiveEcho:any = null;

enum ColorfulEgg {
    bbobbo = 'BboBbo'
}

const ShowTimeWSMountPoint = (props:{}) => {

    when(
        () => LiveStore.leaveRoom,
        () => {
            console.log('主播离开，关闭直播')
            if(LiveStore.joinRoomEcho){
                LiveEcho.leaveChannel(`live_room.${LiveStore.roomidForOnlinePeople}`);
                LiveEcho = null;
                LiveStore.setJoinRoomEcho(null);
                LiveStore.setLeaveRoom(false);
            }
        }
    )

    useEffect(() => {
        console.log("MountPoint函数useEffect执行了")

        LiveEcho = new Echo({
            broadcaster: 'socket.io',
            host: SocketServer,
            client: SocketIO,
        });

        LiveEcho.channel(`live_room.${LiveStore.roomidForOnlinePeople}`)
            .listen('.user_come_in',e => {
                console.log(e);
                LiveStore.pushDankamu({name:`用户 ${e.user_name} 进入直播间`,message:''});
                if(e.count_audience) LiveStore.setCountAudience(e.count_audience);
            })
            .listen('.new_comment',e => {
                console.log("新消息",e);
                let msg:string = e?.message ?? '';
                LiveStore.pushDankamu({name:e?.user_name ?? '' ,message: e?.message ?? ''});
                if(e.egg.popup){
                    switch(e.egg.type){
                        case ColorfulEgg.bbobbo:
                            KissBoBoModal.showBoBo(msg);
                            break;
                    }
                }
            })
            .listen('.user_go_out',e => {
                console.log(e);
                if(e.message) LiveStore.pushDankamu({name:e.message,message:''});
                if(e.count_audience) LiveStore.setCountAudience(e.count_audience);
            })
    },[LiveStore.roomidForOnlinePeople]);


    return <View style={{position: 'absolute'}}/>
}
export default observer(ShowTimeWSMountPoint);

