/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 11:04:28
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image, Animated } from 'react-native';

import { Button, Row, Iconfont, TouchFeedback } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, ISIOS } from 'utils';

import { Mutation, compose, graphql, GQL } from 'apollo';
import { app } from 'store';

class TaskItem extends Component {
    constructor(props) {
        super(props);
        this.taskDetail = null;
        this.state = {
            heart: require('../../../assets/images/heart.png'),
            diamond: require('../../../assets/images/diamond.png'),
            rotateValue: new Animated.Value(0),
            fadeValue: new Animated.Value(0),
            showTaskDetail: false,
        };
    }

    componentDidMount() {
        // this.state.rotateValue.setValue(0);
        // Animated.timing(this.state.rotateValue, {
        // 	toValue: 180,
        // 	duration: 800
        // }).start(); // 开始spring动画
    }

    // 领取奖励
    taskReward = async () => {
        const { task, user, handlerLoading } = this.props;
        let result = {};
        handlerLoading();
        try {
            result = await this.props.TaskRewardMutation({
                variables: {
                    task_id: task.id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.TasksQuery,
                    },
                    {
                        query: GQL.UserQuery,
                        variables: { id: app.me.id },
                    },
                ],
            });
        } catch (error) {
            result.errors = error;
        }
        if (result && result.errors) {
            handlerLoading();
            const str = result.errors.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
        } else {
            handlerLoading();
            if (result.data.taskReward == 1) {
                Toast.show({ content: '领取成功' });
            } else {
                Toast.show({ content: '已经领取奖励了哦~' });
            }
        }
    };

    // 领取任务
    receiveTask = async () => {
        const { task, user, handlerLoading, type, navigation } = this.props;
        let result = {};
        handlerLoading();
        try {
            result = await this.props.ReceiveTaskMutation({
                variables: {
                    task_id: task.id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.TasksQuery,
                    },
                    {
                        query: GQL.UserQuery,
                        variables: { id: app.me.id },
                    },
                ],
            });
        } catch (error) {
            result.errors = error;
        }
        if (result && result.errors) {
            handlerLoading();
            const str = result.errors.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
        } else {
            handlerLoading();
            if (result.data.receiveTask == 1) {
                Toast.show({ content: '领取成功' });
                if (type == 2) {
                    navigation.navigate('任务详情', { task: task });
                }
            } else {
                Toast.show({ content: '已经领取该任务了哦~' });
            }
        }
    };

    _showTask = () => {
        const { navigation, reword, handler, user, task, handleHeight } = this.props;
        const taskAction = task.taskAction ? task.taskAction : task.taskStatus; // 兼容系统任务里的taskStatus

        switch (taskAction) {
            case -1:
                return (
                    <Button
                        title={'任务失败'}
                        style={styles.redButton}
                        textColor={Theme.secondaryColor}
                        fontSize={13}
                        onPress={() => {
                            navigation.navigate('失败详情', {
                                task: task,
                            });
                        }}
                    />
                );
                break;
            case null:
                return (
                    <Button
                        title={'领取'}
                        style={styles.themeButton}
                        titleStyle={styles.buttonTitleStyle}
                        textColor={Theme.white}
                        onPress={this.receiveTask}
                    />
                );
                break;
            case 0:
                return (
                    <Button
                        title={task.submit_name}
                        titleStyle={styles.buttonTitleStyle}
                        style={styles.themeButton}
                        textColor={Theme.white}
                        onPress={handler}
                    />
                );
                break;
            case 1:
                return (
                    <Button
                        title={'审核中'}
                        style={styles.themeButton}
                        titleStyle={styles.buttonTitleStyle}
                        textColor={Theme.white}
                        fontSize={13}
                        onPress={() => {
                            Toast.show({
                                content: '正在努力审核中。。',
                            });
                        }}
                    />
                );
                break;
            case 2:
                return (
                    <Button
                        title={'领取奖励'}
                        style={styles.themeButton}
                        titleStyle={styles.buttonTitleStyle}
                        textColor={Theme.white}
                        onPress={this.taskReward}
                    />
                );
                break;
            case 3:
                return <Button title={'已完成'} disabled style={styles.greyButton} textColor={Theme.grey} />;
                break;
            case 4:
                return (
                    <Button
                        title={'去出题'}
                        style={styles.themeButton}
                        titleStyle={styles.buttonTitleStyle}
                        textColor={Theme.white}
                        onPress={handler}
                    />
                );
                break;
            case 5:
                return (
                    <Button
                        title={'看视频'}
                        style={styles.themeButton}
                        titleStyle={styles.buttonTitleStyle}
                        textColor={Theme.white}
                        onPress={handler}
                    />
                );
                break;
            case 6:
                return (
                    <Button
                        title={'去阅读'}
                        outline
                        style={styles.themeButton}
                        titleStyle={styles.buttonTitleStyle}
                        textColor={Theme.white}
                        onPress={handler}
                    />
                );
                break;
            case 7:
                return (
                    <Button
                        title={'领现金'}
                        outline
                        style={styles.themeButton}
                        titleStyle={styles.buttonTitleStyle}
                        textColor={Theme.white}
                        onPress={handler}
                    />
                );
                break;
            case 8:
                return (
                    <Button
                        title={'去好评'}
                        outline
                        style={styles.themeButton}
                        titleStyle={styles.buttonTitleStyle}
                        textColor={Theme.white}
                        onPress={handler}
                    />
                );
                break;
        }
    };

    _showReward = task => {
        if (task.type == 4) {
            if (ISIOS) {
                return (
                    <View style={styles.reword}>
                        <Image source={this.state.heart} style={{ width: PxFit(18), height: PxFit(18) }} />
                        <Text style={styles.rewordText}>+{task.ticket}</Text>
                    </View>
                );
            }
            return (
                <View style={styles.reword}>
                    {task.ticket > 0 && (
                        <View style={styles.reword}>
                            <Image source={this.state.heart} style={{ width: PxFit(18), height: PxFit(18) }} />
                            <Text style={styles.rewordText}>+{task.ticket}</Text>
                        </View>
                    )}

                    {task.gold > 0 && (
                        <View style={styles.reword}>
                            <Image source={this.state.diamond} style={{ width: PxFit(18), height: PxFit(18) }} />
                            <Text style={styles.rewordText}>{task.gold > 0 ? '+' + task.gold : ''}</Text>
                        </View>
                    )}

                    {task.contribute > 0 && (
                        <View style={styles.reword}>
                            <Image
                                source={require('../../../assets/images/gongxian.png')}
                                style={{ width: PxFit(14), height: PxFit(14) }}
                            />
                            <Text style={styles.rewordText}>{task.contribute > 0 ? '+' + task.contribute : ''}</Text>
                        </View>
                    )}
                </View>
            );
        }
        if (task.type == 3) {
            return (
                <View style={styles.reword}>
                    <View style={styles.reword}>
                        <Image source={this.state.diamond} style={{ width: PxFit(18), height: PxFit(18) }} />
                        <Text style={styles.rewordText}>
                            {task.gold > 0 ? `+${task.gold}~20` : ''}
                            {task.contribute > 0 ? `+${task.contribute}` : ''}
                        </Text>
                    </View>
                </View>
            );
        }

        if (task.type == 6) {
            return (
                <View style={styles.reword}>
                    <View style={styles.reword}>
                        {task.ticket > 0 && (
                            <View style={styles.reword}>
                                <Image source={this.state.heart} style={{ width: PxFit(18), height: PxFit(18) }} />
                                <Text style={styles.rewordText}>+{task.ticket}</Text>
                            </View>
                        )}

                        {task.gold > 0 && (
                            <View style={styles.reword}>
                                <Image source={this.state.diamond} style={{ width: PxFit(18), height: PxFit(18) }} />
                                <Text style={styles.rewordText}>{task.gold > 0 ? '+' + task.gold : ''}</Text>
                            </View>
                        )}

                        {task.contribute > 0 && (
                            <View style={styles.reword}>
                                <Image
                                    source={require('../../../assets/images/gongxian.png')}
                                    style={{ width: PxFit(14), height: PxFit(14) }}
                                />
                                <Text style={styles.rewordText}>
                                    {task.contribute > 0 ? '+' + task.contribute : ''}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            );
        }
        return (
            <Row>
                {this.showNormalReward(task)}
                {this._showRewardTicket(task)}
                {this._showContribute(task)}
            </Row>
        );
    };

    showNormalReward = task => {
        if (task.gold > 0) {
            return (
                <View style={styles.reword}>
                    <Image source={this.state.diamond} style={{ width: PxFit(18), height: PxFit(18) }} />
                    <Text style={styles.rewordText}>{`+${task.gold}`}</Text>
                </View>
            );
        }
    };

    _showRewardTicket = task => {
        if (task.ticket < 0) {
            return (
                <View style={styles.reword}>
                    <Image source={this.state.heart} style={{ width: PxFit(18), height: PxFit(18) }} />
                    <Text style={styles.rewordText}>{`${task.ticket}`}</Text>
                </View>
            );
        }
        if (task.ticket > 0) {
            return (
                <View style={styles.reword}>
                    <Image source={this.state.heart} style={{ width: PxFit(18), height: PxFit(18) }} />
                    <Text style={styles.rewordText}>{`+${task.ticket}`}</Text>
                </View>
            );
        }
    };

    _showContribute = task => {
        if (task.contribute > 0) {
            return (
                <View style={styles.reword}>
                    <Image
                        source={require('../../../assets/images/gongxian.png')}
                        style={{ width: PxFit(14), height: PxFit(14) }}
                    />
                    <Text style={styles.rewordText}>{`+${task.contribute}`}</Text>
                </View>
            );
        }
    };

    _showTaskDetail = task => {
        if (this.state.showTaskDetail) {
            return (
                <Animated.View style={[styles.taskDetail, { opacity: this.state.fadeValue }]}>
                    {this._showTaskContent(task)}
                </Animated.View>
            );
        }

        // 任务详情由后端返回较好
    };

    _showTaskContent = task => {
        if (task.type == 6) {
            return <Text style={styles.taskDetailText}>{`点击领现金查看详情`}</Text>;
        }
        if (task.type == 4) {
            return (
                <Text style={styles.taskDetailText}>
                    看完视频才可获取精力点奖励,
                    {(task.contribute > 0 || task.gold) && (
                        <Text>点击下载、查看详情才能够获取智慧点或贡献点奖励。</Text>
                    )}
                    同时每天的看视频次数有上限。
                </Text>
            );
        }
        if (task.type == 3) {
            return (
                <Text
                    style={
                        styles.taskDetailText
                    }>{`出题被审核通过才能获取奖励。出题添加更加详细的解析会获取最高的奖励哦，没有解析将只能获得${
                    task.gold
                }智慧点的奖励。恶意刷题和乱出解析将会受到惩罚哦！`}</Text>
            );
        }
        if (task.type == 1) {
            return <Text style={styles.taskDetailText}>{`${task.name}即可领取奖励`}</Text>;
        }
        if (task.type == 0) {
            return <Text style={styles.taskDetailText}>{`${task.name}保存个人资料,即可领取奖励`}</Text>;
        }
        if (task.type == 2) {
            return <Text style={styles.taskDetailText}>{task.details}</Text>;
        }
    };

    showTaskDetail = () => {
        const { showTaskDetail } = this.state;

        if (showTaskDetail) {
            this.state.rotateValue.setValue(180);
            Animated.timing(this.state.rotateValue, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();

            this.setState({
                showTaskDetail: false,
            });
        } else {
            this.state.rotateValue.setValue(0);
            this.state.fadeValue.setValue(0);
            Animated.timing(this.state.rotateValue, {
                toValue: 180,
                duration: 400,
                useNativeDriver: true,
            }).start(); // 开始spring动画
            Animated.timing(this.state.fadeValue, {
                toValue: 1,
                duration: 400,
            }).start();
            this.setState({
                showTaskDetail: true,
            });
        }
    };

    render() {
        const { navigation, reword, handler, user, task, handleHeight, goTask, min_level } = this.props;
        const { RewarVisible, showTaskDetail } = this.state;
        return (
            <View>
                <TouchFeedback
                    // activeOpacity={0.6}
                    // disabled={task.type == 2 ? false : true}
                    style={styles.container}
                    onPress={() => {
                        if (task.type == 3) {
                            if (user.level.level < min_level) {
                                Toast.show({
                                    content: `${min_level}级之后才可以出题哦`,
                                });
                            } else {
                                navigation.navigate('Contribute', { category: {} });
                            }
                        }
                        if (task.type == 4) {
                            goTask && goTask();
                        }
                    }}>
                    <Row>
                        <Text style={styles.name}>{task.name}</Text>
                        <Row>{this._showReward(task)}</Row>
                    </Row>

                    <Row>
                        {this._showTask()}
                        <TouchFeedback onPress={this.showTaskDetail} style={styles.taskRight}>
                            <Animated.Image
                                style={{
                                    width: 20,
                                    height: 20,
                                    transform: [
                                        {
                                            rotate: this.state.rotateValue.interpolate({
                                                inputRange: [0, 180],
                                                outputRange: ['0deg', '180deg'],
                                            }),
                                        },
                                    ],
                                }}
                                source={require('../../../assets/images/down.png')}
                            />
                        </TouchFeedback>
                    </Row>
                </TouchFeedback>
                {this._showTaskDetail(task)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonTitleStyle: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(14),
        fontWeight: 'bold',
    },
    container: {
        marginLeft: PxFit(15),
        paddingVertical: PxFit(12),
        // borderTopWidth: PxFit(1),
        // borderTopColor: Theme.lightBorder,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greyButton: {
        backgroundColor: Theme.borderColor,
        borderRadius: PxFit(16),
        height: PxFit(32),
        width: PxFit(80),
    },
    name: {
        color: '#3c3c3c',
        fontSize: PxFit(15),
    },
    redButton: {
        borderColor: Theme.secondaryColor,
        borderRadius: PxFit(45),
        borderWidth: PxFit(1),
        height: PxFit(32),
        width: PxFit(84),
    },
    reword: {
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: PxFit(3),
    },
    rewordText: {
        color: Theme.primaryColor,
        fontSize: PxFit(13),
        fontWeight: '200',
    },
    taskDetail: {
        backgroundColor: Theme.borderColor,
        borderRadius: PxFit(10),
        marginBottom: PxFit(10),
        marginHorizontal: PxFit(15),
        paddingHorizontal: PxFit(10),
        paddingVertical: PxFit(10),
    },
    taskDetailText: {
        color: Theme.primaryFont,
        fontSize: PxFit(12),
        letterSpacing: 1,
        lineHeight: 18,
    },
    taskRight: {
        paddingLeft: 5,
        paddingRight: 15,
        paddingVertical: PxFit(5),
    },
    themeButton: {
        backgroundColor: Theme.primaryColor,
        borderRadius: PxFit(16),
        height: PxFit(32),
        width: PxFit(80),
    },
});

export default compose(
    graphql(GQL.TaskRewardMutation, { name: 'TaskRewardMutation' }),
    graphql(GQL.ReceiveTaskMutation, { name: 'ReceiveTaskMutation' }),
)(TaskItem);
