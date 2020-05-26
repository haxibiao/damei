import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView, NativeModules, TouchableOpacity,StatusBar, Platform, TextInput,FlatList } from 'react-native';
import {LivePullManager} from 'hxf-tencent-live';
import { observer } from 'mobx-react';
import LiveStore from './LiveStore';
import {Avatar} from 'hxf-react-native-uilib';
import { GQL } from 'apollo'; //需要调用的接口为旧答妹的接口
import { DataCenter } from '../../data';
import { ApolloClient } from 'apollo-boost';
import {GQL as NewGQL} from '../../network';
const StatusBarHeight = StatusBar.currentHeight ?? 0; //状态栏高度
import {useStatusHeight} from 'components';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as CommonWidgetStreamerCardModal from './CommonWidgetStreamerCardModal';
import CommonWidgetTopOnlinePeopleList from './CommonWidgetTopOnlinePeopleList'; 
import * as CommonWidgetUserCardModal from './CommonWidgetUserCardModal';

const { width: sw, height: sh } = Dimensions.get("window");

const TOP_WIDGET_HEIGHT = 30;
const TOP_WIDGET_WIDTH = sw * 0.345;
const TOP_WIDGET_AVATAR_SIZE = 25; // 2

const TOP_WIDGET_FOLLOW_CONTAINER_SIZE = 24;
const TOP_WIDGET_FOLLOW_CONTAINER_SIZE_WIDTH = 30;
const TOP_FOLLOW_SIZE = 20;

const TOP_WIDGET_CENTER_WIDTH = TOP_WIDGET_WIDTH - TOP_WIDGET_AVATAR_SIZE - TOP_WIDGET_FOLLOW_CONTAINER_SIZE_WIDTH;
const TOP_WIDGET_CLOSE_SIZE = 30;
const TOP_WIDGET_ONLINE_WRAPPER_HEIGHT = 27;


/**
 *  topwidget 子组件 =>  关注按钮
 */
let clickinter: number;
let client:ApolloClient<unknown>;
let newclient:ApolloClient<unknown>;
const FollowButton = observer((props:{isFollowed:boolean,streamerid:string}) => {

    useEffect(() => {
        client = DataCenter.App.client;
        newclient = DataCenter.App.newclient;
        LiveStore.setFollowedStreamer(props.isFollowed);
    },[props.isFollowed]);
    function followMutate(){
        if(client){
            client.mutate({
                mutation: GQL.FollowToggbleMutation,
                variables:{followed_type: 'users',followed_id:props.streamerid}
            }).then((rs) => {
                console.log("关注成功",rs);
                if(rs.data.followToggle == null){
                    LiveStore.setFollowedStreamer(false);
                }else{
                    LiveStore.setFollowedStreamer(true);
                }
            }).catch((err:any) => {
                console.log("关注mutation错误",err);
                Toast({content: '网络错误，请稍后重试'});
            })
        }
    }

    return (
        <View style={{backgroundColor: '#ffffffee',borderRadius:TOP_WIDGET_FOLLOW_CONTAINER_SIZE/2,height:TOP_WIDGET_FOLLOW_CONTAINER_SIZE,width:TOP_WIDGET_FOLLOW_CONTAINER_SIZE_WIDTH,justifyContent:'center',alignItems:'center',marginEnd:0}}>
            {
                LiveStore.followedStreamer ? (
                    <TouchableOpacity onPress={followMutate}>
                        <Image source={require('../../assets/images/ic_liked.png')} style={{height:TOP_FOLLOW_SIZE,width:TOP_FOLLOW_SIZE}} resizeMode='contain'/>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={followMutate}>
                        <Text style={{ fontSize: 12, color: 'red',fontWeight:'bold' }}>关注</Text>
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
    return <Text style={styles.HotDot} numberOfLines={1}>{`热度${LiveStore.hot}`}</Text>
});


const LiveRoomTopWidgets = (props:{navigation:any,streamer:{id:string,name:string,avatar:string,count_audience:number,is_followed},loadingEnd:boolean}) => {

    const statusHeight = useStatusHeight();

    return (
        <View style={[styles.TopWidgetContainer,{marginTop:5+statusHeight,zIndex:props.loadingEnd ? 22 : 10}]}>
            <View style={styles.TopLeftWidget}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    
                    CommonWidgetStreamerCardModal.show(props.navigation);
                    // CommonWidgetUserCardModal.show(props.navigation);
                }}>
                    <Avatar uri={props?.streamer?.avatar ?? ''} size={TOP_WIDGET_AVATAR_SIZE}/>
                </TouchableOpacity>
                <View style={styles.hot}>
                    <Text style={styles.nameTitle} numberOfLines={1}>{props?.streamer?.name+'什么鬼' ?? ''}</Text>
                </View>
                <FollowButton isFollowed={props.streamer.is_followed} streamerid={props.streamer.id}/>
            </View>

            <HotDot />

            <CommonWidgetTopOnlinePeopleList navigation={props.navigation}/>

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
    },
    TopLeftWidget: {
        height: TOP_WIDGET_HEIGHT+8,
        width: TOP_WIDGET_WIDTH+20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#00000033',
        borderRadius: (TOP_WIDGET_HEIGHT+10) / 2,
        overflow: 'hidden',
        paddingHorizontal:5,
        paddingVertical:4,
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
        fontSize: 12, 
        fontWeight: '500', 
        color: 'white', 
        marginBottom: 1, 
        width: TOP_WIDGET_CENTER_WIDTH*0.8 
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
    HotDot:{ 
        fontSize: 12, 
        color: 'white',
        position:'absolute',
        left:12,
        bottom: -25,
        backgroundColor:'#00000033',
        borderRadius:10,
        textAlign:'center',
        paddingHorizontal:5,
        paddingVertical:1
    }
});