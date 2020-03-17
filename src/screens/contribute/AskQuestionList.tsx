/*
 * @flow
 * created by wyk made in 2019-03-22 16:31:22
 */
'use strict';

import React, { Component, useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    Platform,
    View,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import {
    PageContainer,
    Iconfont,
    TouchFeedback,
    StatusView,
    Placeholder,
    CustomRefreshControl,
    ItemSeparator,
    ListFooter,
    Row,
} from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from 'utils';
import { compose, useQuery, Mutation, graphql, GQL } from 'apollo';
import { app } from 'store';
import { exceptionCapture } from 'common';

import AskQuestionItem from './components/AskQuestionItem';

const AskQuestionList = (props: any) => {
    const [finished, setFinished] = useState(false);

    const { data, loading, refetch, error, fetchMore } = useQuery(GQL.myVideoQuestionHistoryQuery, {
        variables: {
            limit: 10,
            QuestionFormEnumType: 'NON_SELECTION',
        },
        fetchPolicy: 'network-only',
    });

    const questions = Tools.syncGetter('user.questions', data);
    const user = Tools.syncGetter('user', data);
    return (
        <PageContainer hiddenNavBar loading={loading} empty={questions && questions.length < 1} error={error}>
            <FlatList
                contentContainerStyle={styles.container}
                data={questions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <AskQuestionItem
                        question={item}
                        user={user}
                        questions={questions}
                        navigation={props.navigation}
                        activeIndex={index}
                    />
                )}
                refreshControl={<CustomRefreshControl onRefresh={refetch} reset={() => setFinished(false)} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            offset: questions.length,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                            if (
                                !(
                                    fetchMoreResult &&
                                    fetchMoreResult.user &&
                                    fetchMoreResult.user.questions &&
                                    fetchMoreResult.user.questions.length > 0
                                )
                            ) {
                                setFinished(true);
                                return prev;
                            }
                            return Object.assign({}, prev, {
                                user: Object.assign({}, prev.user, {
                                    questions: [...prev.user.questions, ...fetchMoreResult.user.questions],
                                }),
                            });
                        },
                    });
                }}
                ListFooterComponent={() => <ListFooter finished={finished} />}
            />
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: PxFit(Theme.itemSpace),
        backgroundColor: '#fff',
    },
});

export default AskQuestionList;
