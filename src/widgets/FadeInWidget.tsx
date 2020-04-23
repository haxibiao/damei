import React,{useState,useEffect} from 'react';
import { View,Text,Animated,Easing, ViewStyle } from 'react-native';

const FadeInWidget = React.memo((props:{children?:any,duration?:number,containerStyle?:ViewStyle}) => {

    const [op,setop] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(op,{
            toValue: 1.0,
            duration: props?.duration ?? 520,
            easing: Easing.ease
        }).start();
    },[])

    return (
        <Animated.View style={[props?.containerStyle ?? {}, {
            opacity: op
        }]}>
            {props.children}
        </Animated.View>
    )
});

export default FadeInWidget;