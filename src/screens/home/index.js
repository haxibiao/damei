/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:20
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Image, Text } from 'react-native';
import {
    PageContainer,
    CustomRefreshControl,
    ListFooter,
    Placeholder,
    Banner,
    beginnerGuidance,
    VideoTaskGuidance,
} from 'components';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, Theme, PxFit, NAVBAR_HEIGHT, ISIOS } from 'utils';
import PlateItem from './components/PlateItem';

import { observer, app, keys, storage, config } from 'store';
import { when } from 'mobx';
import { withApollo, compose, graphql, GQL } from 'apollo';
import { DataCenter } from '../../data';

import JPushModule from 'jpush-react-native';
import NetInfo from '@react-native-community/netinfo';

import { Util } from 'native';
import { Overlay } from 'teaset';

import TimeReward from './components/TimeReward';



@observer
class index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            finished: false,
            categoryCache: null,
            description: null,
            content: null,
            time: new Date(),
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;
        DataCenter.setNavigation(navigation);
        this.resetUser();

        // 监听新用户登录;
        when(
            () => {
                let isNew = !config.disableAd ? app?.me?.is_old_user : null
                //新用户（0） 老用户（1）
                return isNew === 0;
            },
            () => {
                // 新手指导
                beginnerGuidance({
                    guidanceKey: 'VideoTask',
                    GuidanceView: VideoTaskGuidance,
                });
            },
        );

        this.registerTimer = setTimeout(async () => {
            // 再次请求权限防止未获取到手机号
            const userCache = await storage.getItem(keys.userCache);
            const phone = ISIOS ? '' : await Util.getPhoneNumber();
            if (!app.login && !userCache && !config.disableAd) {
                this.loadUserReword(phone);
            }
        }, 3000);

        this.didFocusSubscription = navigation.addListener('focus', payload => {
            const { client, login } = this.props;
            if (login) {
                client
                    .query({
                        query: GQL.UserWithdrawQuery,
                    })
                    .then(({ data }) => { })
                    .catch(error => {
                        const info = error.toString().indexOf('登录');
                        if (info > -1) {
                            app.forget();
                            Toast.show({ content: '您的身份信息已过期,请重新登录' });
                        }
                    });
            }
            NetInfo.fetch().then(state => {
                if (!state.isConnected) {
                    Toast.show({ content: '网络不可用' });
                }
            });
        });

        // 当有用户seesion 过期时 ,清空redux 强制重新登录。

        this.receiveNotificationListener = message => {
            this.setState({
                content: message.alertContent,
                type: JSON.parse(message.extras).type,
                time: JSON.parse(message.extras).time,
            });
        };
        JPushModule.addReceiveNotificationListener(this.receiveNotificationListener);
        // 监听推送通知

        this.openNotificationListener = map => {
            const { type, content, time } = this.state;
            // if (type == 'maintenance') {
            //  this.props.navigation.navigate('推送通知', { content: content, name: '系统维护', time: time });
            // }
            this.props.navigation.navigate('PushNotification', { content: content, name: '官方提示', time: time });
        };
        JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener);
        // 监听打开通知事件
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        JPushModule.removeReceiveNotificationListener(this.receiveNotificationListener);
        JPushModule.removeReceiveOpenNotificationListener(this.openNotificationListener);
    }

    componentDidUpdate(nextProps, nextState) {
        const { data } = this.props;
        if (data && data.categories && nextProps.data.categories !== data.categories) {
            app.updateCategoryCache(data.categories);
        }
    }

    // 每个版本静默重新登录一次
    async resetUser() {
        console.log('resetUser starting >>>>>>>>');
        const resetVersion = await storage.getItem(keys.resetVersion);
        const me = (await storage.getItem(keys.me)) || (await storage.getItem(keys.user));

        if (resetVersion !== Config.AppVersionNumber && me) {
            this.props
                .signToken({
                    variables: {
                        token: me.token,
                    },
                })
                .then(result => {
                    app.signIn(result.data.signInWithToken);
                    app.updateResetVersion(Config.AppVersionNumber);
                    app.updateUserCache(result.data.signInWithToken);
                });
        }

        console.log('resetUser end >>>>>>>>>>>');
    }

    _renderCategoryList = () => {
        const {
            navigation,
            data: { loading, categories, refetch, fetchMore },
        } = this.props;
        let questionCategories = categories;
        const { login, categoryCache } = app;
        if (!questionCategories) {
            if (categoryCache) {
                questionCategories = categoryCache;
            } else {
                return Array(10)
                    .fill(0)
                    .map((elem, index) => {
                        return <Placeholder key={index} type="list" />;
                    });
            }
        }

        const categrorys = questionCategories.filter((elem, i, category) => {
            return category.indexOf(elem, 0) === i;
        });

        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={categrorys}
                    refreshControl={
                        <CustomRefreshControl
                            refreshing={loading}
                            onRefresh={refetch}
                            reset={() =>
                                this.setState({
                                    finished: false,
                                })
                            }
                        />
                    }
                    keyExtractor={(item, index) => (item.id ? item.id.toString() + Date.now() : index.toString())}
                    renderItem={({ item, index }) => (
                        <PlateItem category={item} navigation={navigation} login={login} />
                    )}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => {
                        if (categories && questionCategories) {
                            fetchMore({
                                variables: {
                                    offset: questionCategories.length,
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (
                                        !(
                                            fetchMoreResult &&
                                            fetchMoreResult.categories &&
                                            fetchMoreResult.categories.length > 0
                                        )
                                    ) {
                                        this.setState({
                                            finished: true,
                                        });
                                        return prev;
                                    }
                                    return Object.assign({}, prev, {
                                        categories: [...prev.categories, ...fetchMoreResult.categories],
                                    });
                                },
                            });
                        }
                    }}
                    ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
                />
            </View>
        );
    };

    menuPress = () => {
        const { navigation } = this.props;
        console.log('app', app.userCache);
        if (app.userCache.level.level < 2) {
            Toast.show({
                content: `达到${2}级才可以出题哦`,
            });
        } else {
            navigation.navigate('AskQuestion');
        }
    };

    render() {
        return (
            <PageContainer contentViewStyle={{ marginTop: 0 }} white>
                <View style={{ height: PxFit(NAVBAR_HEIGHT), paddingTop: PxFit(Theme.statusBarHeight) }}>
                    <Image source={require('../../assets/images/yellow_bg.png')} style={styles.navBg} />
                    <Text style={styles.title}>所有题库</Text>
                </View>
                {this._renderCategoryList()}
                {/*
                     <View style={{ position: 'absolute', right: PxFit(Theme.itemSpace), bottom: PxFit(20) }}>
                    <TouchFeedback authenticated navigation={this.props.navigation} onPress={this.menuPress}>
                        <Image
                            source={require('../../assets/images/ic_ring_menu.png')}
                            style={{ width: PxFit(60), height: PxFit(60) }}
                        />
                    </TouchFeedback>
                </View>*/}
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navBg: {
        position: 'absolute',
        left: 0,
        top: -(SCREEN_WIDTH * 0.43 - PxFit(NAVBAR_HEIGHT)),
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.43,
    },
    title: {
        position: 'absolute',
        left: PxFit(Theme.itemSpace),
        bottom: PxFit(10),
        fontSize: PxFit(20),
        fontWeight: 'bold',
        color: Theme.defaultTextColor,
    },
    overlayInner: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0)',
        flex: 1,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        width: SCREEN_WIDTH,
    },
});

export default compose(
    graphql(GQL.CategoriesQuery, { options: props => ({ variables: { limit: 10 } }) }),
    graphql(GQL.signToken, { name: 'signToken' }),
)(withApollo(index));
