import React,{useEffect,useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import { ApolloClient } from 'apollo-boost';
import { GQL } from '../network';

const useLogin = async (client:ApolloClient<unknown>,account?:string,callback?:any,errhandler?:any) => {

    const acc = account ?? null;
    
    //如果client不为空则调用登录，否则不调用
    if(client){
        let uuid = await DeviceInfo.getUniqueId(); //获取手机UUID
        if(acc == null){//没有传账号，直接走静默登录流程
            if(uuid){
                //拿到UUID, 则走UUID静默登录接口
                client.mutate({
                    mutation: GQL.AutoSignIn,
                    variables: {
                        uuid: uuid
                    },
                    fetchPolicy: 'no-cache'
                }).then( rs => {
                    if(callback) callback(rs);
                }).catch( err => {
                    if(errhandler) errhandler(err)
                })
            }else{
                //没拿到UUID
            }
        }else{//调用该hook时传来了账号，则走账号登录流程
        }
    }
}

export default useLogin;