import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Dimensions,
    Keyboard,
    Image,
    NativeModules,
    Platform,
    TextInput,
    TouchableOpacity
} from "react-native";
const { StatusBarManager } = NativeModules;
import LiveStore from "./LiveStore";
import { observer } from "mobx-react";
const { width: sw, height: sh } = Dimensions.get("window");
import CommentInput from "../comment/CommentInput";
import {app} from '../../store';
import {GQL} from '../../network';
import {DataCenter} from '../../data';
import { ApolloClient } from "apollo-boost";

const TOP_WIDGET_HEIGHT = 40;
const TOP_WIDGET_WIDTH = sw * 0.41;
const TOP_WIDGET_AVATAR_SIZE = 36; // 2
const TOP_WIDGET_FOLLOW_HEIGHT = TOP_WIDGET_HEIGHT * 0.5;
const TOP_WIDGET_FOLLOW_WIDTH = TOP_WIDGET_FOLLOW_HEIGHT * 2.2;
const TOP_WIDGET_CENTER_WIDTH =
    TOP_WIDGET_WIDTH - TOP_WIDGET_AVATAR_SIZE - TOP_WIDGET_FOLLOW_WIDTH - 12;
const TOP_WIDGET_CLOSE_SIZE = 30;
const TOP_WIDGET_ONLINE_WRAPPER_HEIGHT = 27;

const BOTTOM_INPUT_WIDTH = sw * 0.78;
const BOTTOM_INPUT_MINHEIGHT = 35;
const BOTTOM_BUTTON_SIZE = 36;

var client:ApolloClient<unknown>;

const LiveRoomBottomWidgets = () => {
    //const [softInputPadding, setsoftinputpadding] = useState(0);
    const [text,settext] = useState('');

    const textHandler = (v:string) => {
        if(v != ''){
            settext(v);
        }
    }
    useEffect(() => {
        client = DataCenter.App.newclient;
    },[DataCenter.App.newclient])

    return (
        <KeyboardAvoidingView enabled behavior="padding">
            <View style={styles.body}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        multiline={true}
                        placeholder={"说点什么 ..."}
                        placeholderTextColor={"#ffffffdd"}
                        style={styles.input}
                        value={text}
                        onChangeText={textHandler}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        console.log('roomid: ',LiveStore.roomidForOnlinePeople);
                        if(client && text != '' && LiveStore.roomidForOnlinePeople){
                            client.mutate({
                                mutation: GQL.CommentLive,
                                variables:{id:LiveStore.roomidForOnlinePeople,message: text}
                            }).then(rs => {
                                console.log("弹幕发送成功,",rs);
                                // let temp = LiveStore.dankamu;
                                // temp.push({ name: app.me.name , message: text });
                                // LiveStore.setDankamu([...temp]);
                                settext('');
                            }).catch(err => {
                                console.log("弹幕发送接口错误:",err);
                            })
                        }
                    }}
                >
                    <Image
                        source={require("./res/send.png")}
                        resizeMode="contain"
                        style={{ height: BOTTOM_BUTTON_SIZE, width: BOTTOM_BUTTON_SIZE }}
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};
export default observer(LiveRoomBottomWidgets);

const styles = StyleSheet.create({
    input:{
        minHeight: BOTTOM_INPUT_MINHEIGHT,
        width: BOTTOM_INPUT_WIDTH,
        paddingTop: 0,
        paddingBottom: 0,
        paddingHorizontal: 10,
        color:'white'
    },
    inputWrapper:{
        minHeight: BOTTOM_INPUT_MINHEIGHT,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#00000066"
    },
    body:{
        flexDirection: "row",
        width: sw,
        alignItems: "center",
        justifyContent: "space-evenly"
    }
})