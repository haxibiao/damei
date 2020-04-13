import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Image } from 'react-native';

import { GQL, useQuery, useLazyQuery, useMutation, useApolloClient } from 'apollo';
import { observer, app } from 'store';
import { exceptionCapture } from 'common';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Tools, Theme } from 'utils';

import VideoItem from './components/VideoItem';
import Footer from './components/Footer';
import RewardProgress from './components/RewardProgress';
import VideoStore from './VideoStore';
import CommentOverlay from '../comment/CommentOverlay';
import { useNavigation } from '@react-navigation/native'

export default observer(props => {
    const { navigation,route } = props;
    const data = route.params?.questions;
    const activeIndex = route.params?.index;
    // console.log('data', data);
    const [questions, setQuestions] = useState(data);
    const [viewportHeight, setViewportHeight] = useState(SCREEN_HEIGHT);

    const commentRef = useRef();

    const config = useRef({
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 95,
    });

    const onLayout = useCallback(event => {
        const { height } = event.nativeEvent.layout;
        setViewportHeight(height);
    }, []);

    const VideosQuery = useCallback(() => {
        console.log('VideoStore.dataSource.length', VideoStore.dataSource.length);
        return app.client.query({
            query: GQL.myVideoQuestionHistoryQuery,
            variables: { limit: 5, offset: questions.length },
        });
    }, [app.client]);

    const fetchData = useCallback(async () => {
        VideoStore.isLoadMore = true;
        const [error, result] = await exceptionCapture(VideosQuery);
        console.log('result', result.data);
        const videoSource = Tools.syncGetter('data.videos', result);

        if (error) {
            VideoStore.isError = true;
        } else {
            if (Array.isArray(videoSource) && videoSource.length > 0) {
                VideoStore.addSource(videoSource);
            } else {
                VideoStore.isFinish = true;
            }
        }
        VideoStore.isLoadMore = false;
    }, [VideosQuery]);

    const onMomentumScrollEnd = useCallback(
        event => {
            // if (VideoStore.dataSource.length - activeItem.current <= 3) {
            //     fetchData();
            // }
        },
        [fetchData],
    );

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            activeItem.current = info.viewableItems[0].index;
            VideoStore.viewableItemIndex = activeItem.current;
        }
    }, []);

    console.log('data', data);

    return (
        <View style={styles.container} onLayout={onLayout}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'dark-content'} />
            <FlatList
                data={questions}
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
                scrollsToTop={false}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={activeIndex}
                keyboardShouldPersistTaps="always"
                pagingEnabled={true}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <VideoItem media={item.video} index={index} viewportHeight={viewportHeight} />
                )}
                getItemLayout={(data, index) => ({
                    length: viewportHeight,
                    offset: viewportHeight * index,
                    index,
                })}
                ListEmptyComponent={
                    <View style={styles.cover}>
                        <Image style={styles.curtain} source={require('@src/assets/images/curtain.png')} />
                    </View>
                }
                ListFooterComponent={<Footer />}
                onMomentumScrollEnd={onMomentumScrollEnd}
                // onViewableItemsChanged={getVisibleRows}
                viewabilityConfig={config.current}
            />
            <View style={styles.rewardProgress}>
                <RewardProgress />
            </View>
            {/* <CommentOverlay ref={commentRef} question={question} /> */}
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
