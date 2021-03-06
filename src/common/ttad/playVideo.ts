/*
  包含看激励视频、看全屏视频 
  包含看视频广告数据上报
*/

import { Platform } from 'react-native';
import { ad } from 'native';
import { app, config } from 'store';
import { ISAndroid, Tools, Config } from 'utils';
import { RewardTipsOverlay } from 'components';
import { GQL } from 'apollo';
import service from 'service';

const reportContent = {
    category: '广告点击',
    action: 'user_click_answer_reward_ad',
    name: '答题结果选择看全屏视频',
    value: '1',
    package: Config.PackageName,
    os: Platform.OS,
    version: Config.Version,
    build: Config.Build,
    user_id: app.me.id,
    referrer: Config.AppStore,
};

type Type = 'Task' | 'AnswerPass' | 'AnswerFail' | 'Sigin' | 'TimeReward' | 'Dividend' | 'Any';

interface Reward {
    gold: 0;
    ticket: 0;
    contribute: 0;
}

interface Video {
    video_play: Boolean;
    ad_click: Boolean;
    verify_status: Boolean;
}

interface Props {
    reward?: Reward; //奖励值（兼容任务入口）
    rewardVideoAdCache?: any; //激励视频cache
    fullScreenVideoAdCache?: any; //全屏视频cache
    callback?: Function; //兼容任务列表刷新
    refresh?: any; //兼容任务列表入口刷新
    type?: Type; //看视频来源
}

export function playVideo(props: Props) {
    const { type } = props;
    const playType = Math.round(Math.random()); //随机1为看激励视频 0为看全屏视频
    //非指定Reward时  触发随机看视频  奖励值为默认类型
    if (type == 'Task' || playType) {
        playRewardVideo(props);
    } else {
        playFullScreenVideo(props);
    }
    dataReport(type, playType);
}

//看激励视频
function playRewardVideo(props: Props) {
    const { rewardVideoAdCache } = props;
    if (rewardVideoAdCache) {
        startRewardVideo(props);
    } else {
        loadRewardVideo(props);
    }
}

//加载激励视频缓存
function loadRewardVideo(props: Props) {
    ad.RewardVideo.loadAd().then((result) => {
        config.rewardVideoAdCache = result; //更新缓存
        if (result) {
            startRewardVideo(props);
        } else {
            Toast.show({ content: '激励视频加载失败' });
        }
    });
}

//播放激励视频
function startRewardVideo(props: Props) {
    const { callback, reward, refresh, type } = props;
    let video = {
        video_play: false,
        ad_click: false,
        verify_status: false,
    };
    console.log('startRward', props);
    ad.RewardVideo.startAd()
        .then((result) => {
            if (ISAndroid) {
                if (result) {
                    video = JSON.parse(result);

                    if (type === 'Task' && reward) {
                        oldGetReward(video, reward, refresh);
                        callback && callback();
                    } else {
                        getReward(props);
                    }
                } else {
                    Toast.show({
                        content: '没看完视频,或没看详情，或其他异常...',
                    });
                }
            } else {
                if (reward) {
                    oldGetReward(video, reward, refresh);
                } else {
                    getReward(props);
                }
            }
        })
        .catch((error) => {
            console.log('加载奖励视频出错:', error);
        });
}

//看全屏视频
function playFullScreenVideo(props: Props) {
    const { fullScreenVideoAdCache } = props;
    if (fullScreenVideoAdCache) {
        startFullScreenVideo(props);
    } else {
        loadFullScreenVideo(props);
    }
}

//加载全屏视频缓存
function loadFullScreenVideo(props: Props) {
    ad.FullScreenVideo.loadFullScreenVideoAd().then((result) => {
        config.fullScreenVideoAdCache = result; //更新缓存
        if (result) {
            startFullScreenVideo(props);
        } else {
            Toast.show({ content: '激励视频加载失败' });
        }
    });
}

//播放全屏视频
function startFullScreenVideo(props: Props) {
    ad.FullScreenVideo.startFullScreenVideoAd()
        .then((result: string) => {
            if (result) {
                getReward(props);
            } else {
                Toast.show({
                    content: '没看完视频，或其他异常...',
                });
            }
        })
        .catch((error) => {
            console.log('加载奖励视频出错:', error);
        });
}

//兼容任务老接口看视频奖励方法
function oldGetReward(video: Video, reward: Reward, refresh: () => void) {
    const task_id = video.ad_click ? -2 : 0;
    const title = video.ad_click ? '查看详情' : '仅看完视频';
    const rewardContent = video.ad_click ? reward : { ticket: 10, contribute: 2 };

    app.client
        .mutate({
            mutation: GQL.TaskRewardMutation,
            variables: {
                task_id,
            },
            refetchQueries: () => [
                {
                    query: GQL.UserQuery,
                    variables: { id: app.me.id },
                },
            ],
        })
        .then(() => {
            refresh();
            RewardTipsOverlay.show({ reward: rewardContent, rewardVideo: true, title: title });
        })
        .catch((err: any) => {
            console.log('err', err);
        });
}

//新看视频奖励发放
function getReward(props: Props) {
    const { type, callback } = props;
    console.log('type', type);
    let rewardType = 'VIDEO_PLAY_REWARD'; //观看视频奖励
    if (type === 'Sigin') {
        rewardType = 'SIGNIN_VIDEO_REWARD'; //签到奖励
    }
    if (type === 'AnswerPass') {
        rewardType = 'SUCCESS_ANSWER_VIDEO_REWARD'; //答题及格奖励
    }
    if (type === 'AnswerFail') {
        rewardType = 'FAIL_ANSWER_VIDEO_REWARD'; //答题不及格奖励
    }
    if (type === 'Dividend') {
        callback && callback();
        return;
    }

    const refetchQuery =
        type === 'Sigin'
            ? [
                  {
                      query: GQL.UserMetaQuery,
                      variables: { id: app.me.id },
                      fetchPolicy: 'network-only',
                  },
                  {
                      query: GQL.SignInsQuery,
                  },
              ]
            : [
                  {
                      query: GQL.UserMetaQuery,
                      variables: { id: app.me.id },
                      fetchPolicy: 'network-only',
                  },
              ];

    app.client
        .mutate({
            mutation: GQL.UserRewardMutation,
            variables: {
                reward: rewardType,
            },
            errorPolicy: 'all',
            refetchQueries: () => refetchQuery,
        })
        .then((res: any) => {
            console.log('res', res);
            const reward = Tools.syncGetter('data.userReward', res);
            RewardTipsOverlay.show({ reward, rewardVideo: true });
        })
        .catch((err: any) => {
            console.log('reward video error', err);
            Toast.show({
                content: '发生未知错误、领取失败',
            });
        });
}

//看视频数据上报
function dataReport(type: string | undefined, playType: number) {
    let action = type == 'Task' || playType ? 'user_click_reward_ad' : 'user_click_fullscreen_ad';
    let name = type == 'Task' || playType ? '点击激励视频' : '点击全屏视频';

    switch (type) {
        case 'Task':
            action = 'user_click_task_reward_ad';
            name = '点击看激励视频任务';
            break;
        case 'AnswerPass' || 'AnswerFail':
            action = playType ? 'user_click_answer_reward_ad' : 'user_click_answer_fullscreen_ad';
            name = playType ? '答题结果随机看激励视频' : '答题结果随机看全屏视频';
            break;
        case 'Sigin':
            action = playType ? 'user_click_sigin_reward_ad' : 'user_click_sigin_fullscreen_ad';
            name = playType ? '签到随机看激励视频' : '签到随机看全屏视频';
            break;
        case 'TimeReward':
            action = playType ? 'user_click_time_reward_ad' : 'user_click_time_fullscreen_ad';
            name = playType ? '时段奖励随机看激励视频' : '时段奖励随机看全屏视频';
            break;
        case 'Dividend':
            action = playType
                ? 'user_click_dividend_reward_ad'
                : 'user_click_user_click_dividend_reward_ad_fullscreen_ad';
            name = playType ? '分红随机看激励视频' : '分红随机看全屏视频';
            break;
        default:
            break;
    }

    const mergeData = {
        action,
        name,
    };
    const data = JSON.stringify({ ...reportContent, ...mergeData });
    service.dataReport(data, (result) => {
        console.warn('result', result);
    }); // 数据上报
}
