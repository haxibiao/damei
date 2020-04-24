import React, { Fragment, Component } from 'react';
import { StyleSheet, YellowBox, View, Image, Text, Platform } from 'react-native';
import { Toast, ErrorBoundary } from 'components';
import { app, config } from 'store';

import Orientation from 'react-native-orientation';
import codePush from 'react-native-code-push';
import * as WeChat from 'react-native-wechat';
import { ad, } from 'native';
import { ISIOS, PxFit, Theme } from 'utils';

import service from 'service';
import { checkUpdate } from 'common';

import Apollo from './Apollo';

import SplashScreen from 'react-native-splash-screen';

import { LicenseUrl, LicenseKey } from '../app.json';
import { LivePullManager } from 'hxf-tencent-live'; //导入直播
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { DataCenter, observer } from './data';
import Config from 'react-native-config';
@observer
class App extends Component {
    toast: Toast;
    constructor(props) {
        super(props);
        global.TOKEN = null;
        this.state = {
            serverMaintenance: false,
            responseText: null,
        };
    }

    componentDidMount() {
        ad.AdManager.init();
        // 信息流广告先预加载，提速第一次签到时显示的速度
        ad.AdManager.loadFeedAd();

        // 获取广告开放状态
        service.enableAdvert(data => {
            // 只针对华为检测是否开启开屏广告 （做请求后再加载开屏广告首屏会先露出）
            console.log('针对华为开屏广告: ', data);
            if (Config.AppStore === 'huawei' && !data.disable[Config.AppStore]) {
                if (isAndroid) ad.Splash.loadSplashAd();
            }
            if (Platform.OS == 'ios') {
                if (!data.disable.ios) {
                    ad.Splash.loadSplashAd();
                }
            }
            config.saveAdvertConfig(data);
            DataCenter.AppSetAdConfigs(data);
        });

        if (Config.AppStore !== 'huawei' && Platform.OS == 'android') {
            ad.Splash.loadSplashAd();
        }



        SplashScreen.hide();
        // 恢复用户身份信息
        app.recallUser();
        // 恢复缓存
        app.recallCache();
        // 检查更新
        checkUpdate('autoCheck');
        // 检查GQL接口状态
        this.checkServer();
        // 微信注册

        !ISIOS && WeChat.registerApp('wxe3f5d153afd38a62');

        // 注册全局变量Toast
        global.Toast = this.toast;
        // 禁止横屏
        Orientation.lockToPortrait();

        ad.RewardVideo.loadAd().then(data => {
            config.rewardVideoAdCache = data;
        });

        /**
         *  直播设置licenseKey,url
         */
        LivePullManager.liveSetupLicence(LicenseUrl, LicenseKey);
        //只做直播相关权限检查，获取交由权限浮层
        //this.checkPermission();
    }

    //直播权限检查函数
    checkPermission() {
        if (Platform.OS === 'android') {
            check(PERMISSIONS.ANDROID.CAMERA)
                .then(result => {
                    if (result == RESULTS.GRANTED) {
                        //有摄像头权限，下一步检查麦克风权限
                        check(PERMISSIONS.ANDROID.RECORD_AUDIO)
                            .then(result => {
                                if (result == RESULTS.GRANTED) DataCenter.AppSetSufficientPermissions(true);
                            });
                    }
                });
        } else if (Platform.OS === 'ios') {
            check(PERMISSIONS.IOS.CAMERA)
                .then(result => {
                    if (result == RESULTS.GRANTED) {
                        //有摄像头权限，下一步检查麦克风权限
                        check(PERMISSIONS.IOS.RECORD_AUDIO)
                            .then(result => {
                                if (result == RESULTS.GRANTED) DataCenter.AppSetSufficientPermissions(true);
                            });
                    }
                })
        }
    }

    checkServer = () => {
        fetch(Config.ServerRoot)
            .then(response => {
                console.log("服务器response: ", response);
                if (response.status == 503) {
                    this.setState({ serverMaintenance: response });
                }
                return response.text();
            })
            .then(responseText => {
                this.setState({
                    responseText: responseText,
                });
            })
            .catch(error => {
                console.warn('server error', error);
            });
    };

    _showMaintenance() {
        const { serverMaintenance, responseText } = this.state;
        if (serverMaintenance) {
            return (
                <View style={styles.maintenance}>
                    <Image style={styles.image} source={require('./assets/images/server_maintenance.jpg')} />
                    <View style={styles.textWrap}>
                        <Text style={styles.text}>{responseText || '服务器维护中,先休息一会儿吧!'}</Text>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <Fragment>
                <View style={styles.container} onLayout={config.listenLayoutChange}>
                    <ErrorBoundary>
                        <Apollo checkServer={this.checkServer} />
                    </ErrorBoundary>
                    {this._showMaintenance()}
                    <Toast ref={ref => (this.toast = ref)} />
                </View>
            </Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
    },
    image: {
        bottom: 0,
        height: null,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        width: null,
    },
    maintenance: {
        alignItems: 'center',
        backgroundColor: '#fff',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    text: {
        color: Theme.subTextColor,
        fontSize: PxFit(15),
        lineHeight: PxFit(18),
    },
    textWrap: {
        alignItems: 'center',
        left: 0,
        paddingHorizontal: PxFit(20),
        position: 'absolute',
        right: 0,
        top: '65%',
    },
});

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(App);
