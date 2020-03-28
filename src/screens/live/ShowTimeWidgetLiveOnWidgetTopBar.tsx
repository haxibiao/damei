import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView, NativeModules, TouchableOpacity, StatusBar, Platform, TextInput } from 'react-native';
const { StatusBarManager } = NativeModules;
import { observer } from 'mobx-react';
import LiveStore from './LiveStore';
import { Avatar } from 'hxf-react-native-uilib';
import { LivePushManager } from 'hxf-tencent-live';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as OnlinePeopleModal from './ShowTimeWidgetOnlinePeopleModal';
import { Overlay } from 'teaset';
import { app } from '../../store'; //TODO: replace this import later
const { width: sw, height: sh } = Dimensions.get("window");
import { DataCenter } from '../../data';
import { GQL } from '../../network';

const TOP_WIDGET_HEIGHT = 40;
const TOP_WIDGET_WIDTH = sw * 0.33;
const TOP_WIDGET_AVATAR_SIZE = 36; // 2
const TOP_WIDGET_FOLLOW_HEIGHT = TOP_WIDGET_HEIGHT * 0.5;
const TOP_WIDGET_FOLLOW_WIDTH = TOP_WIDGET_FOLLOW_HEIGHT * 2.2;
const TOP_WIDGET_CENTER_WIDTH = TOP_WIDGET_WIDTH - TOP_WIDGET_AVATAR_SIZE - 12;
const TOP_WIDGET_CLOSE_SIZE = 30;
const TOP_WIDGET_ONLINE_WRAPPER_HEIGHT = 27;

const ModalContent = observer((props: any) => {

    const closeHandler = () => {

        hideQuitModal();
        /**
         *  停止直播，调用下播接口
         */
        LivePushManager.liveStopLivePush();
        if (DataCenter.App.newclient) {
            DataCenter.App.newclient.mutate({
                mutation: GQL.CloseLiveRoom,
                variables: { roomid: LiveStore.roomidForOnlinePeople }
            }).then(rs => {
                //TODO: 下播成功
                console.log("下播成功,",rs);
            }).catch(err => {
                //TODO: 下播接口错误
                console.log("下播失败,",err);
            })
        }
        //返回上一级页面
        if (props.navigation) {
            props.navigation.goBack();
        }
    }

    return (
        <View style={styles.quitModal}>
            <Text style={styles.quitModalTitle}>是否结束直播 ? </Text>
            <View style={styles.quitModalBtnWrapper}>
                <TouchableOpacity onPress={() => {
                    hideQuitModal(); //关闭退出浮层
                }} activeOpacity={0.9} style={styles.cancelBtn}>
                    <Text style={styles.cancelTitle}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeHandler} activeOpacity={0.9} style={styles.confirmBtn}>
                    <Text style={styles.confirmTitle}>确定</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
});


let overlaykey: any = null;
const showQuitModal = (navigation: any) => {
    const view = (
        <Overlay.View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ModalContent navigation={navigation} />
        </Overlay.View>
    )
    overlaykey = Overlay.show(view);
}

const hideQuitModal = () => {
    Overlay.hide(overlaykey);
}

const HotValue = observer(() => {
    return <Text style={{ fontSize: 10, color: 'white' }}>{`当前热度${LiveStore.hot}`}</Text>
})

const OnlinePeople = observer((props: any) => {
    return (
        <TouchableOpacity onPress={() => { OnlinePeopleModal.showOnlinePeopleModal() }} style={styles.AudienceCountWrapper}>
            <Text style={{
                fontSize: 12,
                color: 'white'
            }}>{`当前在看${LiveStore.count_audience}人`}</Text>
        </TouchableOpacity>
    )
})

const ShowTimeWidgetLiveOnWidgetTopBar = (props: { navigation: any }) => {

    useEffect(() => {
        return () => {
            LivePushManager.liveStopLivePush();
            if (DataCenter.App.newclient) {
                DataCenter.App.newclient.mutate({
                    mutation: GQL.CloseLiveRoom,
                    variables: { roomid: LiveStore.roomidForOnlinePeople }
                }).then(rs => {
                    //TODO: 下播成功
                    console.log("下播成功,",rs);
                }).catch(err => {
                    //TODO: 下播接口错误
                    console.log("下播失败,",err);
                })
            }
        }
    },[])

    return (
        <View style={styles.TopWidgetContainer}>
            <View style={styles.TopLeftWidget}>
                <Avatar uri={app.me?.avatar ?? ''} size={TOP_WIDGET_AVATAR_SIZE} />
                <View style={styles.hot}>
                    <Text style={styles.nameTitle} numberOfLines={1}>{app.me?.name ?? ''}</Text>
                    <HotValue />
                </View>
            </View>

            <View style={styles.row}>
                <OnlinePeople />
                <TouchableOpacity activeOpacity={0.9} onPress={() => { showQuitModal(props.navigation) }}>
                    <Image source={require('./res/close.png')} resizeMode={'contain'} style={{ height: TOP_WIDGET_CLOSE_SIZE, width: TOP_WIDGET_CLOSE_SIZE }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default observer(ShowTimeWidgetLiveOnWidgetTopBar);

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
    FollowWrapper: {
        height: TOP_WIDGET_FOLLOW_HEIGHT,
        width: TOP_WIDGET_FOLLOW_WIDTH,
        borderRadius: TOP_WIDGET_FOLLOW_HEIGHT / 2,
        overflow: 'hidden',
        backgroundColor: '#FE5F5F',
        justifyContent: 'center',
        alignItems: 'center'
    },
    AudienceCountWrapper: {
        paddingHorizontal: 5,
        height: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT,
        backgroundColor: '#00000033',
        borderRadius: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 3
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    nameTitle:{ 
        fontSize: 14, 
        fontWeight: '500', 
        color: 'white', 
        marginBottom: 1, 
        width: TOP_WIDGET_CENTER_WIDTH * 0.78 
    },
    hot:{
        width: TOP_WIDGET_CENTER_WIDTH,
        height: TOP_WIDGET_HEIGHT,
        justifyContent: 'center',
        paddingStart: 8
    },
    quitModal:{ 
        height: sw * 0.3, 
        width: sw * 0.56, 
        backgroundColor: 'white', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderRadius: 8, 
        overflow: 'hidden' 
    },
    quitModalTitle:{ 
        fontSize: 18, 
        color: '#333', 
        height: sw * 0.2, 
        textAlign: 'center', 
        textAlignVertical: 'center' 
    },
    quitModalBtnWrapper:{ 
        width: '100%', 
        flexDirection: 'row', 
        flex: 1 
    },
    cancelBtn:{ 
        width: '50%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 10, 
        borderRightWidth: 1, 
        borderTopWidth: 1, 
        borderColor: '#f1f1f1' 
    },
    confirmBtn:{ 
        width: '50%', 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 10, 
        borderTopWidth: 1, 
        borderTopColor: '#f1f1f1' 
    },
    cancelTitle:{ 
        fontSize: 14, 
        color: '#999' 
    },
    confirmTitle:{ 
        fontSize: 14, 
        color: 'blue' 
    }
});