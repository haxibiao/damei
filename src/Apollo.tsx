import React, { Component, useContext, useCallback, useEffect } from "react";
import { useClientMaker, ApolloHooksProvider, ApolloProvider } from "./network";
import { Platform, StatusBar } from "react-native";

import { observer, app } from "store";
import { Config, Tools } from "utils";

import JPushModule from "jpush-react-native";
import Echo from "laravel-echo";
import Socketio from "socket.io-client";

import AppRouter from "./routers"; //旧版导航路由入口
import Nav from './routers/new_index'; //新版导航路由入口

import { useCaptureVideo } from "@src/common";

import { DataCenter } from "./data";
import { UserAgreementOverlay } from '@src/components';

/**
 *  引入题目数据挂载点
 */
import QuestionDataMountPoint from './screens/doexercise/QuestionDataMountPoint';

export default observer(props => {
    const { checkServer } = props;

    // const store = useContext(StoreContext);
    const client = useClientMaker(app.me.token, false, checkServer); // 构建apollo client;
    const newclient = useClientMaker(app.me.token, true, checkServer); // 新的后台 endpoint
    app.client = client; //旧版全局状态

    DataCenter.AppSetClient(client);
    DataCenter.AppSetNewClient(newclient);

    // 安卓平台下设置状态栏为透明
    function setAndroidStatusBarClear() {
        if (Platform.OS == "android") {
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor("transparent");
        }
    }

    const onFailed = useCallback(error => {
        Toast.show({ content: error.message });
    }, []);

    const onSuccess = useCallback(() => {
        Toast.show({ content: "粘贴板视频上传成功" });
    }, []);

    useCaptureVideo({ client, onSuccess, onFailed });

    useEffect(() => {
        app.systemConfig();
        setAndroidStatusBarClear();
    }, []);

    const mountWebSocket = (user: { token: string | undefined; id: string }) => {
        if (user.token != undefined) {
            // 构造laravel echo及Socket Client
            const echo = new Echo({
                broadcaster: "socket.io",
                host: "ws://socket.xiaodamei.com:6002",
                client: Socketio,
                auth: {
                    headers: {
                        Authorization: "Bearer " + user.token
                    }
                }
            });

            app.setEcho(echo);

            // 监听公共频道
            echo.channel("notice").listen("NewNotice", sendLocalNotification);

            // 监听用户私人频道
            echo
                .private("App.User." + user.id)
                .listen("WithdrawalDone", sendLocalNotification)
                .listen("NewLike", sendLocalNotification)
                .listen("NewFollow", sendLocalNotification)
                .listen("NewComment", sendLocalNotification)
                .listen("NewAudit", sendLocalNotification);
            // 系统通知栏
        }
    };

    // 本地推送通知
    const sendLocalNotification = (data: {
        id: any;
        content: any;
        title: any;
    }) => {
        console.log('notice', data)
        const currentDate = new Date();
        JPushModule.sendLocalNotification({
            buildId: 1,
            id: data.id,
            content: data.content,
            extra: {},
            fireTime: currentDate.getTime() + 3000,
            title: data.title
        });
    };


    useEffect(() => {
        mountWebSocket(app.me);
    }, [app.me]);

    useEffect(() => {
        // 判断是否阅读用户协议
        console.log('是否阅读：', app.createUserAgreement);
        if (!app.createUserAgreement) {
            UserAgreementOverlay(true);
        }
    }, [app.createUserAgreement]);

    return (
        <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
                {/* <AppRouter ref={Tools.setRootNavigation} /> */}
                <Nav />
                <QuestionDataMountPoint />
            </ApolloHooksProvider>
        </ApolloProvider>
    );
});
