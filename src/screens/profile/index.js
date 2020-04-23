/**
 * @format
 * @flow
 */


import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, Avatar, Badge } from '../../components';
import { Config, Theme, PxFit, SCREEN_WIDTH, ISIOS, Tools } from 'utils';
import { GQL, Query, withApollo, compose, graphql } from 'apollo';
import { observer, app, config, keys, storage } from 'store';

import JPushModule from 'jpush-react-native';

import { BoxShadow } from 'react-native-shadow';
import codePush from 'react-native-code-push';

import { ad } from 'native';
@observer
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCache: null,
        };
    }

    componentDidUpdate(nextProps, nextState) {
        const { data } = this.props;
        if (data && data.user && nextProps?.data?.user !== data.user) {
            app.updateUserCache(data.user);
        }
    }

    userAdapter(data: Record<string, any> = {}) {
        const user = {
            id: -1,
            ...data,
            name: data.name || '求学好问',
            avatar: data.avatar ? data.avatar + '?t=' + Date.now() : require('../../assets/images/default_avatar.png'),
            level: data.level || { level: 0, name: '初来乍到' },
            exp: data.exp || 0,
            next_level_exp: data.next_level_exp || 50,
        };
        return user;
    }

    render() {
        const { navigation, data } = this.props;
        const { login, me, userCache } = app;
        let user = me;

        if (login && data && data.user) {
            data.user.avatar = user.avatar;
            user = data.user;
        } else if (login && userCache) {
            user = this.userAdapter(userCache);
            user.avatar = user.avatar;
        } else {
            user = this.userAdapter(user);
        }
        return (
            <PageContainer
                isTopNavigator
                white
                navBarStyle={{ borderBottomColor: 'transparent' }}
                contentViewStyle={{ marginTop: 0 }}
                onWillFocus={data && data.refetch}>
                <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
                    <View style={styles.userInfo}>
                        <View style={styles.textInfo}>
                            <TouchFeedback
                                activeOpacity={1}
                                authenticated
                                navigation={navigation}
                                onPress={() => navigation.navigate('User', { user })}>
                                <Text style={styles.userName} numberOfLines={1}>
                                    {login ? user.name : '登录/注册'}
                                </Text>
                                {login ? (
                                    <View style={styles.levelBox}>
                                        <Image
                                            style={styles.levelIcon}
                                            source={require('../../assets/images/driver_level.png')}
                                        />
                                        <Text style={styles.levelText} numberOfLines={1}>
                                            当前头衔 「{user.level.name}」
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={styles.introduction} numberOfLines={1}>
                                        {'欢迎来到' + Config.AppName}
                                    </Text>
                                )}
                            </TouchFeedback>
                            <View style={styles.metaWrap}>
                                <TouchFeedback
                                    navigation={navigation}
                                    onPress={() => navigation.navigate('GradeDescription', { user })}
                                    authenticated
                                    activeOpacity={1}
                                    style={styles.metaItem}>
                                    <Text style={styles.metaCount} numberOfLines={1}>
                                        {user.level ? user.level.level : 0}
                                    </Text>
                                    <Text style={styles.metaLabel} numberOfLines={1}>
                                        等级
                                    </Text>
                                </TouchFeedback>
                                <TouchFeedback
                                    navigation={navigation}
                                    onPress={() => navigation.navigate('Society',{follower:false})}
                                    authenticated
                                    activeOpacity={1}
                                    style={styles.metaItem}>
                                    <Text style={styles.metaCount} numberOfLines={1}>
                                        {Tools.NumberFormat(user.follow_users_count) || 0}
                                    </Text>
                                    <Text style={styles.metaLabel} numberOfLines={1}>
                                        关注
                                    </Text>
                                </TouchFeedback>
                                <TouchFeedback
                                    navigation={navigation}
                                    onPress={() => navigation.navigate('Society', { follower: true })}
                                    authenticated
                                    activeOpacity={1}
                                    style={styles.metaItem}>
                                    <Text style={styles.metaCount} numberOfLines={1}>
                                        {Tools.NumberFormat(user.followers_count) || 0}
                                    </Text>
                                    <Text style={styles.metaLabel} numberOfLines={1}>
                                        粉丝
                                    </Text>
                                </TouchFeedback>
                            </View>
                        </View>
                        <TouchFeedback
                            authenticated
                            navigation={navigation}
                            onPress={() => navigation.navigate('User', { user })}>
                            <Avatar source={user.avatar} size={PxFit(80)} />
                        </TouchFeedback>
                    </View>
                    {!config.disableAd && (
                        <View style={styles.conditionInfo}>
                            <TouchFeedback
                                style={styles.conditionItem}
                                navigation={navigation}
                                authenticated
                                onPress={() => {
                                    !config.disableAd && navigation.navigate('BillingRecord');
                                }}>
                                <Text style={styles.conditionName}>智慧点</Text>
                                <Row>
                                    <Image
                                        style={styles.conditionNameIcon}
                                        source={require('../../assets/images/diamond.png')}
                                    />
                                    <Text style={styles.conditionText} numberOfLines={1}>
                                        {user.gold || 0}
                                    </Text>
                                </Row>
                            </TouchFeedback>
                            <View style={{ width: PxFit(8) }} />
                            <View style={styles.conditionItem}>
                                <Text style={styles.conditionName}>精力点</Text>
                                <Row>
                                    <Image
                                        style={styles.conditionNameIcon}
                                        source={require('../../assets/images/heart.png')}
                                    />
                                    <Text style={styles.conditionText} numberOfLines={1}>
                                        {user.ticket || 0}
                                    </Text>
                                </Row>
                            </View>
                        </View>
                    )}

                    <View style={styles.card}>
                        <View style={styles.cardLabels}>
                            <TouchFeedback
                                navigation={navigation}
                                authenticated
                                activeOpacity={1}
                                style={styles.cardLabelItem}
                                onPress={() => navigation.navigate('MyPublish')}>
                                <Image
                                    style={styles.cardLabelIcon}
                                    source={require('../../assets/images/ic_mine_order.png')}
                                />
                                <Text style={styles.cardLabelText} numberOfLines={1}>
                                    我的发布
                                </Text>
                            </TouchFeedback>
                            <TouchFeedback
                                navigation={navigation}
                                authenticated
                                activeOpacity={1}
                                style={styles.cardLabelItem}
                                onPress={() => navigation.navigate('FavoritesLog')}>
                                <Image
                                    style={styles.cardLabelIcon}
                                    source={require('../../assets/images/ic_mine_collection.png')}
                                />
                                <Text style={styles.cardLabelText} numberOfLines={1}>
                                    我的收藏
                                </Text>
                            </TouchFeedback>
                            <TouchFeedback
                                navigation={navigation}
                                authenticated
                                activeOpacity={1}
                                style={styles.cardLabelItem}
                                onPress={() => navigation.navigate('AnswerLog')}>
                                <Image
                                    style={styles.cardLabelIcon}
                                    source={require('../../assets/images/ic_mine_medal.png')}
                                />
                                <Text style={styles.cardLabelText} numberOfLines={1}>
                                    答题记录
                                </Text>
                            </TouchFeedback>
                            {!config.disableAd && (
                                <TouchFeedback
                                    activeOpacity={1}
                                    style={styles.cardLabelItem}
                                    onPress={() => navigation.navigate('Rank')}>
                                    <Image
                                        style={{ width: PxFit(25), height: PxFit(26), resizeMode: 'contain' }}
                                        source={require('../../assets/images/rank.png')}
                                    />
                                    <Text style={styles.cardLabelText} numberOfLines={1}>
                                        排行榜
                                    </Text>
                                </TouchFeedback>
                            )}
                        </View>
                        <View style={styles.cardLabels}>
                            <TouchFeedback
                                navigation={navigation}
                                authenticated
                                activeOpacity={1}
                                style={styles.cardLabelItem}
                                onPress={() => navigation.navigate('Notification')}>
                                <Image
                                    style={styles.cardLabelIcon}
                                    source={require('../../assets/images/ic_mine_speak.png')}
                                />
                                <Text style={styles.cardLabelText} numberOfLines={1}>
                                    消息中心
                                </Text>

                                {login && (
                                    <Query
                                        query={GQL.userUnreadQuery}
                                        variables={{ id: user.id }}
                                        fetchPolicy="network-only">
                                        {({ data, error, refetch }) => {
                                            navigation.addListener('focus', payload => {
                                                refetch();
                                            });
                                            if (data && data.user && data.user.unread_notifications_count) {
                                                return (
                                                    <View
                                                        style={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: Theme.themeRed,
                                                            position: 'absolute',
                                                            top: 12,
                                                            right: 12,
                                                        }}
                                                    />
                                                );
                                            } else {
                                                return null;
                                            }
                                        }}
                                    </Query>
                                )}
                            </TouchFeedback>

                            <TouchFeedback
                                activeOpacity={1}
                                style={styles.cardLabelItem}
                                onPress={() => navigation.navigate('CommonIssue')}>
                                <Image
                                    style={styles.cardLabelIcon}
                                    source={require('../../assets/images/ic_mine_shopping.png')}
                                />
                                <Text style={styles.cardLabelText} numberOfLines={1}>
                                    常见问题
                                </Text>
                            </TouchFeedback>
                            <TouchFeedback
                                activeOpacity={1}
                                style={styles.cardLabelItem}
                                onPress={() => navigation.navigate('Feedback')}>
                                <Image
                                    style={styles.cardLabelIcon}
                                    source={require('../../assets/images/ic_mine_service.png')}
                                />
                                <Text style={styles.cardLabelText} numberOfLines={1}>
                                    反馈中心
                                </Text>
                            </TouchFeedback>
                            {!config.disableAd && (
                                <TouchFeedback
                                    activeOpacity={1}
                                    style={styles.cardLabelItem}
                                    onPress={() => navigation.navigate('MakeMoenyManual')}>
                                    <Image
                                        style={styles.cardLabelIcon}
                                        source={require('../../assets/images/ic_mine_gift.png')}
                                    />
                                    <Text style={styles.cardLabelText} numberOfLines={1}>
                                        赚钱攻略
                                    </Text>
                                </TouchFeedback>
                            )}
                        </View>
                    </View>
                    {!config.disableAd && (
                        <TouchFeedback
                            navigation={navigation}
                            authenticated
                            style={styles.columnItem}
                            onPress={() => navigation.navigate('Withdraws')}>
                            <Row>
                                <View style={styles.columnIconWrap}>
                                    <Image
                                        style={styles.columnIcon}
                                        source={require('../../assets/images/p_wallet.png')}
                                    />
                                </View>
                                <Text style={styles.itemTypeText}>我的钱包</Text>
                            </Row>
                            <Iconfont name="right" size={PxFit(15)} color={Theme.secondaryTextColor} />
                        </TouchFeedback>
                    )}

                    <TouchFeedback
                        navigation={navigation}
                        authenticated
                        style={styles.columnItem}
                        onPress={() => navigation.navigate('Feedback')}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image style={styles.columnIcon} source={require('../../assets/images/p_edit.png')} />
                            </View>
                            <Text style={styles.itemTypeText}>意见反馈</Text>
                        </Row>
                        <Iconfont name="right" size={PxFit(15)} color={Theme.secondaryTextColor} />
                    </TouchFeedback>
                    <TouchFeedback style={styles.columnItem} onPress={() => navigation.navigate('Setting', { user })}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('../../assets/images/p_setting.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>设置</Text>
                        </Row>
                        <Iconfont name="right" size={PxFit(15)} color={Theme.secondaryTextColor} />
                    </TouchFeedback>
                </ScrollView>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        margin: PxFit(Theme.itemSpace),
        backgroundColor: '#FFFAFC',
        borderRadius: PxFit(8),
    },
    cardLabelIcon: {
        width: PxFit(28),
        height: PxFit(28),
        resizeMode: 'cover',
    },
    cardLabelItem: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: PxFit(Theme.itemSpace),
    },
    cardLabelText: {
        marginTop: PxFit(8),
        fontSize: PxFit(11),
        color: Theme.secondaryTextColor,
    },
    cardLabels: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    columnIcon: {
        width: PxFit(24),
        height: PxFit(24),
        resizeMode: 'cover',
    },
    columnIconWrap: {
        width: PxFit(30),
        height: PxFit(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    columnItem: {
        height: PxFit(62),
        paddingHorizontal: PxFit(Theme.itemSpace),
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    conditionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: PxFit(Theme.itemSpace),
        marginVertical: PxFit(5),
    },
    conditionItem: {
        flex: 1,
        justifyContent: 'center',
        height: PxFit(70),
        padding: PxFit(10),
        borderRadius: PxFit(8),
        backgroundColor: '#FFF4E9',
    },
    conditionName: {
        fontSize: PxFit(14),
        color: Theme.defaultTextColor,
        marginBottom: PxFit(5),
    },
    conditionNameIcon: {
        width: PxFit(18),
        height: PxFit(18),
        marginRight: PxFit(5),
    },
    conditionText: {
        fontSize: PxFit(14),
        color: Theme.secondaryTextColor,
    },
    container: {
        flex: 1,
    },
    introduction: {
        marginTop: PxFit(10),
        fontSize: PxFit(13),
    },
    itemType: {
        width: PxFit(25),
        textAlign: 'center',
        justifyContent: 'center',
        marginRight: PxFit(10),
    },
    itemTypeText: {
        marginLeft: PxFit(Theme.itemSpace),
        fontSize: PxFit(17),
        color: Theme.secondaryTextColor,
    },
    levelBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: PxFit(10),
    },
    levelIcon: {
        width: PxFit(20),
        height: PxFit(20),
        resizeMode: 'cover',
        marginLeft: PxFit(-2),
        marginRight: PxFit(2),
    },
    levelText: {
        fontSize: PxFit(12),
        fontWeight: 'bold',
        color: '#FFD324',
    },
    metaCount: {
        fontSize: PxFit(15),
        color: Theme.secondaryTextColor,
        fontWeight: 'bold',
    },
    metaItem: {
        paddingRight: PxFit(40),
        justifyContent: 'space-between',
        paddingVertical: PxFit(Theme.itemSpace),
    },
    metaLabel: {
        fontSize: PxFit(13),
        color: Theme.secondaryTextColor,
    },
    metaWrap: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    textInfo: {
        flex: 1,
        paddingRight: Theme.itemSpace,
    },
    userInfo: {
        paddingHorizontal: Theme.itemSpace,
        paddingTop: PxFit(Theme.statusBarHeight + 20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: PxFit(20),
        color: Theme.defaultTextColor,
        fontWeight: 'bold',
    },
});

export default compose(
    graphql(GQL.UserQuery, {
        options: props => ({ variables: { id: app.me.id } }),
        skip: props => !app.login,
    }),
)(index);
