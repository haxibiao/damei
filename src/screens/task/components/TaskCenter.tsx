import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { EmptyView } from 'components';
import { SCREEN_WIDTH, SCREEN_HEIGHT, Tools } from 'utils';
import { app, observer } from 'store';
import TaskList from './TaskList';
import { useNavigation } from 'react-navigation-hooks';
import { InviteUser } from 'common';
import { Overlay } from 'teaset';
import Invite from './Invite';

const TaskCenter = observer(() => {
    const { login } = app;
    const navigation = useNavigation();

    const onFailed = useCallback(error => {
        Toast.show({ content: error.message });
        // showInviteResult();
    }, []);

    const onSuccess = useCallback(result => {
        // Toast.show({ content: '粘贴板视频上传成功' });
        const resolveInvitation = Tools.syncGetter('data.resolveInvitation', result);
        if (resolveInvitation) {
            showInviteResult(resolveInvitation);
        }
    }, []);

    InviteUser({ client: app.client, onSuccess, onFailed });

    const showInviteResult = (resolveInvitation: any) => {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.overlayInner}>
                    <Invite hide={() => Overlay.hide(OverlayKey)} resolveInvitation={resolveInvitation} />
                </View>
            </Overlay.View>
        );
        const OverlayKey = Overlay.show(overlayView);
    };

    return React.useMemo(
        () =>
            login ? (
                <TaskList navigation={navigation} />
            ) : (
                <View style={{ marginTop: SCREEN_WIDTH * 0.5 }}>
                    <EmptyView
                        imageSource={require('../../../assets/images/default_message.png')}
                        title="登录之后才能查看任务哦"
                    />
                </View>
            ),
        [login, navigation],
    );
});

const styles = StyleSheet.create({
    overlayInner: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TaskCenter;
