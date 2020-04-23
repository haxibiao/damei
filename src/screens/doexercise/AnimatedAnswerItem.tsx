import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity,TextStyle } from 'react-native';
import {sw} from '../../tools';
import { useTheme } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { when } from 'mobx';
import ExerciseStore from './ExerciseStore';

const Wrong = '#FFDBDB';
const Correct = '#D2FCE9';
const TextColor = '#555';

export default observer((props: {
    value: {
        Value: string,
        Text: string
    },
    multi:boolean
}) => {

    when(
        () => ExerciseStore.verify_answer,
        () => {
            VerifyAnswerHandler();
            //校验完成后将校验标识复位
            //ExerciseStore.setVerifyAnswer(false);
        }
    );

    const { colors } = useTheme();
    const [highlight,sethighlight] = useState(colors.primary);
    const [sx, setsx] = useState(new Animated.Value(28));

    //选中/取消选中 选项时选项透明度变化动画值
    const [op, setop] = useState(new Animated.Value(0));
    const textLen = useRef(0);

    //入场动画位移动画值
    const [apearX,setapearx] = useState(new Animated.Value(-sw));

    const wrongline:TextStyle = {
        textDecorationLine:'line-through',textDecorationColor:TextColor
    };

    /*******************
     * 答案选择处理函数
     */
    const chooseHandler = () => {
        //console.log(sx._value);
        if (op._value == 0) {//改选项未被选中
            Animated.timing(
                op,
                {
                    toValue: 1.0,
                    duration: 600,
                }
            ).start();
            if(props.multi){
                //题目是多选，答案入栈
                if(ExerciseStore.answer_stack.indexOf(props.value.Value) <= -1){//栈中不存在该答案，入栈
                    let ans = ExerciseStore.answer_stack;
                    ans.push(props.value.Value);
                    ExerciseStore.setSelectAnswer([...ans]);
                }
            }else{
                //题目单选，替换栈底元素
                let ans = [props.value.Value];
                ExerciseStore.setSelectAnswer([...ans]);
            }
        } else {//取消改选选择状态
            Animated.timing(
                op,
                {
                    toValue: 0,
                    duration: 600,
                }
            ).start();
        }
    };
    
    /**
     *  开始校验答案
     */
    const VerifyAnswerHandler = () => {
        /**
         *  1.最高优先级： 检查我自己是不是正确答案，是的话则绿色高亮
         *  
         *  2.检查我是否被用户选中了
         *  3.我被选中了，检查我是否是正确答案，不是的话则红色高亮
         */
        let indexInCorrect = ExerciseStore.correct_answer.indexOf(props.value.Value);
        let indexInSelect = ExerciseStore.answer_stack.indexOf(props.value.Value);

        console.log('我是选项',props.value.Value,indexInCorrect,indexInSelect);

        if(indexInCorrect != -1){ //我是正确答案
            //TAG 1
            sethighlight(Correct);
            // let toValue = textLen.current + 28+ 20;
            // Animated.timing(
            //     sx,
            //     {
            //         toValue: toValue,
            //         duration:420,
            //         easing: Easing.ease
            //     }
            // ).start();
        }else{
            //TAG 2,3 
            if(indexInSelect != -1){ //我被选中了且不是正确答案
                sethighlight(Wrong);
            }
        }
    }

    /**
     *  处理答案首次加载时入场动画
     */
    useEffect(() => {
        //6个随机入场动画
        const randomAnimConfig = [Easing.bounce,Easing.in(Easing.poly(4)),Easing.out(Easing.poly(4)),,Easing.inOut(Easing.poly(4)),Easing.elastic(3),Easing.back(3)];
        let randomNum = Math.round(Math.random()*10);
        if(randomNum >= 6){
            randomNum -= 5;
        }
        Animated.timing(apearX,{
            toValue:0,
            duration:777,
            easing: randomAnimConfig[randomNum],
            delay: Math.random()*300
        }).start();
    }, []);

    return (
        <Animated.View style={{
            transform:[
                {translateX: apearX}
            ]
        }}>
            <TouchableOpacity
                activeOpacity={1.0}
                style={{ paddingVertical: 12 }}
                onPress={chooseHandler}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 28, width: 28, borderWidth: 1, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 15, marginEnd: 8 }}>
                        <Text style={{ color: TextColor, fontSize: 15 }} >{props.value.Value}</Text>
                    </View>
                    <Text 
                    onLayout={e => {
                        //记录文本宽度
                        textLen.current = e.nativeEvent.layout.width;
                    }} 
                    style={[{ color: TextColor, fontSize: 15 },(highlight == Wrong) ? wrongline : {}]}>
                        {props.value.Text}
                        </Text>
                </View>

                <Animated.View
                    style={{
                        height: 28,
                        borderRadius: 14,
                        position: 'absolute',
                        zIndex: -1,
                        backgroundColor: highlight,
                        top: 12,
                        width: sx,
                        opacity: op
                    }} />

            </TouchableOpacity>
        </Animated.View>
    )
});