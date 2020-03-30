import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView, NativeModules, TouchableOpacity,StatusBar, Platform, TextInput } from 'react-native';
import {LivePullManager} from 'hxf-tencent-live';
import { observer } from 'mobx-react';
import LiveStore from './LiveStore';
import {Avatar} from 'hxf-react-native-uilib';
import { GQL } from 'apollo'; //需要调用的接口为旧答妹的接口
import { DataCenter } from '../../data';
import { ApolloClient } from 'apollo-boost';
import {GQL as NewGQL} from '../../network';
const StatusBarHeight = StatusBar.currentHeight ?? 0; //状态栏高度
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { width: sw, height: sh } = Dimensions.get("window");

const TOP_WIDGET_HEIGHT = 40;
const TOP_WIDGET_WIDTH = sw * 0.41;
const TOP_WIDGET_AVATAR_SIZE = 36; // 2
const TOP_WIDGET_FOLLOW_HEIGHT = TOP_WIDGET_HEIGHT * 0.5;
const TOP_WIDGET_FOLLOW_WIDTH = TOP_WIDGET_FOLLOW_HEIGHT * 2.2;
const TOP_WIDGET_CENTER_WIDTH = TOP_WIDGET_WIDTH - TOP_WIDGET_AVATAR_SIZE - TOP_WIDGET_FOLLOW_WIDTH - 12;
const TOP_WIDGET_CLOSE_SIZE = 30;
const TOP_WIDGET_ONLINE_WRAPPER_HEIGHT = 27;

/**
 *  topwidget 子组件 =>  关注按钮
 */
let clickinter: number;
let client:ApolloClient<unknown>;
let newclient:ApolloClient<unknown>;
const FollowButton = observer((props:{isFollowed:boolean,streamerid:string}) => {
    const [followed,setfollowed] = useState(false);
    const [clickcount,setclickcount] = useState(0);
    const [disabled,setdisabled] = useState(false);
    
    useEffect(() => {
        client = DataCenter.App.client;
        newclient = DataCenter.App.newclient;
        setfollowed(props.isFollowed);
        clickinter = setInterval(() => {
            setclickcount(0);
        },15000);
        return () => {
            if(clickinter) clearInterval(clickinter);
        }
    },[])
    function followMutate(){
        if(client){
            client.mutate({
                mutation: GQL.FollowToggbleMutation,
                variables:{followed_type: 'users',followed_id:props.streamerid}
            }).then((rs) => {
                console.log("关注成功",rs);
            }).catch((err:any) => {
                console.log("关注mutation错误",err)
            })
        }
    }
    //关注处理函数
    const followHandler = () => {
        if(clickcount > 7){
            if(!disabled)setdisabled(true);
            return;
        };
        let c = clickcount + 1;
        setclickcount(c);
        if(clickcount <= 2){
            setfollowed(true);
            followMutate();
        }else if(clickcount <= 6){
            LiveStore.pushDankamu({name:'你点这么快干嘛啦(╯>д<)╯⁽˙³˙⁾',message:''});
        }else{
            LiveStore.pushDankamu({name:' 讨厌鬼!ヽ(｀Д´)ﾉ 不准你点了! ',message:''});
        }
    }
    //取消关注处理函数
    const unfollowHandler = () => {
        if(clickcount > 7){
            if(!disabled)setdisabled(true);
            return;
        };
        let c = clickcount + 1;
        setclickcount(c);
        if(clickcount <= 2){
            setfollowed(false);
            followMutate();
        }else if(clickcount <= 6){
            LiveStore.pushDankamu({name:'你点这么快干嘛啦(╯>д<)╯⁽˙³˙⁾',message:''});
        }else{
            LiveStore.pushDankamu({name:' 讨厌鬼!ヽ(｀Д´)ﾉ 不准你点了! ',message:''});
        }
    }

    return (
        <View>
            {
                followed ? (
                    <TouchableOpacity disabled={disabled} onPress={unfollowHandler} style={styles.likeBtn}>
                        <Image source={require('../../assets/images/ic_liked.png')} style={{height:35,width:35}} resizeMode='contain'/>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity disabled={disabled} onPress={followHandler} style={styles.FollowWrapper}>
                        <Text style={{ fontSize: 13, color: 'white' }}>关注</Text>
                    </TouchableOpacity>
                )
            }
        </View>
    )
});

/**
 *  topwidget 子组件 =>  热度
 */
const HotDot = observer(() => {
    return <Text style={{ fontSize: 10, color: 'white' }}>{`当前热度${LiveStore.hot}`}</Text>
});

/**
 *  topwidget 子组件 => 当前人数
 */
const CurrentPeople = observer((props:any) => {

    useEffect(() => {

        return () => {
            /**
             *  将热度和人数值复位
             */
            LiveStore.setHot(0);
            LiveStore.setCountAudience(0);
        }
    },[])

    return (
        <View style={styles.AudienceCountWrapper}>
            <Text style={{
                fontSize: 12,
                color: 'white'
            }}>{LiveStore.count_audience}</Text>
        </View>
    )
});

/**
 * 离开直播间按钮
 */
const CloseButton = observer((props:any) => {

    useEffect(() => {
        return () => {
            //为防止用户直接使用物理按键返回，在组件销毁时也调用离开mutation
            newclient.mutate({
                mutation: NewGQL.LeaveLiveRoom,
                variables: {roomid: LiveStore.roomidForOnlinePeople}
            }).then(rs => {
                //离开成功
                console.log("[Protect]用户离开直播间mutation调用成功",rs);
            }).catch(err => {
                //TODO: 离开接口调用失败
                console.log("[Protect]用户离开直播间接口错误",err);
            });
            LiveStore.setStreamerLeft(false); //离开时设置 主播下播 为false, 隐藏下播状态图
            LivePullManager.liveStopPull();
            console.log("[Protect]停止拉流");
            LiveStore.clearDankamu();
            console.log("[Protect]清除弹幕数据");
        }
    },[])

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={ () => {
            props.navigation.goBack();
            //销毁直播
            LivePullManager.liveStopPull();
            console.log("停止拉流");
            //清除弹幕
            LiveStore.clearDankamu();
            console.log("清除弹幕数据");

            //离开直播间接口调用
            newclient.mutate({
                mutation: NewGQL.LeaveLiveRoom,
                variables: {roomid: LiveStore.roomidForOnlinePeople}
            }).then(rs => {
                //离开成功
                console.log("用户离开直播间",rs);
            }).catch(err => {
                //TODO: 离开接口调用失败
                console.log("用户离开直播间接口错误",err);
            });
            LiveStore.setStreamerLeft(false);
        }}>
            <Image source={require('./res/close.png')} resizeMode={'contain'} style={{ height: TOP_WIDGET_CLOSE_SIZE, width: TOP_WIDGET_CLOSE_SIZE }} />
        </TouchableOpacity>
    )
})

const LiveRoomTopWidgets = (props:{navigation:any,streamer:{id:string,name:string,avatar:string,count_audience:number}}) => {

    return (
        <View style={[styles.TopWidgetContainer,{marginTop: StatusBarHeight + 12}]}>
            <View style={styles.TopLeftWidget}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    console.log("点击头像")
                    //跳转到用户详情页
                    if(props.navigation){
                        console.log("navigation存在，进行跳转",props.navigation)
                        props.navigation.navigate('User',{user: {id:props.streamer.id,name:props.streamer.name}});
                    }else{
                        console.log("navigation不存在")
                    }
                }}>
                    <Avatar uri={props.streamer.avatar} size={TOP_WIDGET_AVATAR_SIZE}/>
                </TouchableOpacity>
                <View style={styles.hot}>
                    <Text style={styles.nameTitle} numberOfLines={1}>{props?.streamer?.name ?? ''}</Text>
                    <HotDot />
                </View>
                <FollowButton isFollowed={props.streamer.is_followed} streamerid={props.streamer.id}/>
            </View>

            <View style={styles.row}>
                <CurrentPeople count_audience={props.streamer.count_audience ?? 0}/>
                <CloseButton navigation={props.navigation}/>
            </View>

            {/* <TouchableOpacity activeOpacity={0.9} onPress={MoreLiveHandler} style={{position:'absolute',right:13,bottom:-30,backgroundColor:'#00000033',paddingHorizontal:8,paddingVertical:2,borderRadius:12}}>
                <Text style={{fontSize:13,color:'white'}}>{'更多直播'}</Text>
            </TouchableOpacity> */}
        </View>
    )
}

export default observer(LiveRoomTopWidgets);

const styles = StyleSheet.create({
    TopWidgetContainer: {
        width: sw,
        height: TOP_WIDGET_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        zIndex:10
    },
    TopLeftWidget: {
        height: TOP_WIDGET_HEIGHT,
        width: TOP_WIDGET_WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#00000033',
        borderRadius: TOP_WIDGET_HEIGHT / 2,
        overflow: 'hidden',
        paddingHorizontal: 5
    },
    FollowWrapper:{
        height: TOP_WIDGET_FOLLOW_HEIGHT,
        width: TOP_WIDGET_FOLLOW_WIDTH,
        borderRadius: TOP_WIDGET_FOLLOW_HEIGHT / 2,
        overflow: 'hidden',
        backgroundColor: '#FE5F5F',
        justifyContent: 'center',
        alignItems: 'center'
    },
    AudienceCountWrapper:{
        paddingHorizontal: 9,
        height: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT,
        backgroundColor: '#00000033',
        borderRadius: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 3
    },
    nameTitle:{ 
        fontSize: 14, 
        fontWeight: '500', 
        color: 'white', 
        marginBottom: 1, 
        width: TOP_WIDGET_CENTER_WIDTH * 0.78 
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    hot:{
        width: TOP_WIDGET_CENTER_WIDTH,
        height: TOP_WIDGET_HEIGHT,
        justifyContent: 'center',
        paddingStart: 8
    },
    likeBtn:{
        height:38,
        width:TOP_WIDGET_FOLLOW_WIDTH,
        justifyContent:'center',
        alignItems:'center'
    }
});