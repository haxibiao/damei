import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Page, VideoLiveScrollTab } from '../../widgets';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Video from './Video';
import LiveList from '../live';
import { observer, DataCenter } from '../../data';
import { config } from 'store';
import LoginMountPoint from '../../data/LoginMountPoint';

import VideoStore from './VideoStore';

const VideoPlayground = (props: any) => {
    const [currentPage, setcurrentPage] = useState(0);

    const tabHandler = (e) => {
        setcurrentPage(e.i);
        if (e.i == 1) {
            VideoStore.setOnLiveTab(true);
        } else {
            VideoStore.setOnLiveTab(false);
        }
    };

    return (
        <Page.PageCleared barStyle={'light-content'}>
            {config.disableAd ? (
                <Video tabLabel='推荐' />
            ) : (
                <ScrollableTabView
                    tabBarPosition='overlayTop'
                    onChangeTab={tabHandler}
                    renderTabBar={() => <VideoLiveScrollTab />}
                >
                    <Video tabLabel='推荐' />
                    <LiveList tabLabel='直播' navigation={props.navigation} inCurrent={currentPage == 1} />
                </ScrollableTabView>
            )}
        </Page.PageCleared>
    );
};

export default observer(VideoPlayground);
