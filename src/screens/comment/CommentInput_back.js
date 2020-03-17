/*
 * @flow
 * created by wyk made in 2019-04-01 21:22:39
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Keyboard, DeviceEventEmitter } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { TouchFeedback, Iconfont, CustomTextInput, SafeText, Avatar, Row } from 'components';

import { Mutation, compose, withApollo, graphql, GQL } from 'apollo';
import { app } from 'store';
class CommentInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            defaultText: props.count_comments > 2 ? '写评论...' : '写回答...',
        };
    }

    update = (cache, { data: { createComment } }) => {
        let { questionId } = this.props;
        console.log('accepted: false', createComment);
        let prev = cache.readQuery({
            query: GQL.questionCommentsQuery,
            variables: {
                commentable_type: 'questions',
                commentable_id: questionId,
                limit: 10,
            },
        });
        console.log('comments: [{ ...createComment, accepted: false }, ...prev.comments]', {
            comments: [{ ...createComment }, ...prev.comments],
        });
        cache.writeQuery({
            query: GQL.questionCommentsQuery,
            variables: {
                commentable_type: 'questions',
                commentable_id: questionId,
                limit: 10,
            },
            data: { comments: [{ ...createComment }, ...prev.comments] },
        });
    };

    updateChild = (cache, { data: { createComment } }) => {
        let { comment_id, parent_comment_id } = this.props;
        let prev = cache.readQuery({
            query: GQL.childCommentQuery,
            variables: {
                comment_id: parent_comment_id ? parent_comment_id : comment_id,
                limit: 1,
            },
        });

        cache.writeQuery({
            query: GQL.childCommentQuery,
            variables: {
                commentable_type: 'comments',
                comment_id: parent_comment_id ? parent_comment_id : comment_id,
                limit: 1,
            },
            data: {
                comments: [
                    {
                        id: parent_comment_id ? parent_comment_id : comment_id,
                        comments_count: prev.comments[0].comments_count + 1,
                        __typename: 'Comment',
                        comments: [{ ...createComment }, ...prev.comments[0].comments],
                    },
                ],
            },
        });
    };

    onCompleted = comment => {
        this.props.onCommented();
        Toast.show({ content: '评论成功', layout: 'top' });
    };

    onError = error => {
        let str = error.toString().replace(/Error: GraphQL error: /, '');
        Toast.show({ content: str });
    };

    onChangeText = text => {
        this.setState({ content: text });
    };

    onCommentedRefetchQueries = result => [
        {
            query: GQL.questionCommentsQuery,
            variables: {
                commentable_id: this.props.questionId,
                limit: 10,
            },
        },
    ];

    render() {
        const {
            questionId,
            navigation,
            style,
            textInputRef,
            hideModal,
            reply,
            comment_id,
            createComment,
            createChildComment,
            parent_comment_id,
            count_comments,
        } = this.props;
        const { content, defaultText } = this.state;
        let disabled = !content || !content.trim();

        console.log('parent_comment_id', parent_comment_id);
        return (
            <View style={{ height: PxFit(60), backgroundColor: '#FFF', justifyContent: 'center' }}>
                <View style={[styles.footerBar, style]}>
                    <Row>
                        <Iconfont name={'write'} size={16} color={'#C0CBD4'} />
                        <CustomTextInput
                            textInputRef={textInputRef}
                            placeholder={reply ? reply : defaultText}
                            style={styles.textInput}
                            value={content}
                            onChangeText={this.onChangeText}
                        />
                    </Row>
                    <TouchFeedback
                        disabled={disabled}
                        style={styles.touchItem}
                        onPress={() => {
                            this.onCompleted(null);
                            comment_id
                                ? createChildComment({
                                      variables: {
                                          content: content && content.trim(),
                                          commentable_id: questionId,
                                          comment_id: comment_id,
                                          commentable_type: 'comments',
                                      },
                                      update: this.updateChild,
                                      optimisticResponse: {
                                          __typename: 'Mutation',
                                          createComment: {
                                              __typename: 'Comment',
                                              id: -1,
                                              user: app.me,
                                              content,
                                              time_ago: '刚刚',
                                              liked: false,
                                              count_likes: 0,
                                              reply: null,
                                              // comments: [] //数组乐观更新操作暂时还存在问题
                                          },
                                      },
                                  })
                                : createComment({
                                      variables: {
                                          content: content && content.trim(),
                                          commentable_id: questionId,
                                          comment_id: comment_id,
                                          commentable_type: 'questions',
                                      },
                                      update: this.update,
                                      optimisticResponse: {
                                          __typename: 'Mutation',
                                          createComment: {
                                              __typename: 'Comment',
                                              id: -1,
                                              user: app.me,
                                              content,
                                              time_ago: '刚刚',
                                              liked: false,
                                              comments_count: 0,
                                              count_likes: 0,
                                              //   accepted: false,
                                              // comments: [] //数组乐观更新操作暂时还存在问题
                                          },
                                      },
                                  });
                            this.setState({ content: '' });
                            Keyboard.dismiss();
                            hideModal();
                        }}>
                        <Iconfont
                            name="plane-fill"
                            size={PxFit(22)}
                            color={!disabled ? Theme.boyColor : Theme.subTextColor}
                        />
                    </TouchFeedback>
                    {/*	<Mutation
				mutation={createCommentMutation}
				// onCompleted={this.onCompleted}
				onError={this.onError}
				// refetchQueries={this.onCommentedRefetchQueries}
			>
				{addComment => {
					return (
				
					);
				}}
			</Mutation>
			*/}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    footerBar: {
        height: PxFit(40),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: PxFit(10),
        paddingHorizontal: PxFit(14),
        paddingVertical: PxFit(5),
        // borderTopWidth: PxFit(1),
        // borderTopColor: Theme.borderColor,
        borderRadius: PxFit(20),
        backgroundColor: '#F9F9FB',
    },
    textInput: {
        // flex: 1,
        width: SCREEN_WIDTH - PxFit(100),
        // paddingVertical: PxFit(10),
        paddingLeft: PxFit(5),
        // paddingRight: PxFit(20),
    },
    touchItem: {
        width: PxFit(40),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

export default compose(
    withApollo,
    graphql(GQL.createCommentMutation, { name: 'createComment' }),
    graphql(GQL.createChildCommentMutation, { name: 'createChildComment' }),
)(CommentInput);
