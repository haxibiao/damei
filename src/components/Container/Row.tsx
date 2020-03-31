
import React, { Component } from 'react';

import { StyleSheet, View ,ViewStyle} from 'react-native';
 
function Row (
    props: {
        style?: ViewStyle,
        children?:any
    }
) {
let style = props?.style  ?? {};
return <View style={[styles.row, style]}>{props.children}</View>;
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

export default Row;