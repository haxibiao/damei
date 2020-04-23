import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing, ScrollView, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { DataCenter, observer } from '../../data';
import { GQL } from '../../network';
import { Page, Avatar, ScaleButton, HocStatusWidget, FadeInWidget } from '../../widgets';
import { sw, sh } from '../../tools';
import LinearGradient from 'react-native-linear-gradient';
import { Icons, SvgIcon } from '../../res';
import { ApolloClient } from 'apollo-boost';
import Video from 'react-native-video';

import AnimatedAnswerItem from './AnimatedAnswerItem';
import AnswerBottomBar from './AnswerBottomBar';
import ExerciseStore from './ExerciseStore';

import * as ShowResult from './AnswerResultModal';

const WiseAndEnergyIconSize = 22;           //智慧点、精力点图片尺寸
const CardHeight = sh * 0.7;                //卡片高度
const CardWidth = sw * 0.88;                //卡片宽度
const CardRadius = sw * 0.06;               //卡片圆角大小
const CardInnerGap = CardWidth * 0.07;      //卡片水平内边距

const CardInnerGapEnd = CardWidth * 0.05    //卡片水平内边距（右）

const ButtonWidth = CardWidth * 0.7; //提交答案按钮宽
const ButtonHeight = ButtonWidth * 0.17; //按钮高度

const VideoWidth = CardWidth - CardInnerGapEnd * 2;
const VideoHeight = VideoWidth * 3/4 ;

const AvatarSize = sw * 0.13; //头像大小

const CorrectAnswerColor = '#328E2A';
const TextColor = '#8F8D8D';


let client: ApolloClient<unknown>; //旧后端client


/*****************
 * 渐变背景 Background 组件
 *****************
 */
const Background = observer(() => {
    const { colors } = useTheme();

    useEffect(() => {
        return () => {
            //返回上一个页面前重置答题store里的数据
            ExerciseStore.reset();
        }
    }, [])

    return (
        <LinearGradient
            start={{ x: 0.5, y: 0.0 }}
            end={{ x: 0.5, y: 1.0 }}
            locations={[0.12, 0.63]}
            style={{ flex: 1, height: '100%', width: '100%', position: 'absolute', zIndex: -10 }}
            colors={[colors.primaryGradient, colors.secondaryGradient]}
        />
    )
});


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
        <FadeInWidget>
            <View style={{ width: CardWidth, height: CardHeight * 0.3, position: 'absolute', top: 0, zIndex: -1, overflow: 'hidden' }}>
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
                    <Text style={{ color: '#333', fontSize: 13, fontWeight: '300' }}>{props.multi ? '多选' : '单选'}</Text>
                </View>
            </View>
        </FadeInWidget>
    )
});

/**
 * 动画题目主干
 */
const AnimatedQuestionBody = React.memo((props: { colors: any, text: string }) => {
    return (
        <FadeInWidget>
            <Text style={{ color: props?.colors.secondaryText, fontSize: 15 }}>{props?.text ?? ''}</Text>
        </FadeInWidget>
    )
});
/**
 * 动画用户姓名
 */
const AnimatedUserName = React.memo((props: { colors: any, name: string }) => {
    return (
        <FadeInWidget >
            <Text style={{ color: props?.colors?.primaryText ?? '#333', fontSize: 14 }}>{props?.name ?? ''}</Text>
        </FadeInWidget>
    )
});
/**
 * 动画用户头像
 */
const AnimatedUserAvatar = React.memo((props: { avatar: string }) => {
    return (
        <FadeInWidget>
            <Avatar uri={props?.avatar ?? 'default_avatar'} size={AvatarSize} frameStyle={{ alignSelf: 'center', marginBottom: 10, marginTop: CardInnerGap }} />
        </FadeInWidget>
    )
});

/**
 *  动画视频题视频组件
 */
const AnimatedVideo = React.memo((props:{uri:string,frame:{width:number,height:number}}) => {
    
    const [pause,setpause] = useState(false);

    useEffect(() => {

        return () => {
            setpause(true);
        }
    },[])
    
    let w = props.frame?.width ?? 0;
    let h = props.frame?.height ?? 0;

    let s = {};
    if(w != 0 && h != 0){
        console.log('宽高都存在',w,h);
        let tempw = w;
        w = VideoWidth;
        h = h * VideoWidth/tempw ;
        s = {
            width:w,
            height:h
        }
    }else{
        console.log('宽高不存在')
        s = {
            width: VideoWidth,
            height: VideoHeight
        }
    }
    console.log('视频样式: ',s);
    return (
        <FadeInWidget>
            <TouchableOpacity 
            activeOpacity={1.0}
            style={[{
                marginStart: -(CardInnerGap - CardInnerGapEnd),
                justifyContent:'center',
                alignItems:'center'
            },s]} 
            onPress={() => {setpause(!pause)}}>
            {
                pause && (
                    <View style={{height:45,width:45,borderRadius:25,backgroundColor:'#ffffff77',justifyContent:'center',alignItems:'center'}}>
                        <SvgIcon name={Icons.play_button} size={29} color={'#555'} scale={0.029}/>
                    </View>
                )
            }
            <Video 
            source={{uri:props.uri}}
            style={[{
                backgroundColor: '#333',
                position:'absolute',
                zIndex:-1
            },s]}
            resizeMode='contain'
            repeat={true}
            paused={pause}
            />
            </TouchableOpacity>
        </FadeInWidget>
    )
});

/**
 *  图片题自适应图片组件
 */
const AnimatedAdaptiveImage = React.memo((props:{uri:string,frame:{width:number,height:number}}) => {

    let w = props.frame?.width ?? 0;
    let h = props.frame?.height ?? 0;

    let s = {};
    if(w != 0 && h != 0){
        let tempw = w;
        w = VideoWidth;
        h = h * VideoWidth/tempw ;
        s = {
            width:w,
            height:h
        }
    }else{
        s = {
            width: VideoWidth,
            minHeight: VideoHeight
        }
    }
    /**
     * 维持宽度不变，高度自适应
     */
    return (
        <FadeInWidget>
            <Image 
            source={{uri: props?.uri ?? ''}} 
            resizeMode='contain'
            style={s}
            />
        </FadeInWidget>
    )
})


/**
 * 题目解释组件
 */
const Explaination = React.memo((props: {
    answer: string,
    rate: string,
    explaination: string,
    count: number
}) => {

    const [appear, setappear] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(appear, {
            toValue: 1.0,
            duration: 666
        }).start();
    }, [])

    const explaination = props?.explaination ?? '本题没有解析'

    return (
        <Animated.View style={{
            marginTop: 12,
            opacity: appear,
        }}>
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: 'zhengquedaan' }} resizeMode='contain' style={{ height: 20, width: 20, marginEnd: 8 }} />
                    <Text style={{ fontSize: 15, marginEnd: 5 }}>正确答案:</Text>
                    <Text style={{ color: CorrectAnswerColor, fontSize: 19 }}>{props.answer}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                    <Text style={{ fontSize: 13, color: TextColor, marginEnd: 14 }}>作答人数：{props.count}</Text>
                    <Text style={{ fontSize: 13, color: TextColor }}>正确率：{props.rate}</Text>
                </View>
            </View>
            <View style={{ marginTop: 25 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: 'jiexi' }} resizeMode='contain' style={{ height: 20, width: 20, marginEnd: 8 }} />
                    <Text style={{ fontSize: 15, marginEnd: 5 }}>本题解析:</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                    <Text style={{ fontSize: 13, color: TextColor, marginEnd: 14 }}>{explaination}</Text>
                </View>
            </View>
        </Animated.View>
    )
});

/**
 * 文字类题目
 */
const TextKindQuestion = (props:{
    is_multi:boolean,
    avatar:string,
    colors:any,
    name:string,
    description:string,
    selections:any[],
    submitted:boolean,
    answer:string,
    count:number,
    rate:any,
    explaination:string,
    ClickHandler:any
}) => {
    return (
        <>
            <TopBadge multi={props?.is_multi ?? false} />
            <ScrollView
                contentContainerStyle={{ marginStart: CardInnerGap, marginEnd: CardInnerGapEnd }}
            >
                <AnimatedUserAvatar avatar={props?.avatar ?? ''} />
                <View style={{ alignSelf: 'center', marginBottom: 14 }}>
                    <AnimatedUserName colors={props.colors} name={props?.name ?? ''} />
                </View>

                <View style={{ marginBottom: 15 }}>
                    <AnimatedQuestionBody colors={props.colors} text={props?.description ?? ''} />
                </View>

                {
                    props?.selections.map((value, index) => {
                        return (
                            <AnimatedAnswerItem value={value} multi={props?.is_multi ?? false} />
                        )
                    })
                }

                {
                    props.submitted && <Explaination answer={props.answer} count={props?.count ?? 0} rate={props.rate} explaination={props?.explaination} />
                }

            </ScrollView>

            <ScaleButton
                style={[styles.submitButton, { backgroundColor: props.submitted ? props.colors.submitButton : '#37A2FC', marginBottom: 10, marginTop: 7 }]}
                callback={props.ClickHandler}
                frameStyle={{ alignSelf: 'center' }}
            >
                <Text style={{ fontSize: 16, color: props?.submitted ? props?.colors.secondaryText : 'white' }}>{props?.submitted ? '下一题' : '提交答案'}</Text>
            </ScaleButton>
        </>
    )
}

/**
 * 视频类题目
 */
const VideoKindQuestion = (props:{
    is_multi:boolean,
    avatar:string,
    frame:{width:number,height:number},
    colors:any,
    name:string,
    description:string,
    uri:string,
    selections:any[],
    submitted:boolean,
    answer:string,
    count:number,
    rate:any,
    explaination:string,
    ClickHandler:any
}) => {
    return (
        <>
            <TopBadge multi={props?.is_multi ?? false} />
            <ScrollView
                contentContainerStyle={{ marginStart: CardInnerGap, marginEnd: CardInnerGapEnd }}
            >
                <AnimatedUserAvatar avatar={props?.avatar ?? ''} />
                <View style={{ alignSelf: 'center', marginBottom: 14 }}>
                    <AnimatedUserName colors={props.colors} name={props?.name ?? ''} />
                </View>

                <View style={{ marginBottom: 12 }}>
                    <AnimatedQuestionBody colors={props.colors} text={props?.description ?? ''} />
                </View>

                <View style={{marginBottom:15}}>
                    <AnimatedVideo uri={props.uri} frame={props.frame}/>
                </View>

                {
                    props?.selections.map((value, index) => {
                        return (
                            <AnimatedAnswerItem value={value} multi={props?.is_multi ?? false} />
                        )
                    })
                }

                {
                    props.submitted && <Explaination answer={props.answer} count={props?.count ?? 0} rate={props.rate} explaination={props?.explaination ?? ''} />
                }

            </ScrollView>

            <ScaleButton
                style={[styles.submitButton, { backgroundColor: props.submitted ? props.colors.submitButton : '#37A2FC', marginBottom: 10, marginTop: 7 }]}
                callback={props.ClickHandler}
                frameStyle={{ alignSelf: 'center' }}
            >
                <Text style={{ fontSize: 16, color: props?.submitted ? props?.colors.secondaryText : 'white' }}>{props?.submitted ? '下一题' : '提交答案'}</Text>
            </ScaleButton>
        </>
    )
}

/**
 * 图片类题目
 */
const ImageKindQuestion = (props:{
    is_multi:boolean,
    avatar:string,
    colors:any,
    name:string,
    description:string,
    uri:string,
    frame:{height:number,width:number},
    selections:any[],
    submitted:boolean,
    answer:string,
    count:number,
    rate:any,
    explaination:string,
    ClickHandler:any
}) => {
    return (
        <>
            <TopBadge multi={props?.is_multi ?? false} />
            <ScrollView
                contentContainerStyle={{ marginStart: CardInnerGap, marginEnd: CardInnerGapEnd }}
            >
                <AnimatedUserAvatar avatar={props?.avatar ?? ''} />
                <View style={{ alignSelf: 'center', marginBottom: 14 }}>
                    <AnimatedUserName colors={props.colors} name={props?.name ?? ''} />
                </View>

                <View style={{ marginBottom: 12 }}>
                    <AnimatedQuestionBody colors={props.colors} text={props?.description ?? ''} />
                </View>

                <View style={{marginBottom:15}}>
                    <AnimatedAdaptiveImage uri={props.uri} frame={props.frame}/>
                </View>

                {
                    props?.selections.map((value, index) => {
                        return (
                            <AnimatedAnswerItem value={value} multi={props?.is_multi ?? false} />
                        )
                    })
                }

                {
                    props.submitted && <Explaination answer={props.answer} count={props?.count ?? 0} rate={props.rate} explaination={props?.explaination ?? ''} />
                }

            </ScrollView>

            <ScaleButton
                style={[styles.submitButton, { backgroundColor: props.submitted ? props.colors.submitButton : '#37A2FC', marginBottom: 10, marginTop: 7 }]}
                callback={props.ClickHandler}
                frameStyle={{ alignSelf: 'center' }}
            >
                <Text style={{ fontSize: 16, color: props?.submitted ? props?.colors.secondaryText : 'white' }}>{props?.submitted ? '下一题' : '提交答案'}</Text>
            </ScaleButton>
        </>
    )
}

const MultiKindQuestion = (props:{
    data:any,
    colors:any,
    submitted:boolean,
    ClickHandler:any
}) => {
    let d = props.data;
    console.log('MultiKindQuestion组件中: type',d.type,' data',d);
    const getRate = () => {
        if (d?.correct_count && d?.count) {
            let rate: number = parseFloat((d?.correct_count / d?.count).toFixed(3));
            return (rate * 100).toFixed(1) + '%';
        }
        return '0%';
    }    
    let answer = d?.answer ?? '';
    const is_multi = answer.length > 1;                                     //是否是多选题
    const selections = d?.selections_array ?? [];                         //题目选项

    if(d.type == 'text'){
        return (
            <TextKindQuestion
            is_multi = {is_multi}
            avatar={d?.user?.avatar ?? ''}
            colors={props.colors}
            name={d?.user?.name ?? ''}
            description={d?.description ?? ''}
            selections={selections}
            submitted={props.submitted}
            answer={answer}
            count={d?.count}
            rate={getRate()}
            explaination={d?.explaination}
            ClickHandler={props.ClickHandler}
            />
        )
    }else if(d.type == 'video'){
        return (
            <VideoKindQuestion
            is_multi = {is_multi}
            uri={d?.video?.url ?? ''}
            frame={{width:d?.video?.width,height:d?.video?.height}}
            avatar={d?.user?.avatar ?? ''}
            colors={props.colors}
            name={d?.user?.name ?? ''}
            description={d?.description ?? ''}
            selections={selections}
            submitted={props.submitted}
            answer={d?.answer ?? ''}
            count={d?.count}
            rate={getRate()}
            explaination={d?.explaination}
            ClickHandler={props.ClickHandler}
            />
        )
    }else if(d.type == 'image'){
        return (
            <ImageKindQuestion
            is_multi = {is_multi}
            uri={d?.image?.url ?? ''}
            frame={{width:d?.image?.width,height:d?.image?.height}}
            avatar={d?.user?.avatar ?? ''}
            colors={props.colors}
            name={d?.user?.name ?? ''}
            description={d?.description ?? ''}
            selections={selections}
            submitted={props.submitted}
            answer={d?.answer ?? ''}
            count={d?.count}
            rate={getRate()}
            explaination={d?.explaination}
            ClickHandler={props.ClickHandler}
            />
        )
    }
    return null;
}


/**
 *   题目内容主体
 */
const QuestionContentBody = observer(() => {

    const { colors } = useTheme();
    const [submitted, setsubmit] = useState(false);
    const data = ExerciseStore?.questions[0] ?? {};     //数组中第一道题的数据
    const [switching, setswitching] = useState(false);                       //是否正在切换题目

    const [opa, setopa] = useState(new Animated.Value(1.0));                 //题目内容组件透明度动画值（消失，切换题目用）

    //console.log('题目主体: ', data);
    const question_id: number = data?.id;                                   //题目ID
    const answer: string = data?.answer ?? '';                              //题目正确答案

    useEffect(() => {
        client = DataCenter.App.client;
    }, [DataCenter.App.client])

    console.log('正确答案: ', answer);

    /**
     *  提交答案 / 下一题 处理函数
     */
    const ClickHandler = async () => {
        // ShowResult.show()
        // return;
        if (submitted) { //已提交答案，需要处理跳转到下一题

            Animated.timing(opa, {
                toValue: 0,
                duration: 320,
            }).start(() => {
                //到这一步题目内容组件已透明，移除内容组件。
                //切换题目数据，重置状态值,展示下一题
                ExerciseStore.setVerifyAnswer(false);
                setswitching(true);
                setopa(new Animated.Value(1.0));
                ExerciseStore.switchQuestion();
                setsubmit(false);
                setswitching(false);
            })

        } else { //提交答案
            await ExerciseStore.setCorrectAnswer(answer);
            console.log('store中用户答案: ', ExerciseStore.answer_stack, '当前答案: ', answer);
            ExerciseStore.setVerifyAnswer(true); //等正确答案更新完后开始校验答案(启用动画)
            /**
             *  是否答对题的真正逻辑在此处
             */
            AnswerMutate();
        }
    }

    //提交答案 Mutation 函数
    const AnswerMutate = () => {
        let ans = '';
        //拼接答案，调用mutation用
        for (let i of ExerciseStore.answer_stack) {
            ans += i;
        }
        if (question_id != undefined) {
            client.mutate({
                mutation: GQL.AnswerMutation,
                variables: {
                    id: question_id,
                    answer: ans
                }
            }).then((rs: any) => {
                console.log('提交答案接口返回结果: ', rs);
                setsubmit(true); //设置提交为true ，更改按钮状态为 "下一题"
            }).catch((err: any) => {
                //答案提交错误信息
                console.log('提交答案接口错误: ', err)
            });
        }
    }

    return (
        <>
            {
                !switching && (
                    <Animated.View
                        style={{
                            opacity: opa,
                            flex: 1,
                        }}>
                        <HocStatusWidget
                            widget={
                                <MultiKindQuestion
                                data={data}
                                submitted={submitted}
                                colors={colors}
                                ClickHandler={ClickHandler}
                                />
                            }
                            // loading={ExerciseStore?.loading_data}
                            loading={false}
                            loadingView={<Text style={{ fontSize: 50 }}>加载题目中</Text>}
                        />
                    </Animated.View>
                )
            }
        </>
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
    const LibraryName = route.params?.libraryName ?? ''; //题库名
    const LibraryId = route.params?.id ?? '';            //题库ID

    console.log(navigation, LibraryName, LibraryId)

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
            centerTitle={LibraryName}
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
                    elevation: 5,
                    backgroundColor: colors.answerCard,
                    transform: [
                        { translateX: 0 }
                    ]
                }}>
                <QuestionContentBody />
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
    submitButton: {
        height: ButtonHeight,
        width: ButtonWidth,
        borderRadius: ButtonHeight,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }
})