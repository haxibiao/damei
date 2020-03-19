import { StatusBar } from 'react-native';
/**
 *  安卓顶部导航栏高 Material Design 当前标准为56，市场常见为 48 ,
 *  ios顶部导航栏
 *      非刘海屏： 导航栏 44 , 状态栏 20 , tabBar 49
 *      刘海屏 : 导航栏 44 , 状态栏 20 , tabBar 88
 */
export const StatusBarHeight = StatusBar.currentHeight ?? 0;
export const TabBarHeight = 56; //同路由自定义底部导航栏高 

export const Android_NavBarHeight = 48;

export const IOS_NavBarHeight = 44;

