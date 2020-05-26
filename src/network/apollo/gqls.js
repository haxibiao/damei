import {
    GetLivePushURL,
    EnterLiveRoom,
    RecommendLiveRoom,
    GetOnlinePeople,
    CloseLiveRoom,
    CommentLive,
    LeaveLiveRoom,
    ExceptionLiveReport,
    GetUserInfo
} from './graphql/live.graphql';

import {
    Testme,
    AutoSignIn
} from './graphql/user.graphql';

import {
    QuestionQuery,
    QuestionListQuery,
    CategoriesQuery,
    InterestCategoriesQuery,
    AnswerMutation, 
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
    AutoSignIn,                 //用户相关
    QuestionQuery,
    QuestionListQuery,          //一组题目查询
    CategoriesQuery,            //推荐题库查询
    InterestCategoriesQuery,    //兴趣题库查询,
    AnswerMutation,             //提交题目答案
    GetUserInfo
}