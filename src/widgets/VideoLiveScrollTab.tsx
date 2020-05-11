import React,{ useEffect,useState } from 'react';
import { View,Text, TextStyle, ViewStyle, StyleSheet,StatusBar,TouchableOpacity,Dimensions,Animated,NativeModules,Platform } from 'react-native';
const {width:sw,height:sh} = Dimensions.get('window');
const { StatusBarManager } = NativeModules;
const STATUSHEIGHT = StatusBar.currentHeight ?? 0;
const TABBUTTONW = sw * 0.15;
const TABHEIGHT = 35;
export default function VideoLiveScrollTab (props:{
    goToPage?: any,
    activeTab?: number,
    tabs?: Array<any>,
    backgroundColor?: string,
    activeTextColor?: string,
    inactiveTextColor?: string,
    textStyle?: TextStyle,
    tabStyle?: ViewStyle,
    renderTab?: any,
    underlineStyle?: ViewStyle,
}){

    let activeTextColor = props.activeTextColor ?? 'navy';
    let inactiveTextColor = props.inactiveTextColor ?? 'black';
    let backgroundColor = props.backgroundColor ?? 'transparent';
    let tabs = props.tabs ?? [];

    /**
     * 状态栏高度适配 ATag2 ( 返回安全视图高度，和状态栏高度适配合并在这里一起完成)
     */
    const [StatusHeight,setStatusHeight] = useState(0);
    useEffect(() => {
       
            if(Platform.OS == 'ios'){
                // 这里直接适配了IOS刘海屏
                StatusBarManager.getHeight( h => {
                    setStatusHeight(h.height);
                    console.log(h.height);
                });
            }else{
                // 适配Android
                setStatusHeight(STATUSHEIGHT);
            }
        
    },[])

    const renderTab = (name:string, page:number, isTabActive:boolean, onPressHandler:any) => {

        return (
            <TouchableOpacity
                activeOpacity={1} 
                key={page}
            style={{width:TABBUTTONW,height:TABHEIGHT,paddingTop:5,alignItems:'center'}}
            onPress={() => {onPressHandler(page)}}
            >
                <Text style={{color:props.activeTab == 0 ? 'white' : '#555',fontSize:17,fontWeight:'bold',textShadowColor:props.activeTab == 0 ? '#888' : 'transparent',textShadowRadius:props.activeTab == 0 ? 2 : 0}}>{name}</Text>
            </TouchableOpacity>
        )
    }

    const translateX = props.scrollValue.interpolate({
        inputRange:[0,1],
        outputRange:[-TABBUTTONW*0.48,TABBUTTONW*0.51]
    });

    return (
        <View style={[styles.tabs,{backgroundColor,marginTop:StatusHeight}]}>
            {
                tabs.map((name:string,page:number) => {
                    const isTabActive = props.activeTab === page;
                    return renderTab(name,page,isTabActive,props.goToPage)
                })
            }
            <Animated.View
            style={[
                styles.tabUnderlineStyle,
                {
                    backgroundColor: props.activeTab==0 ? 'white' : '#666',
                },
                {
                    transform:[
                        {translateX}
                    ]
                }
            ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    tab: {

    },
    tabs: {
        minHeight:TABHEIGHT,
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        position:'absolute',
        top:0,
    },
    tabUnderlineStyle: {
        position: 'absolute',
        width:  TABBUTTONW*0.4,
        height: 2,
        elevation:1,
        bottom: 4.6,
      }
})