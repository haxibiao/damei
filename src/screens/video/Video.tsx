import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Image } from 'react-native';

import { GQL, useQuery, useLazyQuery, useMutation, useApolloClient } from 'apollo';
import { observer, app, config as configStore } from 'store';
import { exceptionCapture } from 'common';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Tools, Theme } from 'utils';

import VideoItem from './components/VideoItem';
import Footer from './components/Footer';
import RewardProgress from './components/RewardProgress';
import VideoStore from './VideoStore';
import CommentOverlay from '../comment/CommentOverlay';

import {DataCenter} from '../../data';

export default observer(props => {
    const client = useApolloClient();
    const firstAuthenticationQuery = useRef(false);
    const commentRef = useRef();
    const activeItem = useRef(0);
    const config = useRef({
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 95,
    });
    let navigation = DataCenter.navigation;


    VideoStore.showComment = useCallback(() => {
        if (app.login) {
            commentRef.current.slideUp();
        } else {
            if(navigation) navigation.navigate('Login');
        }
        // console.log('commentRef.current', commentRef.current);
    }, [commentRef]);

    const hideComment = useCallback(() => {
        commentRef.current.slideDown();
    }, [commentRef]);

    const onLayout = useCallback(event => {
        const { height } = event.nativeEvent.layout;
        VideoStore.viewportHeight = height;
    }, []);

    const VideosQuery = useCallback(() => {
        return app.client.query({
            query: GQL.VideosQuery,
            variables: { limit: 5, offset: VideoStore.dataSource.length },
        });
    }, [client]);

    const fetchData = useCallback(
        async ({ authentication }) => {
            VideoStore.isLoadMore = true;
            const [error, result] = await exceptionCapture(VideosQuery);
            console.log('result', result.data);
            const videoSource = Tools.syncGetter('data.videos', result);

            if (error) {
                VideoStore.isError = true;
            } else {
                if (Array.isArray(videoSource) && videoSource.length > 0) {
                    if (authentication) {
                        VideoStore.dataSource = videoSource;
                        firstAuthenticationQuery.current = false;
                    } else {
                        VideoStore.addSource(videoSource);
                    }
                } else {
                    VideoStore.isFinish = true;
                }
            }
            VideoStore.isLoadMore = false;
        },
        [VideosQuery],
    );

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            activeItem.current = info.viewableItems[0].index;
            VideoStore.viewableItemIndex = activeItem.current;
        }
    }, []);

    const onMomentumScrollEnd = useCallback(
        event => {
            if (VideoStore.dataSource.length - activeItem.current <= 3) {
                fetchData({ authentication: firstAuthenticationQuery.current });
            }
        },
        [fetchData],
    );

    useEffect(() => {
        fetchData({ authentication: firstAuthenticationQuery.current });
        let navWillBlurListener:any;
        let navWillFocusListener:any;
        if(navigation){
            navWillFocusListener = navigation.addListener('focus', () => {
                // if (VideoStore.viewableItemIndex < 0) {
                //     VideoStore.viewableItemIndex = 0;
                // }
            });
            navWillBlurListener = navigation.addListener('blur', () => {
                hideComment();
            });
        }

        return () => {
            if(navWillFocusListener) navWillFocusListener();
            if(navWillBlurListener) navWillBlurListener();
        };
    }, []);

    useEffect(() => {
        if (TOKEN) {
            firstAuthenticationQuery.current = true;
            fetchData({ authentication: firstAuthenticationQuery.current });
        }
    }, [TOKEN]);

    const question = VideoStore.dataSource[VideoStore.viewableItemIndex >= 0 ? VideoStore.viewableItemIndex : 0]
        ? VideoStore.dataSource[VideoStore.viewableItemIndex >= 0 ? VideoStore.viewableItemIndex : 0].question
        : {};

    return (
        <View style={styles.container} onLayout={onLayout}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'dark-content'} />
            <FlatList
                data={VideoStore.dataSource}
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
                scrollsToTop={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                pagingEnabled={true}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <VideoItem media={item} index={index} navigation={navigation} />}
                getItemLayout={(data, index) => ({
                    length: VideoStore.viewportHeight,
                    offset: VideoStore.viewportHeight * index,
                    index,
                })}
                ListEmptyComponent={
                    <View style={styles.cover}>
                        <Image style={styles.curtain} source={require('@src/assets/images/curtain.png')} />
                    </View>
                }
                ListFooterComponent={<Footer />}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onViewableItemsChanged={getVisibleRows}
                viewabilityConfig={config.current}
            />
            { !configStore.disableAd && (
                <View style={styles.rewardProgress}>
                    <RewardProgress />
                </View>
            )}

            <CommentOverlay ref={commentRef} question={question} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#131C1C',
        flex: 1,
    },
    cover: {
        ...StyleSheet.absoluteFill,
    },
    curtain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    rewardProgress: {
        position: 'absolute',
        right: 0,
        bottom: PxFit(344 + Theme.HOME_INDICATOR_HEIGHT),
    },
});
