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
    QuestionQuery,
    CategoriesQuery,
    InterestCategoriesQuery
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
    QuestionQuery,
    CategoriesQuery, //推荐题库查询
    InterestCategoriesQuery,//兴趣题库查询
}