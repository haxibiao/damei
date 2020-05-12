import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, ListItem, Avatar, ItemSeparator, Loading } from 'components';
import { Theme, PxFit, Config, ISIOS, Tools } from 'utils';

import UserPanel from './components/UserPanel';
import { app, me } from 'store';

import { useQuery, graphql, GQL } from 'apollo';
import { checkLoginInfo, getWechatAuthCode } from 'common';

const AccountSecurity = (props) => {
    const { navigation } = props;

    const user = props.route.params?.user ?? {};
    const { data, loading, error, refetch, fetchMore } = useQuery(GQL.UserAccountSecurityQuery, {
        variables: {
            id: user.id,
        },
        client: app.newClient,
    }); 
    console.log('data', data)
    const [isBindWechat, setIsBindWechat] = useState(Tools.syncGetter('is_bind_wechat', user) || false);
    const [DongdezhuanUser, setDongdezhuanUser] = useState(Tools.syncGetter('user.dongdezhuanUser', data) || {});
    const [DZUser, setDZUser] = useState(Tools.syncGetter('user.DZUser', data) || {});
    const isBindAlipay= Tools.syncGetter('user.wallet.bind_platforms.alipay', data)

    // const { loading, user } = data;

    const bindWechat = () => {
        if (isBindWechat) {
            Toast.show({
                content: '已绑定微信',
            });
        } else {
            getWechatAuthCode({
                callback: (code) => {
                    bindWx(code);
                },
            });
        }
    };

    const bindWx = async (code) => {
        Loading.show()
        app.client
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
                    Loading.hide()
                    Toast.show({ content: rs?.errors[0]?.message ?? '', duration: 2000 });
                } else {
                    Loading.hide()
                    setIsBindWechat(true)
                    Toast.show({ content: '绑定成功', duration: 2000 });
                }
            });
    };

    if (loading) {
        return null;
    }
    
    let auto_uuid_user = false;
    let auto_phone_user = false;

    if (data && data.user) {
        auto_uuid_user = data.user.auto_uuid_user;
        auto_phone_user = data.user.auto_phone_user;
    }

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
                            if (isBindWechat) {
                                Toast.show({
                                    content: '已绑定微信',
                                });
                            } else {
                                bindWechat();
                            }
                        }}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>微信账号</Text>}
                        rightComponent={
                            <View style={styles.rightWrap}>
                                <Text style={styles.linkText}>{isBindWechat ? '已绑定' : '去绑定'}</Text>
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
                            <Text style={[styles.rightText, { color: isBindAlipay ? Theme.grey : '#407FCF' }]}>
                                {isBindAlipay ? `已绑定(${Tools.syncGetter('wallet.real_name', user)})`:'去绑定'}
                            </Text>
                            <Iconfont name='right' size={PxFit(14)} color={Theme.subTextColor} />
                        </View>
                    }
                />
                <ListItem
                    style={styles.listItem}
                    leftComponent={<Text style={styles.itemText}>懂得赚账号</Text>}
                    rightComponent={
                        <View style={styles.rightWrap}>
                            <Text style={DongdezhuanUser ? styles.rightText : styles.linkText}>
                                {DongdezhuanUser ? `已绑定(${DongdezhuanUser.name||app.me.name})` : '去绑定'}
                            </Text>
                            <Iconfont name='right' size={PxFit(14)} color={Theme.subTextColor} />
                        </View>
                    }
                />
                <ListItem
                    style={styles.listItem}
                    leftComponent={<Text style={styles.itemText}>答题赚钱账号</Text>}
                    rightComponent={
                        <View style={styles.rightWrap}>
                            <Text style={DZUser ? styles.rightText : styles.linkText}>
                                {DZUser ? `已绑定(${DZUser.name||app.me.name})` : '去绑定'}
                            </Text>
                            <Iconfont name='right' size={PxFit(14)} color={Theme.subTextColor} />
                        </View>
                    }
                />
            </View>
        </PageContainer>
    );
};
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
        marginRight: PxFit(3),
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

export default AccountSecurity;
