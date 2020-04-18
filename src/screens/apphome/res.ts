import {Dimensions} from 'react-native';
const {width:sw,height:sh} = Dimensions.get('window');

const BadgeSize = 23; //图标尺寸
const CoverRadius = 10; //推荐，兴趣封面圆角
const CoverSize = sw * 0.27; //推荐封面尺寸
const InterestPartMargin = (sw - CoverSize * 3) / 4; //兴趣专区item距离左边空隙
const InterestCoverSize = sw * 0.19; //兴趣专区封面尺寸
const HGap = sw * 0.05; //页面左右内边距
const InspirationWidth = sw * 0.78; //每日鸡汤宽度
const InspirationMarginStart = sw * 0.11; //每日鸡汤距离左边距离(居中)

export {
    BadgeSize,
    CoverRadius,
    CoverSize,
    InterestPartMargin,
    InterestCoverSize,
    HGap,
    InspirationWidth,
    InspirationMarginStart
}