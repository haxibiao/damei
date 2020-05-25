import React,{useEffect,useState,useRef} from 'react'
import {View,Keyboard,Animated,Easing} from 'react-native';

const KeyboradSpacer = React.memo((props:any) => {

    const [compensationh,seth] = useState(new Animated.Value(0));
    const diffHeight = useRef(0);
    const duration = useRef(0);

    
    useEffect(() => {
        let show = Keyboard.addListener("keyboardWillShow",(e) => {
            console.log('键盘弹出',e.duration,e.endCoordinates,e.startCoordinates);
            duration.current = e.duration;
            diffHeight.current = e.startCoordinates.screenY - e.endCoordinates.screenY;
            if(Math.abs(diffHeight.current) > 50){
                Animated.timing(compensationh,{
                    toValue: diffHeight.current,
                    duration:duration.current,
                    useNativeDriver:false
                }).start();
            }
        });
        return ()  => {
            show.remove();
        }
    },[]);
    useEffect(() => {
        let hide = Keyboard.addListener("keyboardWillHide",(e) => {
            Animated.timing(compensationh,{
                toValue: 0,
                duration:duration.current,
                useNativeDriver:false
            }).start();
        });
        return ()  => hide.remove();
    },[]);

    return <Animated.View style={{
        height: compensationh,
        width:1,
    }}/>
});
export default KeyboradSpacer;