/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:55:51
 */

//TODO:通知待完善

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Iconfont } from 'components';
import { Theme, PxFit, Tools } from 'utils';

import WithdrawNotificationItem from './WithdrawNotificationItem';
import ContributeNotificationItem from './ContributeNotificationItem';
import CurationNotificationItem from './CurationNotificationItem';

class NotificationItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { navigation, user, notification } = this.props;
        const data = JSON.parse(notification.data);
        // console.log('data', data);
        return (
            <View>
                <View style={styles.timeInfo}>
                    <View style={styles.timeBgc}>
                        <Text style={styles.timeText}>{notification.created_at}</Text>
                    </View>
                </View>
                {notification.withdraw && (
                    <WithdrawNotificationItem notification={notification} navigation={navigation} />
                    //提现
                )}
                {notification.type == 'QUESTION_AUDIT' && (
                    <ContributeNotificationItem notification={notification} navigation={navigation} />
                    //任务
                )}
                {notification.curation && (
                    <CurationNotificationItem notification={notification} navigation={navigation} />
                    //纠错
                )}

                {notification.type == 2 && (
                    <View style={styles.item}>
                        <View style={styles.titleInfo}>
                            <Iconfont name={'like'} size={20} color={Theme.weixin} />
                            <Text style={styles.title}>精力点变化</Text>
                        </View>
                        <View style={styles.bottomInfo}>
                            <Text style={styles.text}>您的精力点已经重置了哦</Text>
                            <Text style={styles.infoItem}>
                                当前精力点: {item.user.ticket}/{item.user.ticket}
                            </Text>
                            <Text style={styles.infoItem}>恢复时间: 每天00:00</Text>
                        </View>
                    </View>
                    // 精力点恢复
                )}

                {notification.type == 'REPORT_SUCCEED' && (
                    <View style={styles.item}>
                        <View style={styles.titleInfo}>
                            <Iconfont name={'report'} size={20} color={Theme.themeRed} />
                            <Text style={styles.title}>举报结果</Text>
                        </View>
                        <View style={styles.bottomInfo}>
                            <Text style={styles.text}>您的举报已生效</Text>
                            <Text style={styles.infoItem}>奖励：2贡献值</Text>
                            <Text style={styles.infoItem}>内容：{Tools.syncGetter('report.reason', notification)}</Text>
                            <Text style={styles.infoItem}>
                                时间：{Tools.syncGetter('report.created_at', notification)}
                            </Text>
                            <Text style={[styles.infoItem, { lineHeight: 20 }]}>
                                题目名：{Tools.syncGetter('report.question.description', notification)}
                            </Text>
                        </View>
                    </View>
                )}
                {notification.type == 'LEVEL_UP' && (
                    <View style={styles.item}>
                        <View style={styles.titleInfo}>
                            <Iconfont name={'rank-up'} size={20} color={Theme.themeRed} />
                            <Text style={styles.title}>升级通知</Text>
                        </View>
                        <View style={styles.bottomInfo}>
                            <Text style={styles.text}>恭喜你升级了！</Text>
                            <Text style={styles.infoItem}>
                                当前等级: LV{Tools.syncGetter('user.level.level', notification)}{' '}
                            </Text>
                            <Text style={styles.infoItem}>
                                精力点上限: {Tools.syncGetter('user.level.ticket_max', notification)}{' '}
                            </Text>
                            <Text style={styles.infoItem}>
                                距离下一级升级还需: {Tools.syncGetter('user.next_level_exp', notification)}经验{' '}
                            </Text>
                        </View>
                    </View>
                )}
                {notification.type === 'ISSUE_PUBLISHED' && (
                    <View style={styles.item}>
                        <View style={styles.titleInfo}>
                            <Iconfont name={'task'} size={20} color={Theme.primaryColor} />
                            <Text style={styles.title}>系统通知</Text>
                        </View>
                        <View style={styles.bottomInfo}>
                            <Text style={[styles.text, { color: Theme.weixin }]}>您发布的内容已审核通过</Text>
                            <Text style={styles.infoItem}>悬赏：{Tools.syncGetter('gold', data)}智慧点 </Text>
                            <Text style={[styles.infoItem, { lineHeight: 20 }]}>
                                问题：{Tools.syncGetter('question.description', notification)}
                            </Text>
                            <Text style={styles.infoItem}>
                                专题：{Tools.syncGetter('question.category.name', notification)}{' '}
                            </Text>
                            <Text style={styles.infoItem}>
                                时间：{Tools.syncGetter('question.created_at', notification)}
                            </Text>
                        </View>
                    </View>
                )}
                {notification.type === 'COMMENT_ACCEPTED' && (
                    <View style={styles.item}>
                        <View style={styles.titleInfo}>
                            <Iconfont name={'setting1'} size={20} color={Theme.primaryColor} />
                            <Text style={styles.title}>系统通知</Text>
                        </View>
                        <View style={styles.bottomInfo}>
                            <Text style={[styles.text, { color: Theme.weixin }]}>您的回答已被采纳</Text>
                            <Text style={styles.infoItem}>奖励：{Tools.syncGetter('gold', data)}智慧点 </Text>
                            <Text style={[styles.infoItem, { lineHeight: 20 }]}>
                                问题：{Tools.syncGetter('question.description', notification)}
                            </Text>
                            <Text style={styles.infoItem}>
                                时间：{Tools.syncGetter('question.created_at', notification)}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    timeInfo: {
        alignItems: 'center',
        marginTop: 10,
    },
    timeBgc: {
        backgroundColor: '#D8D8D8',
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 2,
    },
    timeText: {
        color: Theme.white,
        fontSize: 12,
    },
    item: {
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 15,
        backgroundColor: Theme.white,
    },
    titleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        marginHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: Theme.tintGray,
    },
    title: {
        paddingLeft: 15,
        fontSize: 15,
        color: Theme.primaryFont,
    },
    bottomInfo: {
        paddingVertical: 15,
        marginHorizontal: 15,
    },
    text: {
        fontSize: 16,
        paddingBottom: 15,
        color: Theme.primaryFont,
        fontWeight: '500',
    },
    infoItem: {
        fontSize: 14,
        color: Theme.grey,
        paddingVertical: 3,
    },
    footer: {
        borderTopColor: Theme.lightBorder,
        borderTopWidth: 0.5,
        paddingVertical: 13,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default NotificationItem;
