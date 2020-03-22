import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {getBrand,isEmulator,getSystemVersion,getUniqueId,getIpAddress} from 'react-native-device-info';
import ApolloClient,{InMemoryCache} from 'apollo-boost';
import { ServerRoot } from '../../../app.json';
import { AppConfig } from '../../tools';

const deviceHeaders = {
    os: Platform.OS,
    build: AppConfig.Build,
    referrer: AppConfig.AppStore,
    version: AppConfig.Version,
    appid: AppConfig.PackageName,
    package: AppConfig.PackageName,
    brand: getBrand(),
    systemVersion: getSystemVersion(),
    uniqueId: getUniqueId(),
    deviceId: getUniqueId(), //兼容
    ip: ''
};

export default function useClientMaker(token:string,isnew:boolean,checkServer:any){
    const endpoint_suffix = isnew ? '/gql' : '/graphql';

    //创建Apollo的缓存对象
    const cache = new InMemoryCache();
    
    //http请求定制
    const request = async (operation:any) => {
        await getIpAddress().then(result => {
            deviceHeaders.ip = result;
        });
        operation.setContext({
            headers:{
                token,
                Authorization: token ? `Bearer ${token}` : '',
                ...deviceHeaders
            }
        })
    }
    //错误处理

    const createClient = () => new ApolloClient({
        cache,
        uri: ServerRoot + endpoint_suffix,
        request,
        onError:({graphQLErrors, networkError, operation, forward}) => {
            if (graphQLErrors) {
                graphQLErrors.map(error => {
                    //
                });
            }
            if (networkError) {
                console.log("Apollo Client happened error on creating...: \n\t ",networkError);
                checkServer();
            }
        }
    });

    const [client,setclient] = useState( createClient() )

    useEffect(() => {
        if(!client){
            let c = createClient();
            setclient(c);
        }
    },[token])

    console.log("新的client生成器即将返回client,当前endpoint为",endpoint_suffix)
    return client;
}