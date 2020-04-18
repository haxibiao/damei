import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, Image, ImageBackground,ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { sw, sh } from '../../tools';
import TagLists from './WidgetTagLists';
import {InterestPartMargin,InterestCoverSize,HGap,BadgeSize,CoverRadius} from './res';
import { ApolloClient } from 'apollo-boost';
import { DataCenter,observer } from '../../data';
import { GQL } from '../../network';

interface Category{
    id:number;
    name:string;
    description:string;
    icon:string;
    status:number;
    is_official:number;
    children:{id:number,name:string}[]
}

const InterestPart = () => {
    const [data, setData] = useState([]);
    const { colors } = useTheme();

    useEffect(() => {
        let c:ApolloClient<unknown> = DataCenter.App.client;
        c.query({
            query: GQL.InterestCategoriesQuery,
        }).then(rs => {
            console.log("题库查询结果: ",rs)
            let lists = rs.data?.categories ?? [];
            setData([...lists]);
        }).catch(err => {
            console.log('题库查询错误',err)
        })
    },[DataCenter.App.client]);


    const RenderHeader = () => {
        return (
            <View style={s.head_wrapper}>
                <View style={s.row}>
                    <Image 
                    source={{ uri: 'light_bulb' }} 
                    resizeMode='contain' 
                    style={{ height: BadgeSize, width: BadgeSize,marginBottom:4.5 }} 
                    />
                    <Text style={s.head_title}>兴趣专区</Text>
                </View>
            </View>
        )
    }
    const RenderItem = ({ item, index }:{item:Category,index:number}) => {
        let tags = item?.children ?? [];
        return (
            <View style={s.item}>
                <Image source={{ uri: item.icon }} style={s.img} />
                <View style={{ marginStart: 10, marginTop: 3 }}>
                    <Text style={{ fontSize: 15 }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: colors.secondaryText, marginVertical: 9 }}>{item.description}</Text>
                    <TagLists tags={tags}/>
                </View>
            </View>
        )
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={RenderItem}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={RenderHeader}
        />
    )
}

export default observer(InterestPart);

const s = StyleSheet.create({
    row:{ 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    head_wrapper:{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginHorizontal: HGap, 
        marginTop: 5, 
        marginBottom: 10 
    },
    head_title:{ 
        fontSize: 17, 
        marginStart: 6 
    },
    item:{ 
        marginStart: InterestPartMargin, 
        marginBottom: 10, 
        flexDirection: 'row' 
    },
    img:{ 
        height: InterestCoverSize, 
        width: InterestCoverSize, 
        borderRadius: CoverRadius 
    }
})