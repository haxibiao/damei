import React, { useState,useEffect } from 'react';
import { StatusBar, StyleSheet, Dimensions, ScrollView,View,Image, Animated, Text, TextStyle, ViewStyle,Platform } from 'react-native';
import HeaderBackButton from '../HeaderBackButton';
import DeviceInfo from 'react-native-device-info';
const { width, height } = Dimensions.get('window');
var StatusBarHeight = StatusBar.currentHeight ?? 0;// 状态栏高度

const PagePinnedBackground = '#ffffff';//最外层view的背景色 
const NavBackgroundColor = '#ffffff';// 导航栏的背景色
const ContentBackgroundColor = '#ffffff'; //内容容器背景色
interface BarStyle {
    'light-content':string;
    'dark-content': string;
    'default': string;
}

function isAndroid(){
    return Platform.OS == 'android';
}

function AdaptiveStatusBar(props:{scrollValue: Animated.Value,barStyle?:string}){
    useEffect(() => {
        let valueListener = props.scrollValue.addListener((state) => {
            console.log(state)

            if(state.value >= 50 && state.value <= 200) StatusBar.setBarStyle('dark-content');
            if(state.value <= 49) StatusBar.setBarStyle('light-content');
        })
        return () => {
            StatusBar.setBarStyle('default')
            props.scrollValue.removeListener(valueListener);
        };
    }, [])
    return <StatusBar  backgroundColor={'transparent'} barStyle={'default'}/>;
}

export default function PagePinned(props: {
    safe?: boolean;
    safeStatus?:boolean;
    header?: JSX.Element;
    children?: JSX.Element[] | JSX.Element;
    backgroundColor?: any;
    backgroundImage?: string;

    navBackgroundColor?:any;
    centerTitle?: string;
    leftTitle?: string;
    centerTitleStyle?: TextStyle;
    leftTitleStyle?: TextStyle;
    rightWidget?: JSX.Element;
    arrow?: boolean;
    barStyle?: keyof BarStyle;
    barBackground?: string;
    contentBackgroundColor?: string;

    navigation:any;
}) {

    const backgroundColor = props?.backgroundColor ?? PagePinnedBackground; //最外层view的背景色 
    const navBackgroundColor = props?.navBackgroundColor ?? NavBackgroundColor; // 导航栏的背景色
    const contentBackgroundColor = props?.contentBackgroundColor ?? ContentBackgroundColor; //内容容器背景颜色

    /**
     *  安卓顶部导航栏高 Material Design 当前标准为56，市场常见为 48 ,
     *  ios顶部导航栏 
     *      非刘海屏： 导航栏 44 , 状态栏 20 , tabBar 49
     *      刘海屏 : 导航栏 44 , 状态栏 20 , tabBar 83
     */

    //导航栏高度适配
    const NavBarHeight = isAndroid() ? 48 : 44 ; //安卓对应48，IOS对应44

    let MT = 0; //距离顶部高度，用来适配刘海屏手机

    const barStyle = props?.barStyle ?? (props?.barBackground == 'white' || !props?.barBackground) ? 'dark-content' : 'default';

    // 根据传入的属性配置状态栏样式
    StatusBar.setBarStyle(barStyle)

    const hasNotch = DeviceInfo.hasNotch();
    //判断 hasNotch。iPhone刘海高 34
    if (hasNotch) { 
        if (hasNotch) {
            MT = 34;
        }
    }

    /**
     *  状态栏安全预留高度，如果设置了 safeStatus 属性为false，则默认全屏，占据statusBar的位置。
     *  默认安卓下预留状态栏高度
     */
    const safeStatusHeight = () => {
        if(props?.safeStatus == true){
            return StatusBarHeight;
        }else{
            return 0;
        }
    }

    /**
     *  如果启用 safe 属性，则内容顶部将预留出 （导航栏高 + 状态栏高 : 前提是设置了状态栏透明）
     */
    const safePT:() => number = () => {
        let statusH = safeStatusHeight();
        let result = 0;
        if(Platform.OS == 'android'){
            result = props.safe ? NavBarHeight + statusH : statusH;
        }else if(Platform.OS == 'ios'){
            //TODO: 适配IOS下状态栏透明时距离顶部预留高度
        }
        return result;
    }

    //console.log('有刘海？',hasNotch,'距离顶部',MT)

    // 导航栏绝对定位的样式配置
    let position: ViewStyle = { position: "absolute", top: MT, left: 0, right: 0, zIndex: 10 };

    const [scrollY, setScrollY] = useState(new Animated.Value(0))

    return (
        <View style={{backgroundColor,flex:1 }}>

            <AdaptiveStatusBar scrollValue={scrollY} barStyle={barStyle}/>
            
            {props?.backgroundImage != undefined && <Image source={{ uri: props.backgroundImage }} style={styles.background} resizeMode={"cover"} />}

            {/*  头部导航栏  开始*/}
            <View style={[
                styles.body, 
                { minHeight: NavBarHeight+StatusBarHeight }, 
                position
                ]}>
                <Animated.View style={{ 
                    opacity: scrollY.interpolate({
                                inputRange: [0,40, 120],
                                outputRange: [0,0, 1]
                }), 
                position: 'absolute', 
                zIndex: -1, 
                height: NavBarHeight+StatusBarHeight, 
                width: width, 
                backgroundColor: navBackgroundColor 
                }}/>
                <View style={[{height:NavBarHeight},styles.leftWidgetContainer]}>
                    <HeaderBackButton navigation={props.navigation} arrow={props?.arrow ?? false}  color={'#f1f1f1'}/>
                    <Animated.View style={{
                        position:'absolute',left:0,
                        zIndex:1,
                        opacity: scrollY.interpolate({
                            inputRange: [0,40, 120],
                            outputRange: [0,0, 1]
                        })
                        }}>
                        <HeaderBackButton navigation={props.navigation} arrow={props?.arrow ?? false}  color={'#454545'}/>
                    </Animated.View>
                    <Text style={props?.leftTitleStyle ?? { marginStart: 5, fontSize: 18 }}>{props?.leftTitle ?? ''}</Text>
                </View>
                <Animated.View style={{
                        flex:2,
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent: 'center',
                        height:NavBarHeight,
                        opacity: scrollY.interpolate({
                            inputRange: [0,40, 120],
                            outputRange: [0,0, 1]
                        })
                    }}>
                    <Text style={props?.centerTitleStyle ?? { fontSize: 17, color: '#222' }}>
                        {props?.centerTitle ?? ''}
                    </Text>
                </Animated.View>
                <Animated.View style={{
                    height:NavBarHeight,
                    flex: 3,
                    flexDirection:'row',
                    justifyContent:'flex-end',
                    alignItems:'center',
                    opacity: scrollY.interpolate({
                        inputRange: [0,40, 120],
                        outputRange: [0,0, 1]
                    })
                }}>
                    {
                        props?.rightWidget ?? <View />
                    }
                </Animated.View>
            </View>
            {/*  头部导航栏  结束*/}

            <ScrollView
            contentContainerStyle={{marginTop: safePT(),backgroundColor:'transparent'}}
            onScroll={Animated.event([
                {
                    nativeEvent: {
                        contentOffset: {
                            y : scrollY
                        }
                    }
                }
            ])}
            bounces={false}
            showsVerticalScrollIndicator={false}
            >
                {props.children}
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        zIndex: -10
    },
    body: {
        width: width,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: 'transparent'
    },
    leftWidgetContainer: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
})