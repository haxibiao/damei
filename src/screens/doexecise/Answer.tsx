import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing, ScrollView,TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { DataCenter, observer } from '../../data';
import { Page, Avatar,ScaleButton } from '../../widgets';
import { sw, sh } from '../../tools';
import LinearGradient from 'react-native-linear-gradient';
import { Icons, SvgIcon } from '../../res';

import AnimatedAnswerItem from './AnimatedAnswerItem';
import AnswerBottomBar from './AnswerBottomBar';

const WiseAndEnergyIconSize = 22; //智慧点、精力点图片尺寸
const CardHeight = sh * 0.7; //卡片高度
const CardWidth = sw * 0.88; //卡片宽度
const CardRadius = sw * 0.06; //卡片圆角大小
const CardInnerGap = CardWidth * 0.07; //卡片水平内边距

const ButtonWidth = CardWidth*0.7; //提交答案按钮宽
const ButtonHeight = ButtonWidth* 0.17; //按钮高度

const AvatarSize = sw * 0.13; //头像大小

const selections = [
     {
        "Text": "依法治国",
        "Value": "A"
      },
      {
        "Text": "建设廉洁政党",
        "Value": "B"
      },
      {
        "Text": "人心向背、事业成败",
        "Value": "C"
      },
      {
        "Text": "维护社会秩序",
        "Value": "D"
      }
]

/*****************
 * 渐变背景 Background 组件
 *****************
 */
const Background = () => {
    const { colors } = useTheme();

    return (
        <LinearGradient
            start={{ x: 0.5, y: 0.0 }}
            end={{ x: 0.5, y: 1.0 }}
            locations={[0.12, 0.63]}
            style={{ flex: 1, height: '100%', width: '100%', position: 'absolute', zIndex: -10 }}
            colors={[colors.primaryGradient, colors.secondaryGradient]}
        />
    )
}


/*****************
 * 顶部精力点、智慧点 值 组件
 *****************
 */
const WisePoint = observer((props: {
    textcolor: any
}) => {
    return <Text style={{ fontSize: 14, color: props.textcolor ?? '#000', marginStart: 8 }}>智慧点 {DataCenter.User?.me?.gold ?? 0}</Text>
});
const EnergyPoint = observer((props: {
    textcolor: any
}) => {
    return <Text style={{ fontSize: 14, color: props.textcolor ?? '#000', marginStart: 8 }}>精力点 {DataCenter.User?.me?.ticket ?? 0}</Text>
});

/*****************
 * 题目单选、多选标识组件
 *****************
 */
const TopBadge = React.memo((props: { multi: boolean }) => {
    return (
        <View style={{width:CardWidth,height:CardHeight*0.3,position:'absolute',top:0,zIndex:-1,overflow:'hidden'}}>
        <View style={{
            paddingVertical: 5,
            marginBottom: 8,
            width: sw * 0.3,
            backgroundColor: 'lightgreen',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [
                { rotate: '-45deg' },
                { translateX: -30 },
                { translateY: -12 }
            ]
        }}>
            <Text style={{ color: 'white' }}>{props.multi ? '多选' : '单选'}</Text>
        </View>
        </View>
    )
});


/**********************************
 * 
 * Answer 页面主体部分
 * 
 **********************************
 */
const Answer = (props: any) => {

    /******************************
     *  获取从上一个页面跳转过来传递的参数
     ******************************/
    const { route, navigation } = props;
    const PageTitle = route.params?.pagetitle ?? '测试数据';

    /******************************
    *  主题颜色
    ******************************/
    const { colors } = useTheme();

    useEffect(() => {

    }, [colors])

    return (
        <Page.PageCleared
            enableBack
            fixed
            navigation={navigation}
            backgroundColor='#a1a1a1'
            centerTitle={PageTitle}
            safe
            containerStyle={{ alignItems: 'center' }}
        >
            <Background />

            <View style={{ width: sw, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: Page.CONSTANTS.IOS_NavBarHeight, minHeight: 32, marginBottom: 10 }}>
                <View style={styles.row}>
                    <Image source={{ uri: 'diamond' }} style={{ height: WiseAndEnergyIconSize, width: WiseAndEnergyIconSize, marginBottom: 3.7 }} resizeMode={'contain'} />
                    <WisePoint textcolor={colors.primaryText} />
                </View>
                <View style={styles.row}>
                    <Image source={{ uri: 'heart' }} style={{ height: WiseAndEnergyIconSize, width: WiseAndEnergyIconSize }} resizeMode={'contain'} />
                    <EnergyPoint textcolor={colors.primaryText} />
                </View>
            </View>

            <Animated.View
                style={{
                    height: CardHeight,
                    width: CardWidth,
                    borderRadius: CardRadius,
                    shadowColor: 'black',
                    shadowRadius: 5,
                    shadowOpacity: 0.1,
                    shadowOffset: {
                        width: 0,
                        height: 5
                    },
                    backgroundColor: colors.answerCard,
                    transform: [
                        { translateX: 0 }
                    ]
                }}>
                    
                <TopBadge multi={true} />

                <ScrollView
                    contentContainerStyle={{ marginHorizontal: CardInnerGap }}
                >
                    <Avatar uri={'default_avatar'} size={AvatarSize} frameStyle={{ alignSelf: 'center', marginBottom: 10,marginTop:CardInnerGap }} />
                    <View style={{alignSelf:'center',marginBottom:14}}>
                        <Text style={{color:colors.primaryText,fontSize:14}}>小答妹</Text>
                    </View>

                    <View style={{marginBottom:15}}>
                        <Text style={{ color: colors.secondaryText, fontSize: 15 }}>
                        React Native (简称RN)是Facebook于2015年4月开源的跨平台移动应用开发框架，是Facebook早先开源的JS框架 React 在原生移动应用平台的衍生产物，支持iOS和安卓两大平台。RN使用Javascript语言，类似于HTML的JSX，以及CSS来开发移动应用，因此熟悉Web前端开发的技术人员只需很少的学习就可以进入移动应用开发领域。
                        </Text>
                    </View>

                    {
                        selections.map((value,index) => {

                            return (
                                <AnimatedAnswerItem value={value}/>
                            )
                        })
                    }
                </ScrollView>

                <ScaleButton 
                style={[styles.submitButton,{backgroundColor:colors.submitButton}]} 
                callback={() => {}}
                frameStyle={{position:'absolute',bottom:CardHeight*0.04,alignSelf:'center'}}
                >
                    <Text style={{fontSize:16,color:colors.secondaryText}}>提交答案</Text>
                </ScaleButton>
            </Animated.View>

            <AnswerBottomBar />
            
        </Page.PageCleared>
    )
}

export default Answer;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    submitButton:{
        height:ButtonHeight,
        width:ButtonWidth,
        borderRadius:ButtonHeight,
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center'
    }
})