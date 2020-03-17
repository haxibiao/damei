import React, { Component } from 'react';

import { StyleSheet, View, ScrollView, Image, Text, FlatList } from 'react-native';
import { PageContainer, TabBar, EmptyView, TouchFeedback, Iconfont, Avatar, Row } from 'components';
import { Theme } from 'utils';

import { app, observer } from 'store';
import { SCREEN_WIDTH, PxFit, NAVBAR_HEIGHT } from 'utils';

const itemView = ({ item }) => {
    let border_Radius = 10;
    return (
        <View
            style={{
                backgroundColor: '#FFF',
                width: '45%',
                margin: 10,
                borderColor: '#F6F6F6',
                borderWidth: 2,
                borderRadius: border_Radius,
                overflow: 'hidden',
            }}>
            <Image
                style={{
                    height: 90,
                    borderTopLeftRadius: border_Radius - 2.2,
                    borderTopRightRadius: border_Radius - 2.2,
                }}
                source={{ uri: 'http://cos.haxibiao.com/storage/image/15723192819VI9bwdwagVBOK0I.png' }}
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
                        <Text numberOfLines={1}>300智慧点/人次</Text>
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
class TreasureInfo extends Component {
    render() {
        const { navigation } = this.props;
        const { login } = app;
        return (
            <PageContainer title="宝贝详情" white style={styles.container}>
                <ScrollView>
                    <View>
                        <View style={{ borderRadius: 10, width: '96%', margin: '2%', overflow: 'hidden' }}>
                            <Image
                                style={{ width: '100%', height: PxFit(220) }}
                                source={{
                                    uri: 'http://cos.haxibiao.com/storage/image/15723192819VI9bwdwagVBOK0I.png',
                                }}
                            />
                            <View style={{ backgroundColor: '#FFF', paddingVertical: 10 }}>
                                <Row style={{ justifyContent: 'flex-end', width: '100%', paddingHorizontal: 20 }}>
                                    <Image
                                        style={{ width: 20, height: 20 }}
                                        source={require('../../../assets/images/diamond.png')}
                                    />
                                    <Text style={{ marginLeft: 10 }} numberOfLines={1}>
                                        100 智慧点 / 人次
                                    </Text>
                                </Row>
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
                                    <View
                                        style={{
                                            height: '100%',
                                            width: '10%',
                                            backgroundColor: Theme.theme,
                                            borderRadius: 5,
                                        }}
                                    />
                                </View>
                                <Row style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
                                    <Text style={{ flex: 1 }}>66 人已参与</Text>
                                    <Text>10%</Text>
                                </Row>
                            </View>
                        </View>
                        <View style={{ padding: 15, backgroundColor: '#FFF' }}>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }}>1000 智慧点大礼包</Text>
                            <Text style={{ textAlign: 'right', color: '#999' }}>期号：66699966</Text>
                        </View>
                        <View
                            style={{
                                padding: 15,
                                backgroundColor: '#FFF',
                                flexDirection: 'row',
                                marginTop: 10,
                                marginBottom: 1,
                            }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: '#222', textAlign: 'center' }}>夺宝参与记录</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
                                <Avatar
                                    source={{ uri: 'http://howtomail.haxibiao.com/imgs/extra-large.jpg' }}
                                    size={PxFit(40)}
                                    style={{
                                        marginRight: PxFit(-10),
                                        borderRadius: 50,
                                        borderColor: '#FFF',
                                        borderWidth: 2,
                                    }}
                                />
                                <Avatar
                                    source={{ uri: 'http://howtomail.haxibiao.com/imgs/extra-large.jpg' }}
                                    size={PxFit(40)}
                                    style={{
                                        marginRight: PxFit(-10),
                                        borderRadius: 50,
                                        borderColor: '#FFF',
                                        borderWidth: 2,
                                    }}
                                />
                                <Avatar
                                    source={{ uri: 'http://howtomail.haxibiao.com/imgs/extra-large.jpg' }}
                                    size={PxFit(40)}
                                    style={{
                                        marginRight: PxFit(-10),
                                        borderRadius: 50,
                                        borderColor: '#FFF',
                                        borderWidth: 2,
                                    }}
                                />
                                <Avatar
                                    source={{ uri: 'http://howtomail.haxibiao.com/imgs/extra-large.jpg' }}
                                    size={PxFit(40)}
                                    style={{ borderRadius: 50, borderColor: '#FFF', borderWidth: 2 }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                padding: 15,
                                backgroundColor: '#FFF',
                                marginTop: 10,
                                marginBottom: 1,
                            }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: '#222', textAlign: 'center' }}>好礼推荐</Text>
                            </View>
                            <FlatList
                                style={styles.flatList}
                                data={[1, 2, 6, 10, 2]}
                                numColumns={2}
                                renderItem={itemView}
                            />
                        </View>
                    </View>
                </ScrollView>
                <Row style={{ backgroundColor: '#FFF', paddingHorizontal: 25, paddingVertical: 10 }}>
                    <Row style={{ flex: 1 }}>
                        <TouchFeedback style={{ marginHorizontal: 10 }}>
                            <Iconfont name="liwu" color={'#666'} size={PxFit(19)} />
                            <Text style={{ fontSize: PxFit(12), marginTop: 1, color: '#999' }}>宝库</Text>
                        </TouchFeedback>
                        <TouchFeedback style={{ marginHorizontal: 10 }}>
                            <Iconfont name="like" color={'#666'} size={PxFit(21)} />
                            <Text style={{ fontSize: PxFit(12), marginTop: 1, color: '#999' }}>喜欢</Text>
                        </TouchFeedback>
                        <TouchFeedback style={{ marginHorizontal: 10 }}>
                            <Iconfont name="share-fill" color={'#666'} size={PxFit(21)} />
                            <Text style={{ fontSize: PxFit(12), marginTop: 1, color: '#999' }}>分享</Text>
                        </TouchFeedback>
                    </Row>
                    <TouchFeedback
                        style={{
                            backgroundColor: Theme.theme,
                            borderRadius: 20,
                            paddingVertical: 12,
                            paddingHorizontal: '24%',
                        }}>
                        <Text style={{ fontWeight: 'bold' }}>追加</Text>
                    </TouchFeedback>
                </Row>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
});

export default TreasureInfo;
