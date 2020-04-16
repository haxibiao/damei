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

    const pressIn = () => {
        Animated.timing(scale,{
            toValue:0.97,
            duration:130,
            easing: Easing.linear,
            useNativeDriver:true
        }).start()
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
        if(props.callback) props.callback();
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
