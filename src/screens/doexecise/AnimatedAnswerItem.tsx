import React,{ useState,useEffect,useRef } from 'react';
import { View, Text,Animated,Easing,TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import {observer} from 'mobx-react';
import ExeciseStore from './ExeciseStore';

export default observer((props:{
    value:{
        Value:string,
        Text:string
    }
}) => {
    const {colors} = useTheme();

    const [sx,setsx] = useState(new Animated.Value(28));
    const [op,setop] = useState(new Animated.Value(0));
    const textLen = useRef(0);

    /*******************
     * 答案选择处理函数
     */
    const chooseHandler = () => {
        //console.log(sx._value);
        if(op._value == 0){//改选项未被选中
            Animated.timing(
                op,
                {
                    toValue:1.0,
                    duration:600,
                }
            ).start();
            //TODO: 更改答题store中当前选中选项值
            ExeciseStore.setSelectedAnswer(props.value.Value);
        }else{//取消改选选择状态
            Animated.timing(
                op,
                {
                    toValue:0,
                    duration:600,
                }
            ).start();
        }
    }

    useEffect(() => {
        // setTimeout(() => {
        //     let toValue = textLen.current + 28+ 20;
        //     Animated.timing(
        //         sx,
        //         {
        //             toValue: toValue,
        //             duration:600,
        //             easing: Easing.ease
        //         }
        //     ).start();
        // }, 2000);
    }, []);

    return (
        <TouchableOpacity 
        activeOpacity={1.0}
        style={{paddingVertical:12}}
        onPress={chooseHandler}
        >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ height: 28, width: 28, borderWidth: 1,borderColor:colors.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 15, marginEnd: 8 }}>
                <Text style={{color: colors.primaryText,fontSize:15}} >{props.value.Value}</Text>
            </View>
            <Text onLayout={e => {
                //记录文本宽度
                textLen.current = e.nativeEvent.layout.width;
            }} style={{color: colors.primaryText,fontSize:15}}>{props.value.Text}</Text>
        </View>
        
        <Animated.View 
        style={{
            height:28,
            borderRadius:14,
            position:'absolute',
            zIndex:-1,
            backgroundColor:colors.primary,
            top:12,
            width:sx,
            opacity: op
        }}/>

        </TouchableOpacity>
    )
});