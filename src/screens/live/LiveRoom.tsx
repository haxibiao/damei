import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions,Alert,StatusBar,Image } from 'react-native';
import { LivePullManager,LivePullView, LIVE_TYPE } from 'hxf-tencent-live';
import LottieView from 'lottie-react-native';
import { when,observer,DataCenter } from '../../data';
import {GQL} from '../../network';
import LiveStore from './LiveStore';
const { width: sw, height: sh } = Dimensions.get("window");

import LiveRoomTopWidgets from './LiveRoomTopWidgets';
import LiveRoomBottomWidgets from './LiveRoomBottomWidgets';
import CommonWidgetLiveRoomMessages from './CommonWidgetLiveRoomMessages';

import LiveRoomListModal from './Depre_LiveRoomListModal';
import { ApolloClient } from 'apollo-boost';
const MemoLiveRoomListModal = React.memo(() => <LiveRoomListModal /> );
import LiveRoomWSMountPoint from './LiveRoomWSMountPoint';
import {app} from '../../store';

interface MountPoint {
    id: string
}

const MemoMountPoint = React.memo( (props:MountPoint) => <LiveRoomWSMountPoint id={props.id} />)

const StreamerLeft = observer( (props:any) => {

    if(LiveStore.streamerLeft){
        return (
            <View style={{height:sh,width:sw,justifyContent:'center',alignItems:'center',position:'absolute',top:0}}>
                    <Image source={require('./res/offline.png')} resizeMode='contain' style={{height:sw *0.3,width:sw*0.3 }}/>
                    <View style={{backgroundColor:'#00000055',borderRadius:8,alignItems:'center',justifyContent:'center',marginTop:10,paddingHorizontal:8}}>
                        <Text style={{color:'white',fontSize:16}}>主播已下播~</Text>
                    </View>
            </View>
        )
    }else{
        return <View style={{position:'absolute',width:0,height:0}}/>
    }
})

var newclient: ApolloClient<unknown> ;
const LiveRoom = (props:any) => {

    const navigation = props.navigation;
    const RoomId = navigation.getParam('roomid'); //跳转过来时传递的 房间号ID
    const [loading,setloading] = useState(true);
    const [prepared,setprepared] = useState(false);
    const [streamer,setstreamer] = useState({}); //主播信息
    const [alreadyleave,setalreadyleave] = useState(false);

    useEffect(() => {
        // let connectevt = LivePullManager.subscrib('PLAY_EVT_CONNECT_SUCC',e => {
        //     LiveStore.pushDankamu({name:'连接服务器成功',message:''})
        // })

        // let loadingevt = LivePullManager.subscrib('PLAY_EVT_PLAY_LOADING',event => {
        //     LiveStore.pushDankamu({name:"直播加载中...",message:""})
        // })
        let beginevt = LivePullManager.subscrib('PLAY_EVT_PLAY_BEGIN',(event) => {
            //LiveStore.pushDankamu({name:"直播开始!",message:''});
            setloading(false);
        });
        let endevt = LivePullManager.subscrib('PLAY_EVT_PLAY_END',(event) => {
            //直播已结束
            LiveStore.pushDankamu({name:"直播已结束",message:''})
        });
        let disconnectevt = LivePullManager.subscrib('PLAY_ERR_NET_DISCONNECT',(event) => {
            //网络无法重连，可能直播已结束
            //LiveStore.pushDankamu({name:"网络严重错误",message:''})
            setalreadyleave(true);
        });

        return () => {
            // connectevt.remove();
            // loadingevt.remove();
            beginevt.remove();
            endevt.remove();
            disconnectevt.remove();
        }
    },[])

    useEffect(() => {
        //清空消息列表
        LiveStore.clearDankamu();
        newclient = DataCenter.App.newclient;
        if(newclient){
            newclient.mutate({
                mutation: GQL.EnterLiveRoom,
                variables: {id: RoomId}, // 传入房间id
                fetchPolicy: 'no-cache'
            }).then((rs:any) => {
                let d = rs.data?.joinLiveRoom ;
                console.log('单个直播间数据: ',rs);
                LiveStore.setroomidForOnlinePeople(rs.data?.joinLiveRoom.id);
                let { streamer,pull_url,count_audience } = rs.data.joinLiveRoom;
                streamer.count_audience = count_audience;
                setstreamer(streamer);
                setprepared(true);
                console.log('拉流地址: ',pull_url);
                //开始拉流 -- 
                LivePullManager.liveStartPull(pull_url,0);
                setTimeout(() => {
                    LivePullManager.liveStartPull(pull_url,0);
                },500);
                LiveStore.pushDankamu({name:`小答妹: *~(￣▽￣)~[] []~(￣▽￣)~* 欢迎来到${streamer.name}的直播间`,message:''});
                LiveStore.pushDankamu({name:'小答妹: 为了营造绿色网络环境、请遵守文明准则哦。禁止发表涉及暴力、色情、歧视等言论。不遵守者一旦被查出将有封号风险。',message:''})
            }).catch((err:any) => {
                console.log(err)
                //GQL错误
                let content = err.message.replace('GraphQL error: ', '');
                //if(content.indexOf('离开') == -1) content = '小答妹:（o´ﾟ□ﾟ`o）啊哦、服务器出错~';
                //LiveStore.pushDankamu({name:content,message:''})
            })
        }

        return () => {
            //组件销毁，清除数据
            LivePullManager.liveStopPull();
            LiveStore.clearDankamu();
            LiveStore.setStreamerLeft(false);
        }
    },[]);

    return (
        <View style={styles.body}>
            <StatusBar hidden={true}/>
            
            <View style={styles.content}>
                {
                    prepared && <LivePullView style={{height:sh,width:sw,backgroundColor:'#333'}}/>
                }
                {
                    loading && <LottieView source={require('./res/wind.json')} style={{width:'100%',position:'absolute',zIndex:8}} loop autoPlay/>
                }
                <StreamerLeft />
            </View>
            <LiveRoomTopWidgets navigation={props.navigation} streamer={streamer}/>
            <View style={{height:sh*0.35 + 40,zIndex:10}}>
                <CommonWidgetLiveRoomMessages />
                {
                    !loading && <LiveRoomBottomWidgets />
                }
            </View>
            <MemoMountPoint id={RoomId} />
        </View>
    )
}

export default observer(LiveRoom);

const styles = StyleSheet.create({
    body:{ 
        flex: 1,
        justifyContent:'space-between',
        paddingTop:20,
        backgroundColor:'#333',
    },
    content:{
        position:'absolute',
        zIndex:5,
        top:0,
        bottom:0,
        width:sw*0.9999,
        height:sh,
        justifyContent:'center',
        backgroundColor:'#333'
    }
})