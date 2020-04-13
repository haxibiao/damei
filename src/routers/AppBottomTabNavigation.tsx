import React from 'react';
import { sw, Adp } from "../tools";
import { Animated,Text,View,TouchableOpacity,StyleSheet,Image,Platform,PixelRatio } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icons,SvgIcon } from '../res';

function dp(want_px: number) {
    let fontscale = PixelRatio.getFontScale();
    let out = (1.0 / fontscale) * want_px;
    return out;
}

const Dimens = {
    x34: dp(34),
    x62: dp(64),
    BottomTab_borderTop: 0,
    BottomTab_tabIconSize: dp(28),
    BottomTab_tabHeight: 56,
    BottomTab_paddingTop: 6,
    BottomTab_svgScale: 0.028,
};
const Colors = {
    BottomTab_TopBorder : '#f1f1f1',
    BottomTab_color : '#ffffff',
    BottomTab_TextKind_bg : '#ffffff',
    BottomTab_TextKind_text : '#8d8d8d',
    BottomTab_TextKind_textSelected : '#000000',
    clear: 'transparent',
    black22: '#222222'
}

/**
 *  引入底部导航tab的页面
 */
import TabOne from '../screens/video/indexs'; //视频刷、直播
import TabTwo from '../screens/home'; //答题页
import TabThree from '../screens/task'; //任务、分红
import TabFour from '../screens/profile'; //我的页

const BottomTab = createBottomTabNavigator();

// 底部导航路由名

const One = "学习";
const Two = "答题";
const Three = "任务";
const Four = "我的";
const PUBLIC = "DMPUblish";
//发布按钮页占位组件,实际跳转到 StackNavigator 中注册的 导航
const PublicPlaceHolder = () => <View />

//  底部导航图标模式（png、svg） a.png a_selected.png | Icons.Ant_Home_Fill Icons.Ant_Home
const icons_unfocused: any[] = ['ic_tab_study','ic_tab_message','ic_tab_task','ic_tab_mine'];
const icons_focused: any[] = ['ic_tab_study_selected','ic_tab_message_selected','ic_tab_task_selected','ic_tab_mine_selected'];


export default function AppBottomTabNavigation() {

    return (
        <BottomTab.Navigator
            initialRouteName={One}
            lazy={false}
            tabBar={(props: any) => <BottomTabBar {...props} />}>
            <BottomTab.Screen name={One} component={TabOne} />
            <BottomTab.Screen name={Two} component={TabTwo} />

            <BottomTab.Screen name={PUBLIC} component={PublicPlaceHolder} />

            <BottomTab.Screen name={Three} component={TabThree} />
            <BottomTab.Screen name={Four} component={TabFour} />
        </BottomTab.Navigator>
    );
}

/**
 * 自定义【文字图标】底部导航条
 */
function BottomTabBar({ state, descriptors, navigation,enableShadow }:{state:any,descriptors:any,navigation:any,enableShadow:boolean}) {
    let routes = state.routes; // 底部导航路由数组

    /**
     *  map函数，返回底部导航item数组
     */
    const _tabs = () =>
        routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key]; //每个BottomTab.Screen 的可选属性

            const label =
                options.tabBarLabel != undefined
                    ? options.tabBarLabel
                    : options.title != undefined
                        ? options.title
                        : route.name;

            const isFocused = state.index === index; //当前tab是否获得焦点

            const onPress = () => {
                const event = navigation.emit({
                    type: "tabPress",
                    target: route.key
                }); // 发送底部tab被点击的事件通知
                if (!isFocused && !event.defaultPrevented){
                    if(route.name == PUBLIC){
                        // 点击发布按钮
                    }else{
                        navigation.navigate(route.name);
                    }
                }
            };

            const onLongPress = () => { };


            /** 
             *  使用svg图片的tab icon
             */
            const _tabIconSvg = () => {
                switch (route.name) {
                    case One:
                        return <SvgIcon name={isFocused ? icons_focused[0] : icons_unfocused[0]} size={Dimens.BottomTab_tabIconSize} scale={Dimens.BottomTab_svgScale} />
                    case Two:
                        return <SvgIcon name={isFocused ? icons_focused[1] : icons_unfocused[1]} size={Dimens.BottomTab_tabIconSize} scale={Dimens.BottomTab_svgScale} />
                    case Four:
                        return <SvgIcon name={isFocused ? icons_focused[2] : icons_unfocused[2]} size={Dimens.BottomTab_tabIconSize} scale={Dimens.BottomTab_svgScale} />
                    case Four:
                        return <SvgIcon name={isFocused ? icons_focused[3] : icons_unfocused[3]} size={Dimens.BottomTab_tabIconSize} scale={Dimens.BottomTab_svgScale} />
                
                }
            }

            /**
             *  使用图片形式的tab icon
             */
            const _tabIconPng = () => {
                if (icons_focused.length <= 0) {
                    return;
                }
                switch (route.name) {
                    case One:
                        return <Image source={{uri: isFocused ? icons_focused[0] : icons_unfocused[0]}} style={{ height: Dimens.x34, width: Dimens.x34 }} resizeMode={"contain"} />
                    case Two:
                        return <Image source={{uri: isFocused ? icons_focused[1] : icons_unfocused[1]}} style={{ height: Dimens.x34, width: Dimens.x34 }} resizeMode={"contain"} />
                    case PUBLIC:
                        return <Image source={{ uri: 'ic_ring_menu' }} style={{ height: Dimens.x34 * 1.6, width: Dimens.x34 * 1.6, marginTop: Dimens.x34 * 0.42 }} resizeMode={'contain'} />
                    case Three:
                        return <Image source={{uri: isFocused ? icons_focused[2] : icons_unfocused[2]}} style={{ height: Dimens.x34, width: Dimens.x34 }} resizeMode={"contain"} />
                    case Four:
                        return <Image source={{uri: isFocused ? icons_focused[3] : icons_unfocused[3]}} style={{ height: Dimens.x34, width: Dimens.x34 }} resizeMode={"contain"} />
                
                }
            }
            return (
                <TouchableOpacity
                    activeOpacity={1.0}
                    key={index}
                    onPress={onPress}
                    style={{ flex: 1, justifyContent: "center", alignItems: "center",marginTop:-6 }}>
                    {
                        _tabIconPng()
                    }
                    {/* {
                        _tabIconSvg()
                    } */}
                    <Text style={{ color: isFocused ? '#FAE030' : '#aaa' , fontSize:11 }}>
                        {label === PUBLIC ? '' : label}
                    </Text>
                </TouchableOpacity>
            )
        }
        );

    /**
     *  返回自定义底部导航栏组件
     */
    const fullScreen = state.index == -1;

    return (
        <View style={fullScreen ? styles.fullscreen_Tab : [styles.normal_Tab, enableShadow ? styles.Tab_shadow : {}]}>
            <View style={[{ backgroundColor: Colors.clear }, styles.tabContainer]}>
                {
                    _tabs()
                }
            </View>
        </View>
    );
}

/**
 * 自定义【文字】底部导航条
 */
function BottomTabBarPureTextKind({ state, descriptors, navigation,enableShadow }:{state:any,descriptors:any,navigation:any,enableShadow?:boolean}) {
    let routes = state.routes; // 底部导航路由数组

    /**
     *  map函数，返回底部导航item数组
     */
    const _tabs = () =>
        routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key]; //每个BottomTab.Screen 的可选属性

            const label =
                options.tabBarLabel != undefined
                    ? options.tabBarLabel
                    : options.title != undefined
                        ? options.title
                        : route.name;

            const isFocused = state.index === index; //当前tab是否获得焦点

            const onPress = () => {
                const event = navigation.emit({
                    type: "tabPress",
                    target: route.key
                }); // 发送底部tab被点击的事件通知
                if (!isFocused && !event.defaultPrevented)
                    navigation.navigate(route.name);
            };

            const onLongPress = () => {
                //TODO: 长按事件
            };

            return (
                <TouchableOpacity
                    activeOpacity={1.0}
                    key={index}
                    onPress={onPress}
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{
                        color: isFocused ? Colors.BottomTab_TextKind_textSelected : Colors.BottomTab_TextKind_text ,
                        fontSize: 17,
                        fontWeight: 'bold'
                    }}>
                        {label}
                    </Text>
                </TouchableOpacity>
            )
        }
        );

    //启用全屏模式（底部栏漂浮）
    const fullScreen = state.index == -1;

    return (
        <View style={fullScreen ? styles.fullscreen_Tab : [styles.normal_Tab_Textkind,enableShadow ? styles.Tab_shadow : {}]}>
            <View style={[
                { backgroundColor: Colors.clear, paddingTop: Dimens.BottomTab_paddingTop },
                styles.tabContainer_Textkind]}
            >
                {
                    _tabs()
                }
            </View>
        </View>
    );
}

/**
 * 自定义【图标】底部导航条
 */
function BottomTabBarPureImageKind({ state, descriptors, navigation,enableShadow }:{state:any,descriptors:any,navigation:any,enableShadow?:boolean}) {
    let routes = state.routes; // 底部导航路由数组

    /**
     *  map函数，返回底部导航item数组
     */
    const _tabs = () =>
        routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key]; //每个BottomTab.Screen 的可选属性

            const label =
                options.tabBarLabel != undefined
                    ? options.tabBarLabel
                    : options.title != undefined
                        ? options.title
                        : route.name;

            const isFocused = state.index === index; //当前tab是否获得焦点

            const onPress = () => {
                const event = navigation.emit({
                    type: "tabPress",
                    target: route.key
                }); // 发送底部tab被点击的事件通知
                if (!isFocused && !event.defaultPrevented)
                    navigation.navigate(route.name);
            };

            const onLongPress = () => {
                //TODO: 长按事件
            };


            /** TAG1
             *  使用svg图片的tab icon
             */
            const _tabIconSvg = () => {
                switch (route.name) {
                    case One:
                        return <SvgIcon name={isFocused ? icons_focused[0] : icons_unfocused[0]} size={Dimens.BottomTab_tabIconSize} scale={Dimens.BottomTab_svgScale} />
                    case Two:
                        return <SvgIcon name={isFocused ? icons_focused[1] : icons_unfocused[1]} size={Dimens.BottomTab_tabIconSize} scale={Dimens.BottomTab_svgScale} />
                    case Four:
                        return <SvgIcon name={isFocused ? icons_focused[2] : icons_unfocused[2]} size={Dimens.BottomTab_tabIconSize} scale={Dimens.BottomTab_svgScale} />
                }
            }

            /**
             *  使用图片形式的tab icon
             */
            const _tabIconPng = () => {
                if (icons_focused.length <= 0) {
                    return;
                }
                switch (route.name) {
                    case One:
                        return <Image source={{uri:isFocused ? icons_focused[0] : icons_unfocused[0]}} style={{ height: Dimens.x62, width: Dimens.x62 }} resizeMode={"contain"} />
                    case Two:
                        return <Image source={{uri:isFocused ? icons_focused[1] : icons_unfocused[1]}} style={{ height: Dimens.x62, width: Dimens.x62 }} resizeMode={"contain"} />
                    case Three:
                        return <Image source={{uri:isFocused ? icons_focused[2] : icons_unfocused[2]}} style={{ height: Dimens.x62, width: Dimens.x62 }} resizeMode={"contain"} />
                    case Four:
                        return <Image source={{uri:isFocused ? icons_focused[3] : icons_unfocused[3]}} style={{ height: Dimens.x62, width: Dimens.x62 }} resizeMode={"contain"} />
                }
            }
            return (
                <TouchableOpacity
                    activeOpacity={1.0}
                    key={index}
                    onPress={onPress}
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {
                        _tabIconPng()
                    }
                    {/* {
                        _tabIconSvg()
                    } */}
                </TouchableOpacity>
            )
        }
        );

    /**
     *  返回自定义底部导航栏组件
     */
    const fullScreen = state.index == -1;

    return (
        <View style={fullScreen ? styles.fullscreen_Tab : styles.normal_Tab}>
            <View style={[{ backgroundColor: Colors.clear, paddingTop: Dimens.BottomTab_paddingTop }, styles.tabContainer]}>
                {
                    _tabs()
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        width: sw,
        flexDirection: 'row',
        height: Dimens.BottomTab_tabHeight,
        borderTopColor: Colors.BottomTab_TopBorder,
        borderTopWidth: Dimens.BottomTab_borderTop,
    },
    tabContainer_Textkind: {
        width: sw,
        flexDirection: 'row',
        height: Dimens.BottomTab_tabHeight,
    },
    fullscreen_Tab: {
        position: 'absolute',
        zIndex: 10,
        bottom: 0,
        paddingBottom: Adp.BottomUnsafeAreaPadding,
        backgroundColor: Colors.clear
    },
    normal_Tab: {
        paddingBottom: Adp.BottomUnsafeAreaPadding,
        backgroundColor: Colors.BottomTab_color
    },
    normal_Tab_Textkind: {
        paddingBottom: Adp.BottomUnsafeAreaPadding,
        backgroundColor: Colors.BottomTab_TextKind_bg
    },
    Tab_shadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.16,
                shadowRadius: 10,
                shadowOffset:{x:0,y:5}
            },
            android: {
                elevation: 9
            }
        })
    }
})