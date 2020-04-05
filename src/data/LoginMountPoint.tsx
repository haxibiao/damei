import React,{ useEffect,useState } from 'react';
import { View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ApolloClient } from 'apollo-boost';
import { GQL } from '../network';
import {Storage} from './Storage';
import DataCenter from './DataCenter';
import { app } from '../store'; //TODO: 后续移除旧版 store
import { observer } from 'mobx-react';

const LoginMountPoint = (props:{navigation:any}) => {

    const loginHandler = async () => {

        //获取本地缓存用户信息，判断是否已登录
        let userinfo = await Storage.getItem("me");
        let manuallogout = await Storage.getItem("manualLogout");

        if(!manuallogout){ //用户并没有手动退出登录, 在登录页的一键登录按钮事件中将 该值复位。
            if(userinfo.id != undefined){ //存在用户信息
                //先恢复store，再调用接口，更新数据
                DataCenter.UserSaveUserInfo(userinfo);
                DataCenter.UserSetLoggined(true);

                let uuid = await DeviceInfo.getUniqueId(); //获取手机UUID
                if(uuid){
                    //拿到UUID, 则走UUID静默登录接口
                    DataCenter.App.client.mutate({
                        mutation: GQL.AutoSignIn,
                        variables: {
                            uuid: uuid
                        },
                        fetchPolicy: 'no-cache'
                    }).then( rs => {
                        let info:DMUser = rs.data.autoSignIn;
                        //更新用户信息
                        DataCenter.UserSaveUserInfo(info);
                        console.log("用户登录信息更新完成:",info);

                        /**
                         *  仅在此处、登录接口调用成功后，再对旧版store等进行数据更新
                         */
                        app.signIn(info); 
                        //Storage.setItem('me',info);  //因为旧版app.signIn函数中已经对用户信息进行了持久化存储更新，这里暂时注释

                    }).catch( err => {
                        GraphqlErrHandler(err);
                    })
                }else{
                    //没拿到UUID, 出现异常，将用户数据清空，退出登录
                    ExceptionHandler();
                }
            }
        }
    }

    const ExceptionHandler = () => {
        DataCenter.UserSaveUserInfo({});
        DataCenter.UserSetLoggined(false);
    }
    const GraphqlErrHandler = (err:any) => {
        ExceptionHandler();
        //处理完用户信息后跳转到登录页
        if(props.navigation){
            props.navigation.navigate('login');
        }
    }

    useEffect(() => {
        console.log("登录  navigation: ",props.navigation,"  client: ",DataCenter.App.client,"  id: ",DataCenter.User.me.id)
        if(props.navigation && DataCenter.App.client && !DataCenter.User.me.id) loginHandler();
    },[props.navigation])

    return <View/>
};

export default observer(LoginMountPoint);