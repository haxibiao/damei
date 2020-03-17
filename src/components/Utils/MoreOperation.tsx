import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Linking } from 'react-native';
import { GQL, useMutation } from '@src/apollo';
import { config, app, observer } from 'store';
import useReport from './useReport';
import TouchFeedback from '../TouchableView/TouchFeedback';
import { Theme, PxFit, Tools } from 'utils';

const MoreOperation = props => {
    const { options, target, type, onPressIn, deleteCallback } = props;
    const report = useReport({ target, type });
    const [deleteArticleMutation] = useMutation(GQL.deleteQuestionMutation, {
        variables: {
            id: target.id,
        },
        onCompleted: data => {
            deleteCallback();
            Toast.show({
                content: '删除成功',
            });
        },
        onError: error => {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '删除失败',
            });
        },
    });

    // const [dislikeMutation] = useMutation(GQL.NotLikeMutation, {
    //     variables: {
    //         notlike_id: target.user.id,
    //     },
    //     onCompleted: data => {
    //         Toast.show({
    //             content: '操作成功，将减少此类型内容的推荐',
    //         });
    //     },
    //     onError: error => {
    //         Toast.show({
    //             content: error.message.replace('GraphQL error: ', '') || '操作失败',
    //         });
    //     },
    // });

    const deleteArticle = useCallback(() => {
        onPressIn();
        deleteArticleMutation();
    }, [deleteArticleMutation]);

    const reportArticle = useCallback(() => {
        onPressIn();
        report();
    }, [report]);

    const captureVideo = useCallback(() => {
        onPressIn();
        if (app.firstReadSpiderVideoTask) {
            Linking.openURL('snssdk1128://');
        } else {
            Tools.navigate('SpiderVideoTask');
            app.setReadSpiderVideoTask(true);
        }
    }, []);

    const blockUser = useCallback(() => {
        onPressIn();
        setTimeout(() => {
            Toast.show({ content: '该用户已加入黑名单' });
        }, 300);
        // dislikeMutation();
    }, []);

    const dislike = useCallback(() => {
        onPressIn();
        Toast.show({
            content: '操作成功，将减少此类型内容的推荐',
        });
        // dislikeMutation();
    }, []);

    const operation = useMemo(
        () => ({
            采集视频: {
                image: require('@src/assets/images/more_video_download.png'),
                callback: captureVideo,
            },
            举报: {
                image: require('@src/assets/images/more_report.png'),
                callback: reportArticle,
            },
            拉黑: {
                image: require('@src/assets/images/more_block_user.png'),
                callback: blockUser,
            },
            删除: {
                image: require('@src/assets/images/more_delete.png'),
                callback: deleteArticle,
            },
            不感兴趣: {
                image: require('@src/assets/images/more_dislike.png'),
                callback: dislike,
            },
        }),
        [reportArticle, deleteArticle, blockUser, dislike],
    );

    const optionsView = useMemo(() => {
        return options.map((option, index) => {
            return (
                <TouchFeedback style={styles.optionItem} key={index} onPress={operation[option].callback}>
                    <Image style={styles.optionIcon} source={operation[option].image} />
                    <Text style={styles.optionName}>{option}</Text>
                </TouchFeedback>
            );
        });
    }, [options]);

    return (
        <View style={styles.optionsContainer}>
            <View style={styles.body}>{optionsView}</View>
            <TouchFeedback style={styles.footer} onPress={onPressIn}>
                <Text style={styles.footerText}>取消</Text>
            </TouchFeedback>
        </View>
    );
};

MoreOperation.defaultProps = {
    options: ['不感兴趣', '举报'],
    type: 'POST',
};

const styles = StyleSheet.create({
    body: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: PxFit(Theme.itemSpace),
    },
    footer: {
        alignItems: 'center',
        borderColor: Theme.borderColor,
        borderTopWidth: PxFit(1),
        justifyContent: 'center',
        paddingVertical: PxFit(Theme.itemSpace),
    },
    footerText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(15),
    },
    optionIcon: {
        height: PxFit(50),
        width: PxFit(50),
    },
    optionItem: {
        alignItems: 'center',
        flex: 1,
        paddingVertical: PxFit(10),
    },
    optionName: {
        color: Theme.subTextColor,
        fontSize: PxFit(13),
        marginTop: PxFit(10),
    },
    optionsContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: PxFit(12),
        borderTopRightRadius: PxFit(12),
        overflow: 'hidden',
        paddingBottom: PxFit(Theme.HOME_INDICATOR_HEIGHT),
    },
});

export default MoreOperation;
