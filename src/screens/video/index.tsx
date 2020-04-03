import React,{useEffect,useState} from 'react';
import {View,Text} from 'react-native';
import {Page,VideoLiveScrollTab} from '../../widgets';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Video from './Video';
import LiveList from '../live';

export default function VideoPlayground(props){

    return (
        <Page.PageCleared barStyle={'light-content'}>
            <ScrollableTabView
            tabBarPosition='overlayTop'
            renderTabBar={() => <VideoLiveScrollTab/> }
            >
                <Video tabLabel="推荐"/>
                <LiveList tabLabel='直播' navigation={props.navigation}/>
            </ScrollableTabView>
        </Page.PageCleared>
    )
}