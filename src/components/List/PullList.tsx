/*
* @flow
* created by wyk made in 2018-12-11 09:12:40
*/
'use strict';

import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, FlatList, VirtualizedListProps, ActivityIndicator } from 'react-native';
import { Theme, PxFit } from '../../utils';
import EmptyView from '../StatusView/EmptyView';
import CustomRefreshControl from './CustomRefreshControl';
import ListFooter from './ListFooter';

function PullList(props: {
    waitingSpinnerSize?: number | 'small' | 'large',
    waitingSpinnerColor?: string | null | undefined,
    isRefreshing: boolean,
    finished: boolean,
    onRefresh: any,
    data: any,
    onFetchMore: any,
    ListFooterComponent: any,
    other: any,
    ListEmptyComponent: any,
    _flatList: any
}) {

    const contentContainerStyle = { flexGrow: 1 };
    const waitingSpinnerSize = props?.waitingSpinnerSize ?? 'small';
    const waitingSpinnerColor = props?.waitingSpinnerColor ?? Theme.primaryColor;
    const showsVerticalScrollIndicator = false;
    const onEndReachedThreshold = 0.2;
    let fetching = false;

    const [isRefreshing, setrefreshing] = useState(false);
    const [finished, setfinished] = useState(false);

    const onRefresh = async () => {
        // if (!this.props.onRefresh) return;
        // this.setState({ isRefreshing: true }, async () => {
        // 	await this.props.onRefresh();
        // 	this.setState({ isRefreshing: false });
        // });
        if (!props.onRefresh) return;
        await setrefreshing(true);
        await props.onRefresh();
        setrefreshing(false);
    };

    const onEndReached = () => {
        // let { data, onFetchMore } = this.props;
        if (props.data instanceof Array && props.data.length > 0 && props.onFetchMore && !fetching) {
            fetching = true;
            props.onFetchMore({
                fetched: () => (fetching = false),
                finished: () => {
                    setfinished(true);
                    fetching = false;
                }
            });
        } else {
            setfinished(true);
            fetching = false;
        }
    };

    const renderFooter = () => {
        // let { data, onFetchMore, ListFooterComponent } = this.props;
        if (props.ListFooterComponent) {
            return props.ListFooterComponent;
        } else if (props.data instanceof Array && props.data.length > 9 && props.onFetchMore) {
            return <ListFooter finished={props.finished} />;
        } else {
            return <View />;
        }
    };

    // let { data, ListEmptyComponent, ...other } = this.props;
    if (!props.ListEmptyComponent) {
        props.ListEmptyComponent = <EmptyView />;
    }

    return (
        <FlatList
            {...props.other}
            data={props.data}
            ref={ref => (props._flatList = ref)}
            refreshing={props.isRefreshing}
            refreshControl={
                <CustomRefreshControl refreshing={props.isRefreshing} onRefresh={onRefresh} />
            }
            onEndReached={onEndReached}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={props.ListEmptyComponent}
            keyExtractor={(item, index) => 'key_' + (item && item.id ? item.id : index)}
        />
    );
}

const styles = StyleSheet.create({
    footerView: {
        height: PxFit(40),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerViewText: {
        fontSize: PxFit(14),
        color: '#a0a0a0'
    }
});

export default PullList;