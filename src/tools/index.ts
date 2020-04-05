/**
 *  ReactNative 适配工具 : px,dp数值获取函数  底部导航栏适配高度
 */
import { Adapter } from './Adapter';
const Adp = Adapter.shared;

//屏幕宽高
import { Dimensions } from 'react-native';
const sw: number = Dimensions.get('window').width,
    sh: number = Dimensions.get('window').height;

//ART库
import * as ART from '@react-native-community/art';

//App参数
import AppConfig from './AppConfig';

// 登录工具函数
import useLogin from './useLogin';


export { sw, sh, Adp, ART,AppConfig,useLogin }