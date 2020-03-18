import React,{useState,useEffect} from 'react';
import { View,Text,Dimensions,TouchableOpacity,StyleSheet,Animated,Easing,Image } from 'react-native';
import LiveStore from '../livestore';
import { observer } from 'mobx-react';
import { when } from 'mobx';
import LiveRoomListModalContent from './LiveRoomListModalContent';
const MemoLiveRoomListModalContent = React.memo(() => <LiveRoomListModalContent /> );

const {width:sw,height:sh} = Dimensions.get('window');
const LiveModalWidth = sw * 0.86;
const LiveModalHeight = sh;
const CloseButtonWidth = sw - LiveModalWidth;
const ModalRadius = 8;

const LiveRoomListModal = (props:any) => {

    when(
        () => LiveStore.showlivemodal.change,
        () => {
            modaltoggle(LiveStore.showlivemodal.flag);
        }
    )
    const [transx,settransx] = useState(new Animated.Value(LiveModalWidth));
    const [transclose,settransclose] = useState(new Animated.Value(-CloseButtonWidth));
    const [z,setz] = useState(-99)

    const modaltoggle = (show:boolean) => {
        LiveStore.closelivemodaltower();
        if(show){
            setz(99);
            Animated.timing(
                transx,
                {
                    toValue: 0,
                    duration: 360,
                    easing: Easing.bezier(0.3,0.6,0.7,0.92),
                    useNativeDriver:true
                }
            ).start(); 
            Animated.timing(
                transclose,
                {
                    toValue: -8,
                    duration: 360,
                    easing: Easing.bezier(0.3,0.6,0.7,0.92),
                    useNativeDriver:true
                }
            ).start(); 
        }else{
            Animated.timing(
                transx,
                {
                    toValue: LiveModalWidth,
                    duration: 330,
                    easing: Easing.bezier(0.3,0.6,0.7,0.92),
                    useNativeDriver:true
                }
            ).start(() => {
                setz(-99);
            });
            Animated.timing(
                transclose,
                {
                    toValue: -CloseButtonWidth,
                    duration: 360,
                    easing: Easing.bezier(0.3,0.6,0.7,0.92),
                    useNativeDriver:true
                }
            ).start(); 
        }
    }

    const closemodalhandler = () => {
        LiveStore.setshowlivemodal(false);
    }

    return (
    <View style={[styles.container,{zIndex: z}]}>
        
        <Animated.View style={{
            position:'absolute',
            top: sh/2 - CloseButtonWidth,
            left:-8,
            transform:[
                {translateX: transclose}
            ]
        }}>
            <TouchableOpacity onPress={ closemodalhandler } style={{justifyContent: 'center',
            alignItems:'flex-end',
            backgroundColor: '#00000088',
            height:CloseButtonWidth+10,
            width:CloseButtonWidth,
            borderTopRightRadius: CloseButtonWidth,
            borderBottomRightRadius: CloseButtonWidth,
            }}>
            <Image source={require('../res/close.png')} resizeMode='contain' style={{height:28,width:28,marginEnd:5}} />
            </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.content,{
            transform:[
                {translateX: transx}
            ]
        }]}>
            <MemoLiveRoomListModalContent />
        </Animated.View>
    </View>
    )
}

export default observer(LiveRoomListModal);

const styles = StyleSheet.create({
    container:{
        ...StyleSheet.absoluteFill,
        backgroundColor:'#000000bb',
        alignItems:'flex-end',
        position:"absolute",
    },
    content:{
        height:LiveModalHeight, 
        width:LiveModalWidth,
        backgroundColor:'white',
        borderTopLeftRadius: ModalRadius,
        borderBottomLeftRadius:ModalRadius,
        flexDirection:'row'
    }
})