import * as Toast from './Toast';
import * as Page from './page';
export * from 'react-native';
import VideoLiveScrollTab from './VideoLiveScrollTab';
import { Avatar,RoundedImage } from 'hxf-react-native-uilib';

//按钮
import ScaleButton from './button/ScaleButton';

//状态高阶view
import HocStatusWidget from './HocStatusWidget';

import FadeInWidget from './FadeInWidget';

export { 
    Toast,              //toast弹窗
    Page,               //页面
    VideoLiveScrollTab, //首页视频直播滑动tab
    Avatar,             //头像组件
    RoundedImage,       //圆角图片
    ScaleButton,        //缩放点击组件
    HocStatusWidget,    //状态组件
    FadeInWidget,       //渐入动画组件
}