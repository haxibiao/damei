'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, PopOverlay, Button, CustomTextInput } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, ISIOS, Config } from 'utils';

import { Query, withApollo, compose, graphql, GQL } from 'apollo';
import { app } from 'store';
// import { WeChat } from 'native';
import * as WeChat from 'react-native-wechat';

import DeviceInfo from 'react-native-device-info';

import { BoxShadow } from 'react-native-shadow';
import { Overlay } from 'teaset';

import { Util } from 'native';
import { getUniqueId } from 'react-native-device-info';

import { Storage } from '../../data';

const shadowOpt = {
    width: SCREEN_WIDTH - Theme.itemSpace * 3,
    color: '#E8E8E8',
    border: PxFit(3),
    radius: PxFit(10),
    opacity: 0.5,
    x: 0,
    y: 1,
    style: {
        marginTop: 0,
    },
};
var showThumbType = ['accpunt', 'password'];
class index extends Component {
    constructor(props) {
        super(props);
        this.timeRemaining = 60;
        this.phoneNumber = null;
        this.deviceId = getUniqueId();
        this.state = {
            signIn: true,
            submitting: false,
            account: null,
            password: null,
            showThumb: false,
            secure: true,
            submitTips: '登录中...',
            readed: true,
        };
    }

    async componentDidMount() {
        let phone = await Util.getPhoneNumber();

        if (phone) {
            this.phoneNumber = phone.substr(phone.length - 11);
            this.setState({
                account: this.phoneNumber,
            });
        }
    }

    onSubmit = () => {
        if (this.state.readed) {
            if (this.state.signIn) {
                this.signIn();
            } else {
                this.signUp();
            }
        } else {
            Toast.show({
                content: '请先勾选同意”用户协议“和”隐私政策“',
            });
        }
    };

    autoSign = async () => {
        let result = {};
        this.setState({
            submitting: true,
        });
        console.log('this.deviceId', this.deviceId);
        try {
            result = await this.props.autoSignInMutation({
                variables: {
                    account: null,
                    uuid: this.deviceId,
                },
            });
        } catch (ex) {
            result.errors = ex;
        }
        console.log('result', result);
        if (result && result.errors) {
            let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str, layout: 'top' });
        } else {
            const user = result.data.autoSignIn;
            this._saveUserData(user);

            Storage.setItem('manualLogout', false);
        }
        this.setState({
            submitting: false,
        });
    };

    signIn = async () => {
        let { account } = this.state;
        const { navigation } = this.props;

        if (account == this.phoneNumber) {
            let result = {};
            this.setState({
                submitting: true,
            });
            console.log('this.deviceId', this.deviceId);
            try {
                result = await this.props.autoSignInMutation({
                    variables: {
                        account: account,
                        uuid: this.deviceId,
                    },
                });
            } catch (ex) {
                result.errors = ex;
            }
            console.log('result', result);
            if (result && result.errors) {
                let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
                Toast.show({ content: str, layout: 'top' });
            } else {
                const user = result.data.autoSignIn;
                this._saveUserData(user);
            }
            this.setState({
                submitting: false,
            });
        } else {
            navigation.navigate('PasswordLogin', { hasPassword: true, account: account });
        }
    };

    //处理注册来源
    signUp = async () => {
        let { signIn, account, password } = this.state;
        let { client, navigation } = this.props;
        this.setState({
            submitting: true,
        });
        let result = {};

        try {
            result = await client.query({
                query: GQL.IsInviteUser,
                variables: {
                    account,
                },
            });
        } catch (ex) {
            result.errors = ex;
        }
        if (result && result.errors) {
            let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str, layout: 'top' });
            this.setState({
                submitting: false,
            });
        } else {
            if (result && result.data.isInviteUser) {
                //对邀请用户发送验证码验证
                this.sendVerificationCode(account);
            } else {
                //自然流量无需验证手机，设置密码注册
                navigation.navigate('RegisterSetPassword', { phone: account });
                this.setState({
                    submitting: false,
                });
            }
        }
    };

    //发送验证码
    sendVerificationCode = async () => {
        const { navigation } = this.props;

        let result = {};
        try {
            result = await this.props.SendVerificationCodeMutation({
                variables: {
                    account: this.state.account,
                    action: 'USER_LOGIN',
                },
                errorPolicy: 'all',
            });
        } catch (ex) {
            result.errors = ex;
        }
        if (result && result.errors) {
            let str = result.errors[0].message;
            Toast.show({ content: str });
        } else {
            navigation.navigate('VerificationPhone', {
                code: result.data.sendVerificationCode.code,
                time: result.data.sendVerificationCode.surplusSecond,
                phone: this.state.account,
                data: null,
            });
        }
        this.setState({
            submitting: false,
        });
    };

    //保存用户信息
    _saveUserData = (user) => {
        app.signIn(user);
        this.setState({
            submitting: false,
        });
        this.props.navigation.goBack();
        Toast.show({ content: '登录成功' });
    };

    changeAccount = (value) => {
        this.setState({ account: value });
    };

    changePassword = (value) => {
        this.setState({ password: value });
    };

    toggleMutation = () => {
        this.setState((prevState) => ({
            signIn: !prevState.signIn,
            // account: null,
            password: null,
        }));
    };

    validator(number) {
        if (String(number).length === 11) {
            return true;
        }
        return false;
    }

    // 微信登录
    wechatLogin = () => {
        const scope = 'snsapi_userinfo';
        const state = 'skit_wx_login';
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.sendAuthRequest(scope, state)
                        .then((responseCode) => {
                            this.setState({
                                submitting: false,
                            });
                            this.getWechatInfo(
                                responseCode.code,
                                (result) => {
                                    if (result.data && result.data.unionid) {
                                        // 新用户绑定手机号
                                        this.props.navigation.navigate('PhoneBind', {
                                            data: result.data,
                                        });
                                    } else {
                                        // 老用户直接登录
                                        this.getUserData(result.data.user);
                                    }
                                },
                                () => {
                                    Toast.show({
                                        content: '微信身份信息获取失败，请检查微信是否登录',
                                    });
                                    this.setState({
                                        submitting: false,
                                    });
                                }
                            );
                        })
                        .catch((err) => {
                            Toast.show({ content: '登录授权发生错误' });
                        });
                } else {
                    Toast.show({ content: '未安装微信或当前微信版本较低' });
                }
            })
            .catch((err) => {
                console.log('err', err);
                Toast.show({ content: '微信请求失败，请使用其它方式登录' });
            });
    };

    //获取微信身份信息
    getWechatInfo = (code) => {
        var data = new FormData();
        data.append('code', code);

        console.log('data', data);
        fetch(Config.ServerRoot + '/api/v1/wechat/app/auth', {
            method: 'POST',
            body: data,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('微信登录返回结果: ', result);

                this.getUserData(result.data.user);
            })
            .catch((error) => {
                console.log('error', error);
                Toast.show({ content: '授权失败' });
                this.setState({
                    submitting: false,
                });
            });
    };

    autoSign = async () => {
        let result = {};
        this.setState({
            submitting: true,
        });
        let deviceId = await DeviceInfo.getUniqueId();
        console.log('uuid: ', deviceId);

        this.props.client
            .mutate({
                mutation: GQL.autoSignInMutation,
                variables: {
                    account: null,
                    uuid: deviceId,
                },
            })
            .then((result) => {
                console.log('静默登录接口返回数据： ', result);
                const user = result.data.autoSignIn;
                this._saveUserData(user);

                Storage.setItem('manualLogout', false);
                this.setState({
                    submitting: false,
                });
            })
            .catch((errors) => {
                console.log('静默登录errors： ', errors);
                let str = errors.toString().replace(/Error: GraphQL error: /, '');
                Toast.show({ content: str, layout: 'top' });
                this.setState({
                    submitting: false,
                });
            });
    };

    //微信已存在，直接登录
    getUserData = (user) => {
        this.setState({
            submitting: true,
        });
        const { client } = this.props;
        if (user?.id != undefined) {
            client
                .query({
                    query: GQL.UserQuery,
                    variables: {
                        id: user?.id,
                    },
                })
                .then((result) => {
                    console.log('登录query返回数据: ', result);
                    let token = { token: user.api_token };
                    let userLoginInfo = { ...result.data.user, token: user.api_token };
                    this._saveUserData(userLoginInfo);
                    this.setState({
                        submitting: false,
                    });
                })
                .catch((error) => {
                    let str = rejected.toString().replace(/Error: GraphQL error: /, '');
                    Toast.show({ content: str });
                    this.setState({
                        submitting: false,
                    });
                });
        } else {
            this.autoSign();
        }
    };

    render() {
        let { me } = app;
        let { navigation } = this.props;
        let { signIn, submitting, account, password, showThumb, secure, submitTips, readed } = this.state;
        // let disabled = signIn ? !(account && password) : !account;
        let disabled = !account;
        return (
            <PageContainer
                submitting={submitting}
                submitTips={submitTips}
                contentViewStyle={{ marginTop: 0 }}
                navBarStyle={{ zIndex: 1, backgroundColor: 'transparent' }}
                leftView={
                    <TouchFeedback onPress={() => this.props.navigation.pop()}>
                        <Iconfont name='close' size={PxFit(24)} color={Theme.primaryColor} />
                    </TouchFeedback>
                }
                autoKeyboardInsets={false}
            >
                <View style={styles.container} bounces={false}>
                    <View style={styles.formContainer}>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('../../../icon.png')}
                                style={{ width: 90, height: 90, marginTop: SCREEN_HEIGHT / 12 }}
                            />
                            <View style={{ alignItems: 'center', marginVertical: 40 }}>
                                <View
                                    style={[
                                        styles.inputWrap,
                                        showThumb == showThumbType[0] && {
                                            borderBottomColor: Theme.primaryColor,
                                        },
                                    ]}
                                >
                                    <Iconfont name={'phone'} color={'#D0D0D0'} size={17} style={{ paddingRight: 10 }} />
                                    <CustomTextInput
                                        placeholderTextColor={Theme.subTextColor}
                                        autoCorrect={false}
                                        placeholder='请输入手机号'
                                        autoFocus={true}
                                        style={styles.inputStyle}
                                        value={account}
                                        onChangeText={this.changeAccount}
                                        onFocus={() =>
                                            this.setState({
                                                showThumb: showThumbType[0],
                                            })
                                        }
                                    />

                                    {showThumb == showThumbType[0] && (
                                        <TouchFeedback onPress={() => this.changeAccount('')}>
                                            <Iconfont name={'close'} size={PxFit(18)} color={Theme.tintTextColor} />
                                        </TouchFeedback>
                                    )}
                                </View>
                            </View>
                            <Button style={styles.button} disabled={disabled} onPress={this.onSubmit}>
                                <Text style={styles.buttonText}>{signIn ? '登 录' : '注 册'}</Text>
                            </Button>

                            {/* <View style={styles.bottomInfo}> */}
                            {/* <TouchFeedback onPress={this.toggleMutation}>
                                    <Text style={styles.bottomLinkText}>{signIn ? '注册' : '登录'}</Text>
                                </TouchFeedback> */}
                            {/* </View> */}
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View
                                style={{
                                    marginBottom: 55,
                                    width: SCREEN_WIDTH,
                                }}
                            >
                                <Row style={styles.rowCenter}>
                                    <View style={styles.line} />
                                    <Text style={{ marginHorizontal: 20 }}>其他登录方式</Text>
                                    <View style={styles.line} />
                                </Row>
                                <Row
                                    style={{
                                        alignItems: 'stretch',
                                    }}
                                >
                                    {!ISIOS && (
                                        <TouchFeedback style={styles.otherLogin} onPress={this.wechatLogin}>
                                            <Image
                                                source={require('../../assets/images/wechat.png')}
                                                style={{ width: 26, height: 26, marginBottom: 8 }}
                                            />
                                            <Text>微信登录</Text>
                                        </TouchFeedback>
                                    )}
                                    <TouchFeedback style={styles.otherLogin} onPress={this.autoSign}>
                                        <Image
                                            source={require('../../assets/images/phone.png')}
                                            style={{ width: 28, height: 28, marginBottom: 8 }}
                                        />
                                        <Text>一键登录</Text>
                                    </TouchFeedback>
                                </Row>
                            </View>
                            <Row style={styles.rowCenter}>
                                <TouchFeedback
                                    style={styles.bageWrap}
                                    onPress={() => {
                                        this.setState({
                                            readed: !readed,
                                        });
                                    }}
                                >
                                    {readed ? (
                                        <View style={styles.bage}>
                                            <Iconfont name={'correct'} color={Theme.white} size={10} />
                                        </View>
                                    ) : null}
                                </TouchFeedback>

                                <Text style={styles.bottomInfoText}>同意</Text>
                                <View
                                    onPress={() => navigation.navigate('UserProtocol')}
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                >
                                    <TouchFeedback onPress={() => navigation.navigate('UserProtocol')}>
                                        <Text style={{ fontSize: PxFit(12), color: Theme.theme }}> 用户协议</Text>
                                    </TouchFeedback>
                                    <Text style={styles.bottomLinkText}> 和 </Text>
                                    <TouchFeedback onPress={() => navigation.navigate('PrivacyPolicy')}>
                                        <Text style={{ fontSize: PxFit(12), color: Theme.theme }}> 隐私政策</Text>
                                    </TouchFeedback>
                                </View>
                            </Row>
                        </View>
                    </View>
                </View>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    registerCoverContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    registerCover: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    // registerCover: {
    // 	height: PxFit(150),
    // 	paddingTop: PxFit(Theme.statusBarHeight + 20),
    // 	backgroundColor: Theme.primaryColor
    // },
    formContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(35),
        marginTop: 50,
        marginHorizontal: 15,
    },
    fieldGroup: {
        marginBottom: PxFit(10),
        backgroundColor: '#000000',
    },
    field: {
        fontSize: PxFit(16),
        color: '#666',
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.lightBorder,
        marginTop: 15,
    },
    inputStyle: {
        flex: 1,
        height: PxFit(40),
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        paddingBottom: PxFit(10),
        paddingTop: PxFit(10),
    },
    button: {
        marginTop: PxFit(30),
        height: PxFit(38),
        backgroundColor: Theme.primaryColor,
        borderRadius: PxFit(20),
    },
    buttonText: {
        fontSize: PxFit(16),
        fontWeight: '400',
        color: '#fff',
    },
    bottomInfo: {
        width: SCREEN_WIDTH,
        paddingHorizontal: PxFit(50),
        marginTop: PxFit(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomInfoText: {
        fontSize: PxFit(12),
        color: '#7D8089',
    },
    bottomLinkText: {
        fontSize: PxFit(12),
        color: '#7D8089',
    },
    protocol: {
        position: 'absolute',
        bottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(Theme.itemSpace),
        left: 0,
        right: 0,
    },
    line: {
        width: SCREEN_WIDTH / 5,
        height: 0.5,
        backgroundColor: Theme.grey,
    },
    otherLogin: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    bageWrap: {
        height: 14,
        width: 14,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Theme.grey,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    bage: {
        backgroundColor: Theme.theme,
        height: 14,
        width: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayInner: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(Theme.itemSpace),
    },
});

export default compose(
    withApollo,
    graphql(GQL.signInMutation, { name: 'signInMutation' }),
    graphql(GQL.autoSignInMutation, { name: 'autoSignInMutation' }),
    graphql(GQL.SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' })
)(index);
