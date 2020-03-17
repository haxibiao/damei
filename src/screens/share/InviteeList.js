/*
 * @Author: Gaoxuan
 * @Date:   2019-07-18 11:20:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, FlatList } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, Button, Avatar } from 'components';
import { Theme, PxFit, Tools, SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils';

import { BoxShadow } from 'react-native-shadow';

import { compose, Query, Mutation, graphql, GQL } from 'apollo';
import { syncGetter, exceptionCapture, GetSpecifyDate } from 'common';
import { app } from 'store';

import { Overlay } from 'teaset';

import ShareTypeOverlay from './components/ShareTypeOverlay';

class InviteeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerHeight: null,
            itemHeight: null,
        };
    }

    showShareType = () => {
        let { navigation } = this.props;

        let { shareInfo } = navigation.state.params;
        const shareTypeOverlayView = (
            <Overlay.PullView style={{ flexDirection: 'column', justifyContent: 'flex-end' }} animated>
                <ShareTypeOverlay hide={() => Overlay.hide(ShareTypeOverlayKey)} user={shareInfo} />
            </Overlay.PullView>
        );
        const ShareTypeOverlayKey = Overlay.show(shareTypeOverlayView);
    };

    render() {
        let { navigation } = this.props;
        let { headerHeight, itemHeight } = this.state;
        let { shareInfo } = navigation.state.params;

        return (
            <PageContainer title="我的好友" white>
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <View style={styles.row}>
                            <Text style={styles.headerTitle}>我的收益</Text>
                            <Button
                                style={styles.withdrawButton}
                                textColor={Theme.white}
                                title={'收益记录'}
                                onPress={() => {
                                    navigation.navigate('Balance');
                                }}
                            />
                        </View>

                        <View style={styles.rewardInfo}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.rewardCount}>{`${shareInfo.invitations_success_count || 0}`}</Text>
                                <Text style={styles.tips}>已邀请好友(人)</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.rewardCount}>
                                    {Tools.NumberFormat(
                                        syncGetter('invitation.reward_total_share_bonus', shareInfo) || 0,
                                    )}
                                </Text>
                                <Text style={styles.tips}>徒弟提现分红(元)</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.rewardCount}>
                                    {Tools.NumberFormat(syncGetter('invitation.reward_total_amount', shareInfo) || 0)}
                                </Text>
                                <Text style={styles.tips}>邀请总收益(元)</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <BoxShadow
                            setting={Object.assign({}, shadowOpt, {
                                height: 64 + itemHeight,
                            })}>
                            <Query
                                query={GQL.InvitationsQuery}
                                variables={{ user_id: app.me.id, filter: 'INVITE_SUCCESS' }}>
                                {({ data, loading, error, refetch, fetchMore }) => {
                                    console.log('error', error);
                                    if (error) return null;
                                    if (loading) return null;
                                    if (!(data && data.invitations.length > 0))
                                        return (
                                            <View style={styles.noneInvitee}>
                                                <Text
                                                    style={{
                                                        color: '#FBB6A2',
                                                        fontSize: PxFit(14),
                                                    }}>
                                                    还没有邀请好友，快去邀请好友吧！
                                                </Text>
                                            </View>
                                        );
                                    return (
                                        <View>
                                            <View style={styles.InviteeContainer}>
                                                <Text style={styles.title}>邀请好友列表</Text>
                                                <View style={styles.border} />
                                            </View>
                                            {data.invitations.map((item, index) => {
                                                return (
                                                    <View
                                                        style={styles.userContainer}
                                                        key={index}
                                                        onLayout={event => {
                                                            this.setState({
                                                                itemHeight:
                                                                    data.invitations.length *
                                                                    event.nativeEvent.layout.height,
                                                            });
                                                        }}>
                                                        <Row>
                                                            <Avatar source={item.beInviter.avatar} size={PxFit(42)} />
                                                            <View
                                                                style={{
                                                                    paddingLeft: PxFit(10),
                                                                }}>
                                                                <Text
                                                                    style={{
                                                                        color: Theme.primaryFont,
                                                                    }}>
                                                                    {item.beInviter.name}
                                                                </Text>
                                                                <Text style={styles.time}>{item.invited_in}</Text>
                                                            </View>
                                                        </Row>
                                                    </View>
                                                );
                                            })}
                                            <View style={{ alignItems: 'center', marginTop: PxFit(25) }}>
                                                <Text style={{ color: '#FBB6A2', fontSize: PxFit(12) }}>
                                                    到底啦！快去邀请更多好友吧！
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                }}
                            </Query>
                        </BoxShadow>
                    </View>
                </ScrollView>
                <View style={styles.positionBottom}>
                    <Button
                        style={styles.InviteeButton}
                        textColor={Theme.white}
                        title={'邀请好友'}
                        onPress={() => this.showShareType()}
                    />
                </View>
            </PageContainer>
        );
    }
}

const shadowOpt = {
    width: SCREEN_WIDTH - PxFit(30),
    height: PxFit(150),
    color: '#FBB6A2',
    border: PxFit(10),
    radius: PxFit(10),
    opacity: 0.2,
    x: 0,
    y: 0,
    style: {
        marginHorizontal: PxFit(15),
        marginVertical: PxFit(15),
    },
};

const styles = StyleSheet.create({
    header: {
        marginHorizontal: PxFit(15),
        marginVertical: PxFit(10),
        backgroundColor: Theme.theme,
        borderRadius: PxFit(5),
        paddingTop: PxFit(10),
        paddingBottom: PxFit(20),
        paddingHorizontal: PxFit(15),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: PxFit(20),
        color: Theme.white,
        fontWeight: '500',
    },
    withdrawButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Theme.white,
        borderRadius: PxFit(15),
        height: PxFit(30),
        width: PxFit(84),
    },
    rewardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: PxFit(20),
    },
    rewardCount: {
        fontSize: PxFit(20),
        color: Theme.white,
    },
    tips: {
        fontSize: PxFit(12),
        paddingTop: PxFit(10),
        color: Theme.white,
    },
    noneInvitee: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 64,
        backgroundColor: '#FFF',
    },
    InviteeContainer: {
        paddingHorizontal: PxFit(15),
        paddingVertical: PxFit(15),
        backgroundColor: '#FFF',
        borderRadius: PxFit(5),
        height: PxFit(64),
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(15),
        paddingVertical: PxFit(10),
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: PxFit(18),
        fontWeight: '500',
        color: Theme.black,
    },
    border: {
        backgroundColor: Theme.theme,
        width: PxFit(20),
        height: PxFit(5),
        marginTop: PxFit(10),
    },
    time: {
        lineHeight: PxFit(22),
        paddingTop: PxFit(2),
        color: Theme.subTextColor,
        fontSize: PxFit(13),
    },
    positionBottom: {
        position: 'absolute',
        bottom: PxFit(10),
        left: SCREEN_WIDTH / 8,
    },
    InviteeButton: {
        backgroundColor: Theme.theme,
        borderRadius: PxFit(19),
        height: PxFit(38),
        width: (SCREEN_WIDTH * 3) / 4,
    },
});

export default InviteeList;
