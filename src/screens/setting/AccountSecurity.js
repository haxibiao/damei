/*
 * @flow
 * created by wyk made in 2019-03-22 11:55:07
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, ListItem, Avatar, ItemSeparator, TipsOverlay } from 'components';
import { Theme, PxFit, Config, ISIOS, Tools } from 'utils';

import UserPanel from './components/UserPanel';
import { app, me } from 'store';
import { DataCenter } from '../../data';

import { compose, graphql, GQL } from 'apollo';
import { checkLoginInfo, getWechatAuthCode } from 'common';

class AccountSecurity extends Component {
    constructor(props) {
        super(props);
        const user = this.props.route.params?.user ?? {};
        this.state = {
            is_bind_wechat: user.is_bind_wechat,
            is_bind_alipay: Tools.syncGetter('wallet.bind_platforms.alipay', user),
            is_bind_dongdezhuan: Tools.syncGetter('is_bind_dongdezhuan', user) || false,
            dongdezhuanUser: Tools.syncGetter('dongdezhuanUser', user) || {},
            DZUser: Tools.syncGetter('DZUser', user) || {},
        };
    }

    bindWechat = () => {
        if (this.is_bind_wechat) {
            Toast.show({
                content: '已绑定微信',
            });
        } else {
            this.setState({
                submitting: true,
            });
            getWechatAuthCode({
                callback: (code) => {
                    this.bindWx(code);
                },
            });
        }
    };

    bindWx = async (code) => {
        DataCenter.App.client
            .mutate({
                mutation: GQL.BindWechatMutation,
                variables: {
                    code: code,
                },
                errorPolicy: 'all',
                fetchPolicy: 'no-cache',
                refetchQueries: () => [
                    {
                        query: GQL.UserAutoQuery,
                        variables: { id: app.me.id },
                        fetchPolicy: 'network-only',
                    },
                ],
            })
            .then((rs) => {
                if (rs?.errors) {
                    //console.log("返回了错误>>>>>>>.",rs.errors[0].message)
                    Toast.show({ content: rs?.errors[0]?.message ?? '', duration: 2000 });
                    this.setState({
                        submitting: false,
                    });
                } else {
                    //console.log("绑定微信成功>>>>>>>>>>>");
                    this.setState({
                        is_bind_wechat: true,
                    });
                    Toast.show({ content: '绑定成功', duration: 2000 });
                }
            });

        // let result = {};
        // try {
        //     result = await this.props.BindWechatMutation({
        //         variables: {
        //             code: data.code
        //         },
        //         errorPolicy: 'all',
        //         refetchQueries: () => [
        //             {
        //                 query: GQL.UserAutoQuery,
        //                 variables: { id: app.me.id },
        //                 fetchPolicy: 'network-only',
        //             },
        //         ],
        //     });
        // } catch (ex) {
        //     result.errors = ex;
        // }
        // console.log("绑定微信结果: ",result);
        // if (result && result.errors) {
        //     this.setState({
        //         submitting: false,
        //     });
        //     const str = result.errors[0].message;
        //     Toast.show({ content: str });
        // } else {
        //     this.setState({
        //         is_bind_wechat: true,
        //     });
        //     Toast.show({ content: '绑定成功' });
        // }
    };

    checkAccount = (auto_uuid_user, auto_phone_user) => {
        const { navigation, route } = this.props;
        const user = route.params.user;

        if (auto_uuid_user || auto_phone_user) {
            TipsOverlay.show({
                title: '您还未完善登录信息',
                content: (
                    <TouchFeedback
                        style={{ alignItems: 'center', paddingTop: 15 }}
                        onPress={() => {
                            navigation.navigate('Share');
                            TipsOverlay.hide();
                        }}
                    >
                        <Text style={{ fontSize: 13, color: Theme.theme }}>完善登录信息后即可绑定支付宝</Text>
                    </TouchFeedback>
                ),
                onConfirm: () => navigation.navigate('SetLoginInfo', { phone: user.account }),
                confirmContent: '去绑定',
            });
        } else {
            navigation.navigate('ModifyAliPay');
        }
    };

    render() {
        const { navigation, data } = this.props;
        const { is_bind_wechat, is_bind_alipay, is_bind_dongdezhuan, dongdezhuanUser, DZUser } = this.state;
        const { loading, user } = data;

        if (loading) {
            return null;
        }
        let auto_uuid_user = false;
        let auto_phone_user = false;

        if (data && data.user) {
            auto_uuid_user = data.user.auto_uuid_user;
            auto_phone_user = data.user.auto_phone_user;
        }

        console.log('getParam user', user);
        return (
            <PageContainer title='账号与安全' white loading={!user}>
                <View style={styles.container}>
                    <ItemSeparator />
                    <UserPanel user={user} />
                    <ListItem
                        disabled
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>{auto_uuid_user ? '访客' : '账号'}</Text>}
                        rightComponent={
                            <Text style={styles.rightText}>{auto_uuid_user ? '未设置手机号' : user.account}</Text>
                        }
                    />
                    {auto_uuid_user && (
                        <ListItem
                            onPress={() => navigation.navigate('SetLoginInfo', { account: null })}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>设置手机/密码</Text>}
                            rightComponent={<Iconfont name='right' size={PxFit(14)} color={Theme.subTextColor} />}
                        />
                    )}

                    {auto_phone_user && (
                        <ListItem
                            onPress={() => navigation.navigate('SetLoginInfo', { phone: user.account })}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>设置密码</Text>}
                            rightComponent={<Iconfont name='right' size={PxFit(14)} color={Theme.subTextColor} />}
                        />
                    )}
                    {!auto_uuid_user && !auto_phone_user && (
                        <ListItem
                            onPress={() => navigation.navigate('ModifyPassword')}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>修改密码</Text>}
                            rightComponent={<Iconfont name='right' size={PxFit(14)} color={Theme.subTextColor} />}
                        />
                    )}

                    <ItemSeparator />
                    {!ISIOS && (
                        <ListItem
                            onPress={() => {
                                if (is_bind_wechat) {
                                    Toast.show({
                                        content: '已绑定微信',
                                    });
                                } else {
                                    this.bindWechat();
                                }
                            }}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>微信账号</Text>}
                            rightComponent={
                                <View style={styles.rightWrap}>
                                    <Text style={styles.linkText}>{is_bind_wechat ? '已绑定' : '去绑定'}</Text>
                                    <Iconfont name='right' size={PxFit(14)} color={Theme.subTextColor} />
                                </View>
                            }
                        />
                    )}
                    <ListItem
                        onPress={() => {
                            if (user.wallet && user.wallet.pay_info_change_count === -1) {
                                Toast.show({ content: '支付宝信息更改次数已达上限' });
                            } else {
                                // checkLoginInfo(auto_uuid_user, auto_phone_user, navigation, user);
                                navigation.navigate('SettingWithdrawInfo');
                            }
                        }}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>支付宝账号</Text>}
                        rightComponent={
                            <View style={styles.rightWrap}>
                                <Text style={[styles.linkText, { color: is_bind_alipay ? Theme.grey : '#407FCF' }]}>
                                    {is_bind_alipay
                                        ? `已绑定（${Tools.syncGetter('wallet.real_name', user)}）`
                                        : '去绑定'}
                                </Text>
                                <Iconfont name='right' size={PxFit(14)} color={Theme.subTextColor} />
                            </View>
                        }
                    />
                    <ListItem
                        onPress={this.handlerBindDongdezhuan}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>懂得赚账号</Text>}
                        rightComponent={
                            <View style={styles.rightWrap}>
                                <Text style={is_bind_dongdezhuan ? styles.rightText : styles.linkText}>
                                    {is_bind_dongdezhuan ? `已绑定(${dongdezhuanUser.name})` : '去绑定'}
                                </Text>
                                <Iconfont name='right' size={PxFit(14)} color={Theme.subTextColor} />
                            </View>
                        }
                    />
                    <ListItem
                        onPress={this.handlerBindDongdezhuan}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>答题赚钱账号</Text>}
                        rightComponent={
                            <View style={styles.rightWrap}>
                                <Text style={is_bind_dongdezhuan ? styles.rightText : styles.linkText}>
                                    {DZUser ? `已绑定(${DZUser.name})` : '去绑定'}
                                </Text>
                                <Iconfont name='right' size={PxFit(14)} color={Theme.subTextColor} />
                            </View>
                        }
                    />
                </View>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    avatarTip: {
        marginVertical: PxFit(15),
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    field: {
        fontSize: PxFit(14),
        color: '#666',
    },
    fieldGroup: {
        marginBottom: PxFit(30),
        paddingHorizontal: Theme.itemSpace,
    },
    genderGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        width: PxFit(100),
    },
    genderItem: { width: PxFit(20), height: PxFit(20), marginRight: PxFit(8) },
    inputStyle: {
        flex: 1,
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        paddingVertical: PxFit(10),
        marginTop: PxFit(6),
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: PxFit(1),
        borderBottomColor: Theme.borderColor,
    },
    itemText: {
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        marginRight: PxFit(15),
    },
    linkText: {
        fontSize: PxFit(15),
        color: '#407FCF',
        marginRight: PxFit(6),
    },
    listItem: {
        height: PxFit(50),
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.borderColor,
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    panelContent: {
        height: 34,
        justifyContent: 'space-between',
        marginLeft: 15,
    },
    panelLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightText: {
        fontSize: PxFit(15),
        color: Theme.subTextColor,
    },
    rightWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userLevel: {
        fontSize: 12,
        color: Theme.subTextColor,
        fontWeight: '300',
        paddingTop: 3,
    },
    userPanel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: PxFit(80),
        borderBottomWidth: PxFit(1),
        borderBottomColor: Theme.borderColor,
    },
});

export default compose(
    graphql(GQL.BindWechatMutation, { name: 'BindWechatMutation' }),
    graphql(GQL.UserAutoQuery, { options: (props) => ({ variables: { id: props.route.params.user.id } }) })
)(AccountSecurity);
