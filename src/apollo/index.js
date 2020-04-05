import React, { useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import ApolloClient,{ InMemoryCache } from 'apollo-boost';
import {getBrand,isEmulator,getDeviceCountry,getSystemVersion,getUniqueId,getIpAddress} from 'react-native-device-info';
import { Config } from 'utils';

const deviceHeaders = {};
const emu = isEmulator();

deviceHeaders.os = Platform.OS; // 操作系统
deviceHeaders.build = Config.Build; // 手动修改的build版本号
deviceHeaders.referrer = Config.AppStore; // 应用商店来源
deviceHeaders.version = Config.Version; // 手动修改的App版本号
deviceHeaders.appid = Config.PackageName; // 手动修改的包名
deviceHeaders.package = Config.PackageName; // 手动修改的包名

if (!emu) {
    deviceHeaders.brand = getBrand(); // 设备品牌
    deviceHeaders.deviceCountry = getDeviceCountry(); // 国家地区
    deviceHeaders.systemVersion = getSystemVersion(); // 系统版本
    deviceHeaders.uniqueId = getUniqueId(); // uniqueId
    deviceHeaders.deviceId = getUniqueId(); // uniqueId  兼容
    getIPAddress()
        .then(response => response.toString())
        .then(data => {
            deviceHeaders.ip = data;
        }); // ip地址
}

export function makeClient(user = {}, checkServer,isnew) {
    const { token } = user;
    let suffix = isnew ? '/gql' : '/graphql';
    //console.log("构建client的后缀为 : ",Config.ServerRoot + suffix + '?token=' + token);
    return new ApolloClient({
        uri: Config.ServerRoot + suffix + '?token=' + token,
        request: async operation => {
            operation.setContext({
                headers: {
                    token,
                    Authorization: token ? `Bearer ${token}` : '',
                    ...deviceHeaders,
                },
            });
        },
        // Apollo Boost allows you to specify a custom error link for your client
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors) {
                graphQLErrors.map(error => {
                    console.log(`gql error: ${error}`);
                });
            }
            if (networkError) {
                checkServer();
            }
        },
        cache: new InMemoryCache(),
    });
}

export { GQL } from 'graphql';
export { Query, Mutation, graphql, withApollo, ApolloProvider,compose } from 'react-apollo';
export * from '@apollo/react-hooks';
