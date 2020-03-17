/*
 * @flow
 * created by wyk made in 2019-01-08 13:06:22
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Overlay } from 'teaset';
import { Theme, PxFit, WPercent } from '../../utils';
import SafeText from '../Basics/SafeText';
import TouchFeedback from '../TouchableView/TouchFeedback';
import { app } from '@src/store';

interface Args {
    title?: string;
    content: any;
    onConfirm: Function;
    leftContent: string;
    rightContent: string;
    leftConfirm: Function;
}

function renderContent(content) {
    if (typeof content === 'string') {
        return <Text style={styles.messageText}>{content}</Text>;
    } else {
        return content;
    }
}

function PopOverlay(props: Args) {
    const { title, content, onConfirm, leftContent, rightContent, leftConfirm } = props;
    let overlayView, popViewRef;

    const onAppearCompleted = () => {
        app.modelDisplay = true;
    };

    const onDisappearCompleted = () => {
        app.modelDisplay = false;
    };

    overlayView = (
        <Overlay.PopView
            animated
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onAppearCompleted={onAppearCompleted}
            onDisappearCompleted={onDisappearCompleted}
            ref={ref => (popViewRef = ref)}>
            <View style={styles.overlayInner}>
                <SafeText style={styles.headerText}>{title || '提示'}</SafeText>
                {content && renderContent(content)}
                <View style={styles.control}>
                    <TouchFeedback
                        style={styles.cancel}
                        onPress={() => {
                            popViewRef.close();
                            leftConfirm && leftConfirm();
                        }}>
                        <Text style={styles.cancelText}>{leftContent || '取消'}</Text>
                    </TouchFeedback>
                    <TouchFeedback
                        style={styles.confirm}
                        onPress={() => {
                            onConfirm && onConfirm();
                            popViewRef.close();
                        }}>
                        <Text style={styles.confirmText}>{rightContent || '确定'}</Text>
                    </TouchFeedback>
                </View>
            </View>
        </Overlay.PopView>
    );
    Overlay.show(overlayView);
}

const styles = StyleSheet.create({
    cancel: {
        flex: 1,
        justifyContent: 'center',
    },
    cancelText: {
        borderRightColor: Theme.borderColor,
        borderRightWidth: PxFit(1),
        color: Theme.subTextColor,
        fontSize: PxFit(16),
        textAlign: 'center',
    },
    confirm: {
        flex: 1,
        justifyContent: 'center',
    },
    confirmText: {
        color: Theme.primaryColor,
        fontSize: PxFit(16),
        textAlign: 'center',
    },
    control: {
        alignItems: 'stretch',
        borderTopColor: Theme.borderColor,
        borderTopWidth: PxFit(1),
        flexDirection: 'row',
        height: PxFit(46),
    },
    headerText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(19),
        textAlign: 'center',
    },
    messageText: {
        color: Theme.secondaryTextColor,
        fontSize: PxFit(16),
        lineHeight: PxFit(20),
        marginVertical: PxFit(20),
        textAlign: 'center',
    },
    overlayInner: {
        backgroundColor: '#fff',
        borderRadius: PxFit(6),
        paddingHorizontal: PxFit(20),
        paddingTop: PxFit(20),
        width: WPercent(80),
    },
});

export default PopOverlay;
