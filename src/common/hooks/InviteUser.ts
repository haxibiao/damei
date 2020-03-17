import { useCallback, useEffect, useRef } from 'react';
import { AppState, Clipboard } from 'react-native';
import { GQL } from '@src/apollo';
import { exceptionCapture } from '@src/common';
import { app } from 'store';

interface Props {
    client: any;
    onSuccess?: (Event?: any) => any;
    onFailed?: (Event?: any) => any;
}

export const InviteUser = (props: Props) => {
    const { client, onSuccess, onFailed } = props;
    const clipboardString = useRef('');

    const inviteUser = useCallback(
        path => {
            return app.client.mutate({
                mutation: GQL.resolveInvitationMutation,
                variables: {
                    slogan: path,
                },
            });
        },
        [client],
    );

    const stateChangeHandle = useCallback(
        async event => {
            if (event === 'active') {
                const path = await Clipboard.getString();
                console.log('path', path);
                if (TOKEN && String(path).indexOf('答妹') !== -1) {
                    clipboardString.current = path;

                    const [error, result] = await exceptionCapture(() => inviteUser(path));
                    console.log('error', error, result);
                    if (error && onFailed) {
                        onFailed(error);
                        Clipboard.setString('');
                    } else if (result && onSuccess) {
                        onSuccess(result);
                        //清空粘贴板
                        Clipboard.setString('');
                    }
                }
            }
        },
        [inviteUser, onFailed, onSuccess],
    );

    useEffect(() => {
        AppState.addEventListener('change', stateChangeHandle);
        return () => {
            AppState.removeEventListener('change', stateChangeHandle);
        };
    }, []);
};
