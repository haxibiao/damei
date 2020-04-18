import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';

const TagPaddingH = 9; //标签水平内边距
/**
 *  兴趣专区 组件
 */
const TagLists = (props: { tags: any[] }) => {

    return (
        <FlatList
            data={props?.tags ?? []}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            renderItem={({ item, index }) => {
                return (
                    <View style={{ paddingHorizontal: TagPaddingH, maxHeight: 14, borderRadius: 7, marginEnd: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: 'lightgray' }}>
                        <Text style={{ color: 'white', fontSize: 9 }}>{item.name}</Text>
                    </View>
                )
            }}
        />
    )
}

export default TagLists;