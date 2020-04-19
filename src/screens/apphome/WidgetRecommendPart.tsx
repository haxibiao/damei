import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Animated } from 'react-native';
import { sw, sh } from '../../tools';
import { useTheme } from '@react-navigation/native';
import { BoxShadow } from 'react-native-shadow';
import { CoverRadius, CoverSize, BadgeSize, HGap } from './res';
import { HocStatusWidget } from '../../widgets';
import { DataCenter, observer } from '../../data';
import { GQL } from '../../network';
import { ApolloClient } from 'apollo-boost';

interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
    status: number;
    is_official: number;
}

const CardShadowConfig = {
    width: CoverSize,
    height: CoverSize,
    color: "#000",
    border: 3,
    radius: CoverRadius,
    opacity: 0.02,
    x: 0,
    y: 0,
}

/**
 *  官方题库区别标签
 */
const TopBadge = React.memo((props: { official: boolean }) => {

    const { colors } = useTheme();
    if (!props?.official) return;
    return (
        <View style={{
            width: CoverSize,
            height: CoverSize,
            position: 'absolute',
            top: 0,
            zIndex: 1,
        }}>
            <View style={{
                paddingVertical: 2,
                marginBottom: 0,
                width: sw * 0.4,
                backgroundColor: '#DD021B',
                justifyContent: 'center',
                alignItems: 'center',
                transform: [
                    { rotate: '-39.8deg' },
                    { translateX: -CoverSize / 2.1 },
                    { translateY: -CoverSize / 3.2 }
                ]
            }}>
                <Text style={{ color: 'white', fontSize: 11 }}>官方</Text>
            </View>
        </View>
    )
});

/**
 *  加载数据时等待动画
 */
const LoadingHolder = () => {
    const RenderItem = (item: any, index: number) => {
        const [op, setop] = useState(new Animated.Value(0.6));
        useEffect(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(op, {
                        toValue: 0.2,
                        duration: 1200,
                    }),
                    Animated.timing(op, {
                        toValue: 0.6,
                        duration: 1200
                    })
                ])
            ).start();
        }, [])
        return (
            <View style={[{ marginStart: index === 0 ? 18 : 0 }, s.item_wrapper]}>
                <Animated.View style={[s.item, {
                    backgroundColor: '#C6CBE0',
                    opacity: op
                }]} />
                <Animated.View />
            </View>
        )
    }
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', width: sw }}>
            {
                [1, 2, 3].map(RenderItem)
            }
        </View>
    )
}

/*****************
 *  推荐专区组件主体
 *****************/
const RecommendPart = () => {

    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);
    const [error,seterror] = useState();

    useEffect(() => {
        let c: ApolloClient<unknown> = DataCenter.App.client;
        c.query({
            query: GQL.CategoriesQuery,
        }).then(rs => {
            //console.log("题库查询结果: ",rs)
            let lists = rs.data?.categories ?? [];
            setData([...lists]);
            setloading(false);
        }).catch(err => {
            //console.log('题库查询错误', err);
            seterror(err);
        })
    }, [DataCenter.App.client]);

    //渲染列表项函数
    const RenderItem = ({ item, index }: { item: Category, index: number }) => {
        let isOfficial = item.is_official === 1;

        return (
            <View style={[{ marginStart: index === 0 ? 18 : 0 }, s.item_wrapper]}>
                <BoxShadow setting={CardShadowConfig}>
                    <View style={s.item}>
                        <TopBadge official={isOfficial} />
                        <ImageBackground
                            source={{ uri: item.icon }}
                            style={{ height: CoverSize, width: CoverSize }}>

                        </ImageBackground>
                    </View>
                </BoxShadow>
                <Text style={s.item_title}>{item.name}</Text>
            </View>
        )
    }

    return (
        <View style={{ width: sw }}>
            <View style={s.head_wrapper}>
                <View style={s.head_left}>
                    <Image source={{ uri: 'hot' }} resizeMode='contain' style={s.head_left_badge} />
                    <Text style={s.head_left_title}>推荐专区</Text>
                </View>
                <HocStatusWidget 
                widget={
                    <View style={s.head_right}>
                        <Text style={s.head_right_title}>查看更多</Text>
                    </View>
                }
                loading={loading}
                />
            </View>
            <View style={s.list}>
                <HocStatusWidget 
                widget={<FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={RenderItem}
                />} 
                loading={loading} 
                error={error}
                loadingView={<LoadingHolder/>}
                errorView={<LoadingHolder/>}
                />
            </View>
            
        </View>
    )
}

export default observer(RecommendPart);

const s = StyleSheet.create({
    item_wrapper: {
        width: CoverSize,
        alignItems: 'center',
        marginEnd: 10
    },
    item: {
        height: CoverSize,
        width: CoverSize,
        borderRadius: CoverRadius,
        overflow: 'hidden'
    },
    item_title: {
        marginTop: 10,
        fontSize: 14
    },
    head_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: HGap,
        marginTop: 30,
        marginBottom: 13
    },
    head_left: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    head_left_badge: {
        height: BadgeSize,
        width: BadgeSize,
        marginBottom: 2,
        marginEnd: 1
    },
    head_left_title: {
        fontSize: 17,
        marginStart: 6
    },
    head_right: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 4.6,
        paddingHorizontal: 8,
        borderRadius: 20,
        borderColor: 'lightgray'
    },
    head_right_title: {
        fontSize: 10
    },
    list: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})