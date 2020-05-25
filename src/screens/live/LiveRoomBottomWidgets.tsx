import React, { useEffect, useState,useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    NativeModules,
    TouchableOpacity,
    TextInput,
    Modal,
    Keyboard,
    InteractionManager
} from "react-native";
const { StatusBarManager } = NativeModules;
import { observer } from "mobx-react";
const { width: sw, height: sh } = Dimensions.get("window");
import { app } from 'store';
import { GQL as NewGQL} from '../../network';
import { ApolloClient } from "apollo-boost";
import LiveStore from './LiveStore';
import {LivePullManager} from 'hxf-tencent-live';
import * as Dankamu from './DankamuInputModal';
import KeyboradSpacer from './KeyboardSpacer';

const BOTTOM_INPUT_WIDTH = sw * 0.45;
const BOTTOM_INPUT_MINHEIGHT = 32;
const TOP_WIDGET_CLOSE_SIZE = 32;

/**
 * 离开直播间按钮
 */
const CloseButton = observer((props: any) => {

    useEffect(() => {
        return () => {
            //为防止用户直接使用物理按键返回，在组件销毁时也调用离开mutation
            client.mutate({
                mutation: NewGQL.LeaveLiveRoom,
                variables: { roomid: LiveStore.roomidForOnlinePeople }
            }).then(rs => {
                //离开成功
                console.log("[Protect]用户离开直播间mutation调用成功", rs);
            }).catch(err => {
                //TODO: 离开接口调用失败
                console.log("[Protect]用户离开直播间接口错误", err);
            });
            LiveStore.setStreamerLeft(false); //离开时设置 主播下播 为false, 隐藏下播状态图
            LivePullManager.liveStopPull();
            console.log("[Protect]停止拉流");
            LiveStore.clearDankamu();
            console.log("[Protect]清除弹幕数据");
        }
    }, [])

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
               
                //销毁直播
                LivePullManager.liveStopPull();
                console.log("停止拉流");
                //清除弹幕
                LiveStore.clearDankamu();
                console.log("清除弹幕数据");

                //离开直播间接口调用
                client.current.mutate({
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
                props.navigation.goBack();
            }}>
            <Image source={require('./res/close.png')} resizeMode={'contain'} style={{ height: TOP_WIDGET_CLOSE_SIZE, width: TOP_WIDGET_CLOSE_SIZE }} />
        </TouchableOpacity>
    )
})
const BOTTOM_BUTTON_SIZE = 28;
const LiveRoomBottomWidgets = (props:{navigation:any}) => {

    var inputref = useRef(null);
    const client:any = useRef<any>(null);
    const [v,setv] = useState('');
    const [showinput,setinput] = useState(false);

    useEffect(() => {
        client.current = app.newClient;
    }, [app.newClient]);

    useEffect(() => {
        return () => {
            InteractionManager.runAfterInteractions(() => {
                hide();
            });
        }
    },[]);
    const hide = () => {
        Keyboard.dismiss();
        setinput(!showinput);
    };
    const show = () => {
        let flag = !showinput;
        setinput(flag);
    };

    return (
        <>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingEnd:12}}>
            <TouchableOpacity activeOpacity={1.0} style={styles.inputWrapper} onPress={() => {
                show();
            }}>
                <Text style={styles.input}>{'说点什么'}</Text>
            </TouchableOpacity>
            <CloseButton navigation={props.navigation}/>
        </View>
        <Modal
        animationType="none"
        transparent={true}
        visible={showinput}
        > 
        <TouchableOpacity
        activeOpacity={1.0}
        onPress={hide}
        style={{flex:1,backgroundColor:'transparent'}}/>
        <View style={{ width: sw, minHeight: 38, borderRadius: 5, backgroundColor: 'white', overflow: 'hidden',position:'absolute',bottom:0}}>
                <View style={{ width:sw,paddingTop:7,flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextInput
                        autoFocus
                        style={{ width: sw - BOTTOM_BUTTON_SIZE - 10, minHeight: 38, paddingVertical:8 ,paddingStart:10,fontSize:15}}
                        multiline={true}
                        maxLength={50}
                        placeholder={'输入消息'}
                        onChangeText={(t) => {
                            setv(t);
                        }}
                        value={v}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            console.log('roomid: ', LiveStore.roomidForOnlinePeople,client.current);
                            if (client.current && v != '' && LiveStore.roomidForOnlinePeople) {
                                client.current.mutate({
                                    mutation: NewGQL.CommentLive,
                                    variables: { id: LiveStore.roomidForOnlinePeople, message: v }
                                }).then(rs => {
                                    console.log("弹幕发送成功,", rs);
                                    setv('');
                                    hide();
                                }).catch(err => {
                                    console.log("弹幕发送接口错误:", err);
                                })
                            }
                        }}
                        style={{marginEnd:10,height:BOTTOM_BUTTON_SIZE,width:BOTTOM_BUTTON_SIZE,borderRadius:BOTTOM_BUTTON_SIZE/2,overflow:'hidden',backgroundColor:'#FFC543',justifyContent:'center',alignItems:'center'}}
                    >
                        <Image
                            source={require("./res/sendtop.png")}
                            resizeMode="contain"
                            style={{ height: BOTTOM_BUTTON_SIZE*0.66, width: BOTTOM_BUTTON_SIZE*0.66 }}
                        />
                    </TouchableOpacity>
                </View>
                <KeyboradSpacer/>
            </View>
        </Modal>
        </>
    );
};
export default observer(LiveRoomBottomWidgets);

const styles = StyleSheet.create({
    input: {
        color: '#ffffffcc',
        marginStart: 10
    },
    inputWrapper: {
        minHeight: BOTTOM_INPUT_MINHEIGHT,
        width: BOTTOM_INPUT_WIDTH,
        borderRadius: 8,
        justifyContent: 'center',
        overflow: "hidden",
        backgroundColor: "#00000066",
        marginStart: 15,
    }
})