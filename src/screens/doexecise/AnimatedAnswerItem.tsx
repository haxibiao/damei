import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';


export default function AnimatedAnswerItem(props:{
    value:{
        Value:string,
        Text:string
    }
}) {
    const {colors} = useTheme();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
            <View style={{ height: 28, width: 28, borderWidth: 1,borderColor:colors.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 15, marginEnd: 8 }}>
                <Text style={{color: colors.primaryText,fontSize:15}} >{props.value.Value}</Text>
            </View>
            <Text style={{color: colors.primaryText,fontSize:15}}>{props.value.Text}</Text>
        </View>
    )
}