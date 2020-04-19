import React,{useState} from 'react';
import {TouchableOpacity,Animated,Easing,ViewStyle} from 'react-native';

export default React.memo((props:{
    style?:ViewStyle,
    frameStyle?:ViewStyle,
    children?:any,
    callback:any
}) => {
    const s = props?.style ?? {};
    const fs = props?.frameStyle ?? {};

    const [scale,setscale] = useState(new Animated.Value(1.0));
    const [pressInTime,setPressInTime] = useState(0);

    const pressIn = () => {
        Animated.timing(scale,{
            toValue:0.97,
            duration:130,
            easing: Easing.linear,
            useNativeDriver:true
        }).start();
        let t = Date.now();
        setPressInTime(t);
    }
    const pressOut = () => {
        Animated.timing(scale,{
            toValue:1.04,
            duration:200,
            easing: Easing.linear,
            useNativeDriver:true
        }).start(() => {
            Animated.timing(scale,{
                toValue:1,
                duration:230,
                easing: Easing.linear,
                useNativeDriver:true
            }).start()
        })
        if(props.callback) {
            let now = Date.now();
            let diff = now - pressInTime;
            if(diff < 180){
                props.callback();
            }else{//触摸释放时间超过100毫秒，不响应点击
                console.log('触摸超过100毫秒，不响应')
            }
        }
    }

    return (
        <TouchableOpacity activeOpacity={1} style={fs} onPressIn={pressIn} onPressOut={pressOut}>
            <Animated.View style={[
                s,
                {
                    transform:[
                        {scale: scale}
                    ]
                }
            ]}>
                {props.children}
            </Animated.View>
        </TouchableOpacity>
    )
})
