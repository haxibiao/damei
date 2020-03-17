import React, { Component } from 'react';

import { StyleSheet, View, ScrollView, Image, Text, FlatList } from 'react-native';
import { PageContainer, TabBar, EmptyView, TouchFeedback, Iconfont } from 'components';
import { Theme } from 'utils';

import { app, observer } from 'store';
import { SCREEN_WIDTH, PxFit, NAVBAR_HEIGHT } from 'utils';

const itemView = ({ item }) => {
    let border_Radius = 10;
    return (
        <View
            style={{
                backgroundColor: '#FFF',
                width: SCREEN_WIDTH / 2 - 20,
                margin: 10,
                borderRadius: border_Radius,
            }}>
            <Image
                style={{
                    height: 90,
                    borderTopLeftRadius: border_Radius,
                    borderTopRightRadius: border_Radius,
                }}
                source={{ uri: 'http://cos.haxibiao.com/storage/image/1572327113gmqL9Jcjxl2ZuptA.png' }}
            />
            <View
                style={{
                    width: '90%',
                    height: 5,
                    backgroundColor: '#EEE',
                    marginHorizontal: '5%',
                    marginTop: 10,
                    borderRadius: 5,
                    overflow: 'hidden',
                }}>
                <View style={{ height: '100%', width: item + '0%', backgroundColor: Theme.theme, borderRadius: 5 }} />
            </View>
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: 'bold', color: '#000' }} numberOfLines={1}>
                    Hello {item} , 1000 智慧点大礼包啦啦啦啦啦啦啦啦
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
                    <View style={{ flex: 1, justifyContent: 'center', textAlign: 'center' }}>
                        <Text>300智慧点/人次</Text>
                    </View>

                    <TouchFeedback
                        style={{ backgroundColor: Theme.theme, borderRadius: 20, padding: 5, paddingHorizontal: 12 }}>
                        <Text>参加</Text>
                    </TouchFeedback>
                </View>
            </View>
        </View>
    );
};

@observer
class index extends Component {
    render() {
        const { navigation } = this.props;
        const { login } = app;
        return (
            <PageContainer
                title="智慧夺宝"
                white
                rightView={
                    <TouchFeedback
                        style={{
                            flex: 1,
                            width: Theme.navBarContentHeight,
                            height: '100%',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}>
                        <Iconfont name="liwu" color={'#666'} size={PxFit(21)} />
                    </TouchFeedback>
                }>
                <FlatList
                    style={styles.flatList}
                    data={[1, 2, 6, 10, 2, 8, 2, 12, 2]}
                    numColumns={2}
                    renderItem={itemView}
                />
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatList: {
        backgroundColor: '#f2f2f2',
    },
});

export default index;
