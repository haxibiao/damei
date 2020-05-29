import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PageContainer, ListFooter, EmptyView, CustomRefreshControl } from 'components';
import { Tools } from 'utils';

import BalanceItem from './components/BalanceItem';
import { GQL, useQuery } from 'apollo';

const Balance = () => {
    const [finished, setFinished] = useState(false);
    const { data, loading, error, refetch, fetchMore } = useQuery(GQL.TransactionsQuery);
    const transactions = Tools.syncGetter('transactions.data', data);
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
                        if (data.transactions.paginatorInfo.hasMorePages) {
                            fetchMore({
                                variables: {
                                    page: ++data.transactions.paginatorInfo.currentPage
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    return {
                                        transactions: {
                                            ...fetchMoreResult.transactions,
                                            data: [ ...prev.transactions.data, ...fetchMoreResult.transactions.data]
                                        }
                                    }
                                }
                            })
                        } else {
                            setFinished(true);
                        }
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
