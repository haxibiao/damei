import React from 'react';
import { View, Text, ViewStyle, TouchableOpacity } from 'react-native';
import { Icons, SvgIcon } from '../../res';

/**
 *  男性标签
 */
const MaleTag = (props: {
    text?: string,
    frameStyle?: ViewStyle,
}) => {
    const fs = props?.frameStyle ?? {};
    const tt = props?.text ?? '';
    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 20, backgroundColor: '#71D0FF66' }, fs]}>
            <SvgIcon name={Icons.male_notfill} size={13} scale={0.012} color={'#71D0FF'} />
            <Text style={{ color: 'white', marginStart: 6 }}>{tt}</Text>
        </View>
    )
}

/**
 *  女性标签
 */
const FemaleTag = (props: {
    text?: string,
    frameStyle?: ViewStyle,
}) => {
    const fs = props?.frameStyle ?? {};
    const tt = props?.text ?? '';
    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 20, backgroundColor: '#F5C3D866' }, fs]}>
            <SvgIcon name={Icons.female_notfill} size={13} scale={0.012} color={'#F5C3D8'} />
            <Text style={{ color: 'white', marginStart: 6 }}>{tt}</Text>
        </View>
    )
}

/**
 * 等级标签
 */
const LevelTag = (props: {
    text?: number,
    frameStyle?: ViewStyle,
}) => {
    const fs = props?.frameStyle ?? {};
    const tt = props?.text ?? 0;
    return (
        <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20, backgroundColor: '#ffffff36' }, fs]}>
            <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>Lv.{tt}</Text>
        </View>
    )
}

/**
 *  设置标签
 */
const GearTag = (props: any) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 20, backgroundColor: '#ffffff46' }}>
            <SvgIcon name={Icons.gear} size={23} scale={0.022} color={'white'} />
        </View>
    )
}

const Modify = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{ paddingVertical: 9, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#ffffff46', marginEnd: 8 }}>
                <Text style={{ color: 'white' }}>编辑</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 9, borderRadius: 20, backgroundColor: '#ffffff46' }}>
                <Text style={{ color: 'white' }}>更换背景</Text>
            </TouchableOpacity>
        </View>
    )
}


export {
    MaleTag,
    FemaleTag,
    LevelTag,
    GearTag
}