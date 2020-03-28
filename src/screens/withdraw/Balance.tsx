import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PageContainer, ListFooter, EmptyView, CustomRefreshControl } from 'components';
import { Tools } from 'utils';

import BalanceItem from './components/BalanceItem';
import { GQL, useQuery } from 'apollo';

const Balance = () => {
    const [finished, setFinished] = useState(false);
    const { data, loading, error, refetch, fetchMore } = useQuery(GQL.TransactionsQuery);
    console.log('====================================');
    console.log(error, data, GQL);
    console.log('====================================');
    const transactions = Tools.syncGetter('transactions', data);
    return (
        <PageContainer
            white
            title="余额明细"
            refetch={refetch}
            error={error}
            loading={loading}
            empty={transactions && transactions.length === 0}
            EmptyView={<EmptyView imageSource={require('../../assets/images/default_message.png')} />}>
            <View style={styles.container}>
                <FlatList
                    data={transactions}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <CustomRefreshControl
                            refreshing={loading}
                            onRefresh={refetch}
                            reset={() => setFinished(false)}
                        />
                    }
                    renderItem={({ item }) => <BalanceItem item={item} />}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => {
                        fetchMore({
                            variables: {
                                offset: transactions.length,
                            },
                            updateQuery: (prev, { fetchMoreResult }) => {
                                if (
                                    !(
                                        fetchMoreResult &&
                                        fetchMoreResult.transactions &&
                                        fetchMoreResult.transactions.length > 0
                                    )
                                ) {
                                    setFinished(true);
                                    return prev;
                                }
                                return Object.assign({}, prev, {
                                    transactions: [...prev.transactions, ...fetchMoreResult.transactions],
                                });
                            },
                        });
                    }}
                    ListFooterComponent={() => <ListFooter finished={finished} />}
                />
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default Balance;
