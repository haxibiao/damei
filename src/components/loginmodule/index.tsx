import React, { useState,useEffect } from 'react';
import { View, Animated, ImageBackground,Image, SafeAreaView,TouchableOpacity, Text,TextInput, StyleSheet,Easing, Dimensions } from 'react-native';
import ScaleButton from './ScaleButton';

const { width: sw, height: sh } = Dimensions.get('window');
const DefaultBackgroundColor = '#FFFFFF';
const BackgroundColor = '#FFF275';
const LoginButtonHeight = 38;
const LoginButtonWidth = sw * 0.56;
const LoginButtonColor = '#eee';
const RegisterButtonHeight = 38;
const RegisterButtonWidth = sw * 0.56;
const RegisterButtonColor = '#FFF275';
const ButtonTextColor = '#555';

// Panel Positions 
const PanelSize = sw * 0.59;
const PanelTop = sh * 0.13;
const PanelRight = sw * 0.1;
// Girl Positions
const GirlSize = sw * 0.49;
const GirlTop = sh * 0.18;
const GirlRight = sw * 0.05;
// Circle Positions
const CircleSize = sw * 0.34;
const CircleTop = PanelTop + CircleSize + 30;
const CircleLeft = -CircleSize * 0.44;
// Triangle Positions
const TriangleSize = sw * 0.35;
const TriangleTop = sh * 0.02;
const TriangleRight = -TriangleSize*0.25;
// S Positions
const SSize = sw * 0.4;
const STop = PanelTop + SSize*1.7;
const SRight = 0;
// Line Positions
const LineSize = sw * 0.28;
const LineTop = -sh*0.04;
const LineLeft = 10;
// Mix Positions
const MixSize = sw * 0.34;
const MixRight = PanelRight + MixSize;
const MixTop = PanelTop - 20;
/**
 *  从白底渐变为黄底的背景View
 */
const AnimatedBackground = React.memo((props: {
    value: Animated.Value
}) => {
    return (
        <Animated.View
            style={{
                ...StyleSheet.absoluteFill,
                zIndex: -10,
                backgroundColor: BackgroundColor,
                opacity: props.value
            }}
        />
    )
});

const AnimatedDecGirl = React.memo((props:{z:number}) => {
    const [y,sety] = useState(new Animated.Value(0));

    useEffect(() => {
        const first = Animated.timing(y,{
            toValue: 15,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true
        });
        const sec = Animated.timing(y,{
            toValue: -15,
            duration: 3300,
            easing: Easing.linear,
            useNativeDriver: true
        });
        const seq = Animated.sequence([first,sec]);
        Animated.loop(seq).start();
        // return () => clearTimeout(timeout)
    },[]);
    return (
        <Animated.Image
        source={require('./res/login_girl.png')}
        resizeMode="contain"
        style={{
            width:GirlSize,
            height:GirlSize,
            position:'absolute',
            zIndex:props?.z ?? 0,
            top: GirlTop,
            right: GirlRight,
            transform: [
                {translateY: y}
            ]
        }}
        />
    )
})
const AnimatedDecPanel = React.memo((props:{z:number}) => {
    
    const [y,sety] = useState(new Animated.Value(0));

    useEffect(() => {
        const first = Animated.timing(y,{
            toValue: 15,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true
        });
        const sec = Animated.timing(y,{
            toValue: -15,
            duration: 3300,
            easing: Easing.linear,
            useNativeDriver: true
        });
        const seq = Animated.sequence([first,sec]);
        Animated.loop(seq).start();
    },[]);

    return (
        <Animated.Image
        source={require('./res/login_panel.png')}
        resizeMode="contain"
        style={{
            width:PanelSize,
            height:PanelSize,
            position:'absolute',
            zIndex:props?.z ?? 0,
            right: PanelRight,
            top: PanelTop,
            transform: [
                {translateY: y}
            ]
        }}
        />
    )
})
const AnimatedDecCircle = React.memo((props:{z:number}) => {
    const [y,sety] = useState(new Animated.Value(0));
    const [x,setx] = useState(new Animated.Value(0));

    useEffect(() => {
        const stage0 = 16000;
        const paral1 = Animated.parallel([
            Animated.timing(y,{
                toValue: sh - CircleTop + CircleSize,
                duration: stage0,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(x,{
                toValue: sw,
                duration: stage0,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ]);
        const paral2 = Animated.parallel([
            Animated.timing(x,{
                toValue: -CircleSize*2,
                duration: 10,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(y,{
                toValue: CircleSize*2,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ]);
        const paral3 = Animated.parallel([
            Animated.timing(y,{
                toValue: 0,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(x,{
                toValue: 0,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ]);
        const seq = Animated.sequence([paral1,paral2,paral3]);
        Animated.loop(seq).start();
    },[]);

    return (
        <Animated.Image
        source={require('./res/login_circle.png')}
        resizeMode="contain"
        style={{
            width:CircleSize,
            height:CircleSize,
            position:'absolute',
            zIndex:props?.z ?? 0,
            top: CircleTop,
            left: CircleLeft,
            transform:[
                {translateY: y},
                {translateX: x}
            ]
        }}
        />
    )
})
const AnimatedDecTriangle = React.memo((props:{z:number}) => {
    const [ro,setro] = useState(new Animated.Value(0));

    useEffect(() => {
        const rotateanim = Animated.timing(ro,{
            toValue: 1,
            duration:16000,
            easing: Easing.linear,
            useNativeDriver:true
        });
        Animated.loop(rotateanim).start();
    },[]);

    return (
        <Animated.Image
        source={require('./res/login_triangle.png')}
        resizeMode="contain"
        style={{
            width:TriangleSize,
            height:TriangleSize,
            position:'absolute',
            zIndex:props?.z ?? 0,
            top: TriangleTop,
            right: TriangleRight,
            transform:[
                {rotate: ro.interpolate({
                    inputRange: [0,1],
                    outputRange: ['0deg','360deg']
                })}
            ] 
        }}
        />
    )
})
const AnimatedDecS = React.memo((props:{z:number}) => {
    
    const [ro,setro] = useState(new Animated.Value(0));

    useEffect(() => {
        const first = Animated.timing(ro,{
            toValue: 1.0,
            duration: 7200,
            easing: Easing.linear,
            useNativeDriver: true
        });
        const second = Animated.timing(ro,{
            toValue: 0,
            duration: 7200,
            easing: Easing.linear,
            useNativeDriver: true
        });
        Animated.loop(
            Animated.sequence([first,second])
        ).start();
    },[])
    return (
        <Animated.Image
        source={require('./res/login_s.png')}
        resizeMode="contain"
        style={{
            width:SSize,
            height:SSize,
            position:'absolute',
            zIndex:props?.z ?? 0,
            top: STop,
            right: SRight,
            transform:[
                {rotate: ro.interpolate({
                    inputRange: [0,1],
                    outputRange: ['0deg','45deg']
                })}
            ]
        }}
        />
    )
})
const AnimatedDecMix = React.memo((props:{z:number}) => {
    const [y,sety] = useState(new Animated.Value(0));

    useEffect(() => {
        const first = Animated.timing(y,{
            toValue: 10,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true
        });
        const sec = Animated.timing(y,{
            toValue: -10,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true
        });
        const seq = Animated.sequence([first,sec]);
        Animated.loop(seq).start();
    },[]);
    return (
        <Animated.Image
        source={require('./res/login_mix.png')}
        resizeMode="contain"
        style={{
            width:MixSize,
            height:MixSize,
            position:'absolute',
            zIndex:props?.z ?? 0,
            top: MixTop,
            right: MixRight ,
            transform: [
                {translateY: y}
            ]
        }}
        />
    )
})
const AnimatedDecLine = React.memo((props:{z:number}) => {
    
    return (
        <Animated.Image
        source={require('./res/login_line.png')}
        resizeMode="contain"
        style={{
            width:LineSize,
            height:LineSize,
            position:'absolute',
            zIndex:props?.z ?? 0,
            top: LineTop,
            left: LineLeft 
        }}
        />
    )
})
const AnimatedSmallDecorators = React.memo((props:any) => {
    
    return (
        <View style={{
            ...StyleSheet.absoluteFill,
            zIndex: -5,
            justifyContent:'center',
            alignItems:'center'
        }}>
            <AnimatedDecGirl z={-1}/>
            <AnimatedDecPanel z={-2}/>
            <AnimatedDecCircle z={0}/>
            <AnimatedDecS z={0}/>
            <AnimatedDecTriangle z={-2}/>
            <AnimatedDecMix z={0}/>
            <AnimatedDecLine z={-2}/>
        </View>
    )
})


const InputItem = React.memo((props:{
    title: string,
    placeholder: string
}) => {

    return (
        <View style={{marginBottom:27}}>
            <Text style={{color:'#666',fontSize:14,marginBottom:12}}>{props.title}</Text>
            <View style={{paddingVertical:6,borderBottomColor:'#C3C9E1',borderBottomWidth:1}}>
                <TextInput
                placeholder={props.placeholder}
                style={{fontSize:14}}
                />
            </View>
        </View>
    )
})
/**
 *  登录状态下输入框
 */
const LoginPanel = React.memo((props: {close:any}) => {

    const [y,sety] = useState(new Animated.Value(sh * 0.72));
    const [s,sets] = useState(new Animated.Value(0.88));

    useEffect(() => {
        const trans = Animated.timing(y,{
            toValue: 0,
            duration: 1700,
            easing: Easing.out(Easing.poly(3)),
            useNativeDriver:true
        });
        const scales = Animated.timing(s,{
            toValue: 1.0,
            duration: 1500,
            easing: Easing.out(Easing.poly(3)),
            useNativeDriver:true
        });
        Animated.parallel([trans,scales]).start();
    },[]);
    return (
        <View 
        style={{
            flex: 1,
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 0,
            top: 0,
            justifyContent: 'flex-end'
        }}>
            <Animated.View style={{
                width:sw*0.7,
                alignSelf:'center',
                marginBottom:20,
                flexDirection:'row',
                justifyContent:'space-around',
                opacity: s.interpolate({
                    inputRange:[0.88,0.99,1],
                    outputRange:[0,0,1]
                })
            }}>
                <Text style={{fontSize:18,color:'#555'}}>登录</Text>
                <View style={{width:2,height:20,backgroundColor:'white'}}/>
                <Text style={{fontSize:18,color:'#555'}}>注册</Text>
            </Animated.View>
            <Animated.View style={{
                height: sh * 0.78,
                width: sw,
                borderTopLeftRadius: 45,
                borderTopRightRadius: 45,
                overflow: 'hidden',
                backgroundColor: 'white',
                transform: [
                    {translateY: y},
                    {scale: s}
                ]
            }}>
                <View style={{height:'100%',paddingHorizontal:sw * 0.055,paddingTop:sw * 0.1}}>
                    <Text style={{fontSize:38,color:'#555',marginBottom:38}}>welcome</Text>
                    <InputItem title="账号" placeholder="请输入手机号"/>
                    <InputItem title="密码" placeholder="请输入密码"/>
                    <ScaleButton callback={null} style={{alignSelf:'center',marginTop:30}}>
                        <View style={{width:sw * 0.70,height:40,borderRadius:20,backgroundColor:RegisterButtonColor,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#666',fontSize:16}}>注册</Text>
                        </View>
                    </ScaleButton>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:40}}>
                        <View style={{height:1,width: sw * 0.2,backgroundColor:'#666'}}/>
                        <Text style={{fontSize:15,color:'#333',marginHorizontal:12}}>其他登录方式</Text>
                        <View style={{height:1,width: sw * 0.2,backgroundColor:'#666'}}/>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:40}}>
                        <View style={{alignItems:'center'}}>
                            <View style={{height:35,width:35,borderRadius:35,backgroundColor:'lightgreen',marginBottom:12}}/>
                            <Text>微信登录</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <View style={{height:35,width:35,borderRadius:35,backgroundColor:'orange',marginBottom:12}}/>
                            <Text>一键登录</Text>
                        </View>
                    </View>
                    
                    <View style={{alignSelf:'center',flexDirection:'row',justifyContent:'center',alignItems:'center',position:'absolute',bottom:sh * 0.05}}>
                        <Text style={{color:'#666'}}>同意</Text>
                        <TouchableOpacity>
                            <Text style={{color:BackgroundColor}}>用户协议</Text>
                        </TouchableOpacity>
                        <Text style={{color:'#666',marginHorizontal:6}}>和</Text>
                        <TouchableOpacity>
                            <Text style={{color: BackgroundColor}}>用户协议</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </View>
    )
});

const LogoButtonPart = React.memo((props:{LoginClickHandler:any}) => {

    const LoginClickHandler = props.LoginClickHandler;

    return (
        <View>
            <View style={{marginBottom:30,alignSelf:'center',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <Image source={require('./res/icon.png')} style={{height: 30,width:30,marginEnd:14}} resizeMode="contain"/>
                <Text style={{color: BackgroundColor,fontSize:27,fontWeight:'bold'}}>答妹</Text>
            </View>
            
            <ScaleButton
                callback={LoginClickHandler}
                style={{
                    alignSelf: 'center',
                    marginBottom: 18
                }}>
                <View style={{
                    height: LoginButtonHeight,
                    width: LoginButtonWidth,
                    borderRadius: 8,
                    backgroundColor: LoginButtonColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{ color: ButtonTextColor }}>登录</Text>
                </View>
            </ScaleButton>
            <ScaleButton
                callback={null}
                style={{
                    alignSelf: 'center',
                    marginBottom: 100
                }}>
                <View style={{
                    height: RegisterButtonHeight,
                    width: RegisterButtonWidth,
                    borderRadius: 8,
                    backgroundColor: RegisterButtonColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{ color: ButtonTextColor }}>注册</Text>
                </View>
            </ScaleButton>
        </View>
    )
})


/**
 *  渐变背景 AnimatedBackground 在最下层  -10
 *  登录/注册状态框在默认层
 * 
 */
const Login = (props: any) => {

    const [backgroundFade, setbackgroundfade] = useState(new Animated.Value(0))
    const [showLogin,setshowlogin] = useState(false);

    const LoginClickHandler = () => {
        setshowlogin(true);
        Animated.timing(backgroundFade,{
            toValue: 1.0,
            duration:2000,
            easing: Easing.bezier(0.38,0.8,0.8,0.9),
            useNativeDriver: false
        }).start();
    };
    const HideLoginModal = () => {
        setshowlogin(false);
    }
    return (
        <View style={{ flex: 1, backgroundColor: DefaultBackgroundColor, justifyContent: 'flex-end' }}>

            <AnimatedBackground value={backgroundFade} />
            
            { !showLogin && <AnimatedSmallDecorators /> }
            
            { showLogin && <LoginPanel close={HideLoginModal}/> }
            
            { !showLogin && <LogoButtonPart LoginClickHandler={LoginClickHandler}/> }
            
        </View>
    );
};
export default Login;