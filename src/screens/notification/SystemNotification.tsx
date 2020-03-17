import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView, CustomRefreshControl } from 'components';
import { Theme, PxFit, Tools } from 'utils';

import { Query, withApollo, GQL } from 'apollo';
import { app } from 'store';

import SystemNotificationItem from './components/SystemNotificationItem';
import { useQuery } from 'apollo';

const SystemNotificaiton = props => {
    const [finished, setFinished] = useState(false);
    const { navigation } = props;
    const { data, loading, error, fetchMore, refetch } = useQuery(GQL.systemNotificationsQuery, {
        variables: {
            filter: [
                'WITHDRAW_SUCCESS',
                'WITHDRAW_FAILURE',
                'CURATION_REWARD',
                'QUESTION_AUDIT',
                'LEVEL_UP',
                'REPORT_SUCCEED',
                'COMMENT_ACCEPTED',
                'ISSUE_PUBLISHED',
            ],
        },
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        // effect;
        return () => {
            app.client.query({
                query: GQL.userUnreadQuery,
                variable: {
                    id: app.me.id,
                },
                fetchPolicy: 'network-only',
            });
        };
    }, [app.client]);

    console.log('data', data);
    const notifications = useMemo(() => Tools.syncGetter('notifications', data), [data]);
    console.log('notifications', notifications);
    console.log('finished', finished);
    return (
        <PageContainer title="系统通知" white error={error} empty={notifications && notifications.length === 0}>
            <FlatList
                style={{ backgroundColor: Theme.lightBorder }}
                data={notifications}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <SystemNotificationItem notification={item} navigation={navigation} user={app.me.id} />
                )}
                refreshControl={
                    <CustomRefreshControl refreshing={loading} onRefresh={refetch} reset={() => setFinished(false)} />
                }
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            offset: data.notifications.length,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                            console.log('fetchMoreResult', fetchMoreResult);
                            if (!(fetchMoreResult && fetchMoreResult.notifications.length > 0)) {
                                setFinished(true);
                                return prev;
                            }
                            return Object.assign({}, prev, {
                                notifications: [...prev.notifications, ...fetchMoreResult.notifications],
                            });
                        },
                    });
                }}
                ListFooterComponent={() => <ListFooter finished={finished} />}
            />
        </PageContainer>
    );
};

export default SystemNotificaiton;
