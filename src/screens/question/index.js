/*
 * @flow
 * created by wyk made in 2019-03-25 10:52:46
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Animated, StatusBar, Image } from 'react-native';
import { PageContainer, TouchFeedback, PopOverlay, Iconfont, PullChooser, EmptyView, Player } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, Tools, ISIOS } from 'utils';

import QuestionOptions from './components/QuestionOptions';
import UserInfo from './components/UserInfo';
import QuestionBody from './components/QuestionBody';
import AnswerBar from './components/AnswerBar';
import Explain from './components/Explain';
import VideoExplain from './components/VideoExplain';
import AuditUsers from './components/AuditUsers';
import CommentOverlay from '../comment/CommentOverlay';
import FooterBar from './components/FooterBar';
import AnswerPlaceholder from '../answer/components/AnswerPlaceholder';
import ChooseOverlay from '../answer/components/ChooseOverlay';

import { Query, compose, graphql, GQL } from 'apollo';
import { observer, inject, app, config } from 'store';

@observer
class index extends Component {
    constructor(props) {
        super(props);
        this._animated = new Animated.Value(0);
        this.state = {
            submitting: false,
            min_level: 2,
        };
    }

    componentDidMount() {
        Animated.timing(this._animated, {
            toValue: 1,
            duration: 400,
        }).start();
    }

    showComment = () => {
        this._commentOverlay && this._commentOverlay.slideUp();
    };

    hideComment = () => {
        this._commentOverlay && this._commentOverlay.slideDown();
    };

    deleteQuestion = async () => {
        const { navigation, deleteQuestionMutation } = this.props;
        this.setState({
            submitting: true,
        });
        try {
            await deleteQuestionMutation({
                variables: {
                    id: this.question.id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.mySubmitQuestionHistoryQuery,
                        fetchPolicy: 'network-only',
                    },
                ],
            });
            this.setState({
                submitting: false,
            });
            Toast.show({
                content: '删除成功',
            });
            navigation.goBack();
        } catch (error) {
            this.setState({
                submitting: false,
            });
            const str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({
                content: '删除失败，' + str,
            });
        }
    };

    removeQuestion = async () => {
        const { navigation, removeQuestionMutation } = this.props;
        this.setState({
            submitting: true,
        });
        try {
            await removeQuestionMutation({
                variables: {
                    id: this.question.id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.mySubmitQuestionHistoryQuery,
                        fetchPolicy: 'network-only',
                    },
                ],
            });
            this.setState({
                submitting: false,
            });
            Toast.show({
                content: '撤回成功',
            });
            navigation.goBack();
        } catch (error) {
            this.setState({
                submitting: false,
            });
            const str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({
                content: '撤回失败，' + str,
            });
        }
    };

    onPublish = async () => {
        const { navigation, publishQuestion } = this.props;
        this.setState({
            submitting: true,
        });
        try {
            await publishQuestion({
                variables: {
                    id: this.question.id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.mySubmitQuestionHistoryQuery,
                        fetchPolicy: 'network-only',
                    },
                ],
            });
            this.setState({
                submitting: false,
            });
            Toast.show({
                content: '发布成功',
            });
            navigation.goBack();
        } catch (error) {
            this.setState({
                submitting: false,
            });
            const str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({
                content: '发布失败，' + str,
            });
        }
    };

    onRemove = () => {
        if (String(this.question.status) === '1') {
            PopOverlay({
                content: '撤回后将会扣除该题所得贡献,确定撤回吗？',
                onConfirm: this.removeQuestion,
            });
        } else {
            this.removeQuestion();
        }
    };

    onDelete = () => {
        PopOverlay({
            content: '确定删除该题目吗？',
            onConfirm: this.deleteQuestion,
        });
    };

    showOptions = () => {
        const { navigation, data } = this.props;
        const strategy = {
            master: {
                '-3': [
                    {
                        title: '发布',
                        onPress: this.onPublish,
                    },
                    {
                        title: '删除',
                        onPress: this.onDelete,
                    },
                ],
                '-2': [
                    {
                        title: '删除',
                        onPress: this.onDelete,
                    },
                ],
                '-1': [
                    {
                        title: '删除',
                        onPress: this.onDelete,
                    },
                ],
                '0': [
                    {
                        title: '撤回',
                        onPress: this.onRemove,
                    },
                ],
                '1': [
                    {
                        title: '撤回',
                        onPress: this.onRemove,
                    },
                ],
            },
            visitor: [
                {
                    title: '举报',
                    onPress: () =>
                        Toast.show({
                            content: '举报成功，感谢反馈',
                        }),
                },
            ],
        };
        const chooser = this.isOwn ? strategy.master[String(this.question.status)] : strategy.visitor;
        // PullChooser.show(chooser);
        this.isOwn || ISIOS
            ? PullChooser.show(chooser)
            : ChooseOverlay.show(this.question, navigation, this.question.category, this.state.min_level, data.user);
    };

    render() {
        const { submitting } = this.state;
        const { navigation, questionQuery,route } = this.props;
        const referrer = route.params?.referrer ?? null;
        const bodyStyle = {
            opacity: this._animated,
            transform: [
                {
                    translateY: this._animated.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-SCREEN_WIDTH, 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };
        const footerStyle = {
            opacity: this._animated,
            transform: [
                {
                    translateY: this._animated.interpolate({
                        inputRange: [0, 1],
                        outputRange: [PxFit(80), 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };
        this.question = Tools.syncGetter('question', questionQuery);
        if (!this.question) {
            return (
                <PageContainer title="题目详情">
                    <AnswerPlaceholder />
                </PageContainer>
            );
        }
        const { id, selections_array, answer, status, user, explanation, video, category } = this.question;
        this.isOwn = user.id === app.me.id;
        console.log('this.question', this.question);
        return (
            <React.Fragment>
                <PageContainer
                    title="题目详情"
                    submitting={submitting}
                    submitTips="loading..."
                    onWillBlur={this.hideComment}
                    navigation={this.props.navigation}
                    error={questionQuery.error}
                    refetch={questionQuery.refetch}
                    rightView={
                        status == 1 || this.isOwn ? (
                            <TouchFeedback style={styles.optionsButton} onPress={this.showOptions}>
                                <Iconfont name="more-horizontal" color="#fff" size={PxFit(18)} />
                            </TouchFeedback>
                        ) : null
                    }
                    hiddenNavBar={config.isFullScreen}>
                    {config.isFullScreen && <StatusBar translucent={true} hidden />}
                    {status == 1 || this.isOwn ? (
                        <View
                            style={{
                                flex: 1,
                            }}>
                            <ScrollView
                                contentContainerStyle={styles.scrollStyle}
                                keyboardShouldPersistTaps="always"
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                                scrollEnabled={!config.isFullScreen}>
                                <View style={styles.content}>
                                    <Animated.View style={[{ marginHorizontal: PxFit(Theme.itemSpace) }, bodyStyle]}>
                                        <UserInfo question={this.question} navigation={navigation} />
                                        <QuestionBody question={this.question} />
                                    </Animated.View>
                                    {video && video.url && (
                                        <Player style={{ marginTop: PxFit(Theme.itemSpace) }} video={video} />
                                    )}
                                    <View
                                        style={{
                                            marginHorizontal: PxFit(Theme.itemSpace),
                                            marginTop: PxFit(20),
                                        }}>
                                        <QuestionOptions
                                            questionId={id}
                                            selections={selections_array}
                                            onSelectOption={this.selectOption}
                                            submited
                                            answer={referrer === 'user' && !this.isOwn ? null : answer}
                                        />
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: PxFit(Theme.itemSpace), zIndex: -1 }}>
                                    <AnswerBar
                                        isShow={referrer !== 'user' && !this.isOwn}
                                        question={this.question}
                                        navigation={navigation}
                                    />
                                    <VideoExplain video={Tools.syncGetter('video', explanation)} />
                                    <Explain
                                        text={Tools.syncGetter('content', explanation)}
                                        picture={Tools.syncGetter('images.0.path', explanation)}
                                    />
                                    <AuditUsers
                                        question={this.question}
                                        navigation={navigation}
                                        isCreator={this.isOwn}
                                    />
                                </View>
                            </ScrollView>
                            {!config.isFullScreen && (
                                <Animated.View style={footerStyle}>
                                    <FooterBar
                                        navigation={navigation}
                                        question={this.question}
                                        showComment={this.showComment}
                                        oSubmit={this.onSubmit}
                                        isOwn={this.isOwn}
                                    />
                                </Animated.View>
                            )}
                        </View>
                    ) : (
                        <EmptyView title="题目不存在或已下架" />
                    )}
                </PageContainer>
                <CommentOverlay ref={ref => (this._commentOverlay = ref)} question={this.question} />
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    answerText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(15),
        marginBottom: PxFit(5),
    },
    content: {
        marginBottom: PxFit(Theme.itemSpace),
        paddingTop: PxFit(20),
    },
    curationText: {
        color: Theme.subTextColor,
        fontSize: PxFit(13),
    },
    errorText: {
        color: Theme.errorColor,
        fontSize: PxFit(13),
        paddingLeft: PxFit(5),
    },
    optionsButton: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        width: PxFit(40),
    },
    optionsText: {
        color: Theme.secondaryColor,
        fontSize: PxFit(15),
        textAlign: 'center',
    },
    scrollStyle: {
        backgroundColor: '#fefefe',
        flexGrow: 1,
    },
});

export default compose(
    graphql(GQL.deleteQuestionMutation, {
        name: 'deleteQuestionMutation',
    }),
    graphql(GQL.removeQuestionMutation, {
        name: 'removeQuestionMutation',
    }),
    graphql(GQL.publishQuestion, {
        name: 'publishQuestion',
    }),
    graphql(GQL.QuestionQuery, {
        options: props => ({ variables: { id: props.route.params?.question?.id ?? '' } }),
        name: 'questionQuery',
    }),
    graphql(GQL.UserMeansQuery, {
        options: props => ({ variables: { id: app.me.id } }),
    }),
)(index);
