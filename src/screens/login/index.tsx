import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Page } from '../../widgets';
import { sh, sw, useLogin } from '../../tools';
import {observer,DataCenter,Storage} from '../../data';
import { Avatar } from 'hxf-react-native-uilib';

//兼容旧页面，更新旧版store
import { app } from '../../store';

const MainColor = '#F7E275';
const GrayText = '#999';

const LoginButtonWidth = sw * 0.72;        //登录按钮、输入框 宽度
const LoginButtonHeight = 37;               //登录按钮、输入框 高度

/**
 * ----------------------------------------------------------------------
 * ----------------------------------------------------------------------
 *
 * @widget  登录输入框
 *
 * ----------------------------------------------------------------------
* ----------------------------------------------------------------------
 */

const LoginInputForm = React.memo(observer((props:{navigation:any}) => {

    const [phone, setphone] = useState('');

    const PhoneChangeHandler = (v: string) => {
        setphone(v);
    };

    /**
     * 静默登录 或 手机号登录
     */
    const LoginHandler = () => {
        if(phone == ''){
            //用户未输入手机号，使用静默登录
            useLogin(DataCenter.App.client, undefined ,
            (rs:any) => {
                console.log('静默登录结果',rs.data.autoSignIn);
                let info:DMUser = rs.data.autoSignIn;
                DataCenter.UserSaveUserInfo(info); //存储用户信息,更新 userStore.me
                DataCenter.UserSetLoggined(true); //存储登录状态,更新 userStore.loggined
                //兼容旧页面，将内容也存储到旧的app store里面
                app.signIn(info);
                Storage.setItem("me",info);
                if(props.navigation){
                    props.navigation.navigate('我的')
                }
            },
            (err:any) => {
                console.log('静默登录失败',err);
            })
        }else{
            //TODO: 使用手机号登录
        }
        //最终将手动退出登录标识重置，使得静默登录挂载点正常工作
        Storage.setItem('manualLogout',false);
    };

    return (
        <>
            <View style={{ width: LoginButtonWidth, height: LoginButtonHeight, borderBottomWidth: 1, borderBottomColor: MainColor, justifyContent: 'center' }}>
                <TextInput
                    style={{ height: '100%', width: '100%', paddingStart: 12,paddingVertical:0, fontSize: 15 }}
                    value={phone}
                    placeholder="输入手机号"
                    onChangeText={PhoneChangeHandler}
                    keyboardType={'number-pad'}
                    maxLength={11}
                    clearButtonMode='always'
                />
            </View>
            <TouchableOpacity onPress={LoginHandler} style={{ width: LoginButtonWidth, height: LoginButtonHeight, borderRadius: LoginButtonHeight / 2, backgroundColor: MainColor, justifyContent: 'center', alignItems: 'center', marginTop: sh * 0.06 }}>
                <Text style={{ fontSize: 17, color: 'white' }}>登录/一键登录</Text>
            </TouchableOpacity>
        </>
    )
}));

/**
 * ----------------------------------------------------------------------
 * ----------------------------------------------------------------------
 *
 * @widget  隐私政策及用户协议
 *
 * ----------------------------------------------------------------------
* ----------------------------------------------------------------------
 */

const AgreePrivacy = (props: any) => {

    const [agreed, setagreed] = useState(true);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: sh * 0.02 }}>
            <TouchableOpacity activeOpacity={1} style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                setagreed(!agreed)
            }}>
                <View style={{ height: 17, width: 17, borderWidth: 2, borderRadius: 12, borderColor: MainColor, justifyContent: 'center', alignItems: 'center' }}>
                    {
                        agreed && <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: MainColor }} />
                    }
                </View>
            </TouchableOpacity>
            <Text style={{ color: GrayText, fontSize: 15, marginEnd: 3 }}>同意</Text>
            <TouchableOpacity>
                <Text style={{ color: MainColor, fontSize: 15 }}>用户协议</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 15, color: GrayText, marginHorizontal: 4 }}>和</Text>
            <TouchableOpacity>
                <Text style={{ color: MainColor, fontSize: 15 }}>隐私政策</Text>
            </TouchableOpacity>
        </View>
    )
};


/**
 * ----------------------------------------------------------------------
 * ----------------------------------------------------------------------
 *
 * @Page 登录注册页
 *
 * ----------------------------------------------------------------------
* ----------------------------------------------------------------------
 */
const index = (props: any) => {

    return (
        <Page.PageCleared containerStyle={{ alignItems: 'center' }} safe enableBack >
            <Avatar file={require('../../../icon.png')} size={sw * 0.3} frameStyle={{ marginTop: sh * 0.12, marginBottom: sh * 0.06 }} />

            <LoginInputForm navigation={props.navigation}/>

            <AgreePrivacy />
        </Page.PageCleared>
    )
}

export default index;
