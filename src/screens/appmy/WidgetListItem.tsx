import React from 'react';
import { View, Text,TouchableOpacity, Image,StyleSheet } from 'react-native';
import { sh, sw } from '../../tools';
import { Icons, SvgIcon } from '../../res';


const ListItem = (props:{title:string,icon:string,target?:string}) => {

    return (
        <View style={s.item}>
            <View style={s.row}>
                <Image source={{ uri: props.icon }} resizeMode='contain' style={s.img} />
                <Text style={{ fontSize: 15,color:'#333' }}>{props.title}</Text>
            </View>
            <SvgIcon name={Icons.right_arrow} color={'#999'} size={18} scale={0.018} />
        </View>
    )
}

export default ListItem;

const s = StyleSheet.create({
    item:{ 
        flexDirection: 'row', 
        width: sw, 
        justifyContent: "space-between", 
        alignItems: 'center', 
        marginTop: 0, 
        paddingStart: 18, 
        paddingEnd: 18,
        marginBottom:25 
    },
    row:{ 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    img:{ 
        height: 24, 
        width: 24, 
        marginEnd: 13 
    }
})