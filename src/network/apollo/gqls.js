import {
    GetLivePushURL,
    EnterLiveRoom,
    RecommendLiveRoom,
    GetOnlinePeople,
    CloseLiveRoom,
    CommentLive,
    LeaveLiveRoom,
    ExceptionLiveReport,
} from './graphql/live.graphql';

import {
    Testme,
    AutoSignIn
} from './graphql/user.graphql';

import {
    QuestionQuery
} from './graphql/question.graphql';

export { 
    GetLivePushURL,
    Testme,
    EnterLiveRoom,
    RecommendLiveRoom,
    GetOnlinePeople,
    CloseLiveRoom,
    CommentLive,
    LeaveLiveRoom,
    ExceptionLiveReport, 
    AutoSignIn,//用户相关
    QuestionQuery
}