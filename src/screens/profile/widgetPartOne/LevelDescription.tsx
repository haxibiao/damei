import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from '../../../widgets';
import { Page } from '../../../widgets';
import { observer } from 'mobx-react';


const GradeDescription = (props: { navigation: any; }) => {
    return (
        <Page.Page navigation={props.navigation} centerTitle={"等级说明"}>
            <View style={{
                width: 100 % 100,
                height: 1,
            }}>

            </View>
            <View>

            </View>
            <View>

            </View>
        </Page.Page>
    );
};

export default GradeDescription;
