/*
 * @flow
 * created by wyk made in 2019-04-15 17:33:41
 */

import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    Row,
    ListItem,
    CustomSwitch,
    ItemSeparator,
    PopOverlay,
    CustomRefreshControl,
    ListFooter,
    StatusView,
    PullChooser,
} from 'components';
import { Theme, PxFit, Tools, SCREEN_WIDTH, NAVBAR_HEIGHT } from 'utils';
import { app } from 'store';
import { GQL, useQuery } from 'apollo';

import UserProfile from './components/UserProfile';
import QuestionItem from './components/QuestionItem';
import AskQuestionItem from '../contribute/components/AskQuestionItem';
import Placeholder from './components/Placeholder';

const index = (props: Props) => {
    const { navigation,route } = props;
    const user = route.params?.user ?? {};
    const [orderByHot, setOrderByHot] = useState(false);
    const [finished, setFinished] = useState(false);

    const ORDER = ['ANSWERS_COUNT', 'CREATED_AT'];

    const { data, error, loading, refetch, fetchMore } = useQuery(GQL.UserInfoQuery, {
        variables: {
            id: user.id,
            order: orderByHot ? ORDER[0] : ORDER[1],
            filter: 'publish',
            QuestionFormEnumType: 'ALL',
        },
        fetchPolicy: 'network-only',
    });

    const showOptions = () => {
        const user = route.params?.user ?? {};

        PullChooser.show([
            {
                title: '举报',
                onPress: () => navigation.navigate('ReportUser', { user }),
            },
            {
                title: '加入黑名单',
                onPress: () => {
                    setTimeout(() => {
                        Toast.show({ content: '该用户已加入黑名单' });
                    }, 500);
                },
            },
        ]);
    };

    const dataUser = Tools.syncGetter('user', data);

    if (!dataUser) {
        return <Placeholder />;
    }

    return (
        <PageContainer
            refetch={refetch}
            error={error}
            title={user.name + '的主页'}
            white
            rightView={
                user.id == app.me.id ? null : (
                    <TouchFeedback onPress={showOptions} style={styles.optionsButton}>
                        <Iconfont name="more-horizontal" color={Theme.defaultTextColor} size={PxFit(18)} />
                    </TouchFeedback>
                )
            }>
            <FlatList
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
                }}
                style={styles.container}
                data={dataUser.questions}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <UserProfile
                        user={dataUser}
                        hasQuestion={dataUser.questions.length > 0}
                        navigation={navigation}
                        switchOrder={() => setOrderByHot(!orderByHot)}
                        orderByHot={orderByHot}
                    />
                }
                ListEmptyComponent={<StatusView.EmptyView title="空空如也，没有出过题目" />}
                renderItem={({ item, index }) => (
                    <View style={{ paddingHorizontal: PxFit(Theme.itemSpace) }}>
                        <AskQuestionItem
                            question={item}
                            user={user}
                            questions={dataUser.questions}
                            activeIndex={index}
                            navigation={props.navigation}
                        />
                    </View>
                )}
                refreshControl={<CustomRefreshControl onRefresh={refetch} reset={() => setFinished(false)} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            offset: dataUser.questions.length,
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
                ListFooterComponent={() =>
                    dataUser.questions.length == 0 ? <View /> : <ListFooter finished={finished} />
                }
            />
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
    },
    header: {
        backgroundColor: '#fff',
        left: 0,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        width: SCREEN_WIDTH,
    },
    optionsButton: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        width: PxFit(40),
    },
});

export default index;
