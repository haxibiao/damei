/*
 * @flow
 * created by wyk made in 2018-12-06 17:06:35
 */
import React from 'react';
import { Platform, Image } from 'react-native';
import { StackNavigator, TabBarBottom, createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/home';
import TaskScreen from '../screens/task';
// import NotificationScreen from '../screens/notification';
import VideoScreen from '../screens/video';

import ProfileScreen from '../screens/profile';
import MainTabBar from './MainTabBar';
import { Theme, PxFit } from '../utils';
import { Iconfont } from '../components';

export default createBottomTabNavigator(
    {
        学习: {
            screen: VideoScreen,
            navigationOptions: () => TabOptions('学习'),
        },
        答题: {
            screen: HomeScreen,
            navigationOptions: () => TabOptions('答题'),
        },
        任务: {
            screen: TaskScreen,
            navigationOptions: () => TabOptions('任务'),
        },
        我的: {
            screen: ProfileScreen,
            navigationOptions: () => TabOptions('我的'),
        },
    },
    {
        initialRouteName: '学习',
        lazy: false,
        backBehavior: 'none',
        tabBarComponent: MainTabBar,
        tabBarOptions: {
            safeAreaInset: {
                bottom: 'always',
                top: 'never',
            },
            showLabel: false,
            activeTintColor: Theme.primaryColor,
            inactiveTintColor: Theme.subTextColor,
        },
        navigationOptions: ({ navigation }) => {
            const { routes } = navigation.state;
            const params = routes ? routes[navigation.state.index].params : null;

            const headerTitle = params ? params.title : '';

            const headerTitleStyle = {
                color: 'white',
                flex: 1,
                textAlign: 'center',
            };
            const headerBackTitle = null;
            const headerTintColor = 'white';
            const headerStyle = {
                backgroundColor: 'white',
                shadowColor: 'transparent',
                shadowOpacity: 0,
                borderBottomWidth: 0,
                borderBottomColor: 'transparent',
                elevation: 0,
            };
            const header = null;
            return {
                swipeEnabled: true,
                headerTitle,
                headerStyle,
                headerTitleStyle,
                headerBackTitle,
                headerTintColor,
                header,
            };
        },
    },
);

const TabOptions = routeName => {
    const title = routeName;
    const tabBarIcon = ({ focused }: { focused: boolean }) => {
        let source;
        switch (routeName) {
            case '学习':
                source = focused
                    ? require('../assets/images/ic_tab_study_selected.png')
                    : require('../assets/images/ic_tab_study.png');
                break;
            case '答题':
                source = focused
                    ? require('../assets/images/ic_tab_message_selected.png')
                    : require('../assets/images/ic_tab_message.png');
                break;
            case '任务':
                source = focused
                    ? require('../assets/images/ic_tab_task_selected.png')
                    : require('../assets/images/ic_tab_task.png');
                break;
            case '我的':
                source = focused
                    ? require('../assets/images/ic_tab_mine_selected.png')
                    : require('../assets/images/ic_tab_mine.png');
                break;
        }
        return <Image source={source} style={{ width: PxFit(32), height: PxFit(32) }} />;
    };
    const tabBarVisible = true;
    return { title, tabBarVisible, tabBarIcon };
};
