import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

//直播
import Live from '../screens/live';
import LiveWatch from '../screens/live/LiveRoom';
import StartLive from '../screens/live/ShowTimeStartLive';

// 登录注验证
import LoginScreen from '../screens/login';
import ForgetPasswordScreen from '../screens/login/ForgetPassword';
import RetrievePasswordScreen from '../screens/login/RetrievePassword';
import PhoneBindScreen from '../screens/login/PhoneBind';
import VerificationPhoneScreen from '../screens/login/VerificationPhone';
import RegisterSetPasswordScreen from '../screens/login/RegisterSetPassword';
import PasswordLoginScreen from '../screens/login/PasswordLogin';

// 答题
import AnswerScreen from '../screens/answer';
// 小视频
import VideoPostScreen from '../screens/media/VideoPost';
import PostDetailScreen from '../screens/post/PostDetail';
// 题目详情
import QuestionScreen from '../screens/question';
import VideoExplanationScreen from '../screens/question/VideoExplanation';
// 提现
import WithdrawsScreen from '../screens/withdraw';
import WithdrawLogDetailScreen from '../screens/withdraw/WithdrawLogDetails';
import WithdrawApplyScreen from '../screens/withdraw/WithdrawApply';
import BalanceScreen from '../screens/withdraw/Balance';
// 任务
import CpcTaskScreen from '../screens/task/CpcTask';
import SubmitTaskScreen from '../screens/task/SubmitTask';
import AttendanceScreen from '../screens/task/Attendance';
// 排行
import RankScreen from '../screens/rank';
// 出题
import ContributeScreen from '../screens/contribute';
import ContributesScreen from '../screens/contribute/Contributes';
import ContributeRuleScreen from '../screens/contribute/ContributeRule';
import ContributeSubmitedScreen from '../screens/contribute/Submit';
import ContributeEditCategoryScreen from '../screens/contribute/EditCategory';
import ContributeEditOptionsScreen from '../screens/contribute/EditOptions';
import ContributeEditExplainScreen from '../screens/contribute/EditExplain';
import AskQuestionScreen from '../screens/contribute/AskQuestion';

// 分享
import ShareScreen from '../screens/share';
import InviteeListScreen from '../screens/share/InviteeList';
import AppShareCardScreen from '../screens/share/AppShareCard';

// 个人
import EditScreen from '../screens/profile/Edit';
import FavoritesLogScreen from '../screens/profile/FavoritesLog';
import AnswerLogScreen from '../screens/profile/AnswerLog';
import CommonIssueScreen from '../screens/profile/CommonIssue';
import ModifyAliPayScreen from '../screens/profile/ModifyAliPay';
import ModifyPasswordScreen from '../screens/profile/ModifyPassword';
import ModifyAccountScreen from '../screens/profile/ModifyAccount';
import VerificationCodeScreen from '../screens/profile/VerificationCode';
import BillingRecordScreen from '../screens/profile/BillingRecord';
import IntroduceScreen from '../screens/profile/Introduce';
import SocietyScreen from '../screens/profile/Society';
import RecruitScreen from '../screens/profile/Recruit';
import MakeMoenyManualScreen from '../screens/profile/MakeMoenyManual';
import MyPublishScreen from '../screens/profile/MyPublish';
// 通知
import NotificationScreen from '../screens/notification';
import SystemNotificationScreen from '../screens/notification/SystemNotification';
import OfficialNoticeScreen from '../screens/notification/OfficialNotice';
import CommentNotificationScreen from '../screens/notification/CommentNotification';
import FansNotificationScreen from '../screens/notification/FansNotification';
import PushNotificationScreen from '../screens/notification/PushNotification';
import LikeNotificationScreen from '../screens/notification/LikeNotification';
import NoticeItemDetailScreen from '../screens/notification/NoticeItemDetail';
// 反馈
import FeedbackScreen from '../screens/feedback';
import FeedbackDetails from '../screens/feedback/FeedbackDetails';

// 举报
import ReportCommentScreen from '../screens/comment/ReportComment';
import ReportUserScreen from '../screens/user/ReportUser';
import ReportQuestionScreen from '../screens/question/ReportQuestion';

//
import UserScreen from '../screens/user';

// 设置
import SettingScreen from '../screens/setting';
import AccountSecurityScreen from '../screens/setting/AccountSecurity';
import GradeDescriptionScreen from '../screens/setting/GradeDescription';
import UserProtocolScreen from '../screens/setting/UserProtocol';
import ShareAppScreen from '../screens/setting/ShareApp';
import AboutUsScreen from '../screens/setting/AboutUs';
import UpdateLogScreen from '../screens/setting/UpdateLog';
import PrivacyPolicyScreen from '../screens/setting/PrivacyPolicy';
import SetLoginInfoScreen from '../screens/setting/SetLoginInfo';
import SettingWithdrawInfoScreen from '../screens/setting/SettingWithdrawInfo';

// 新答题页面
import DoExercise from '../screens/doexercise/Answer';

interface Options {
    headerShown: boolean;
    headerLeft?: () => JSX.Element;
    headerTitleStyle?: StyleProp<TextStyle>;
    headerBackTitle?: string;
    headerBackTitleStyle?: StyleProp<TextStyle>;
    headerBackImage?: (props: { tintColor: string }) => React.ReactNode;
    headerStyle?: any;
}
interface Router {
    name: string;
    widget: any;
    options?: any;
}

const CommonOption2: Options = {
    headerShown: false,
};

export const Routers: Router[] = [
    // 登录验证
    {
        name: 'Login',
        widget: LoginScreen,
        options: CommonOption2,
    },
    {
        name: 'ForgetPassword',
        widget: ForgetPasswordScreen,
        options: CommonOption2,
    },
    {
        name: 'RetrievePassword',
        widget: RetrievePasswordScreen,
        options: CommonOption2,
    },
    {
        name: 'PhoneBind',
        widget: PhoneBindScreen,
        options: CommonOption2,
    },
    {
        name: 'VerificationPhone',
        widget: VerificationPhoneScreen,
        options: CommonOption2,
    },
    {
        name: 'RegisterSetPassword',
        widget: RegisterSetPasswordScreen,
        options: CommonOption2,
    },
    {
        name: 'PasswordLogin',
        widget: PasswordLoginScreen,
        options: CommonOption2,
    },
    {
        name: 'Answer',
        widget: AnswerScreen,
        options: CommonOption2,
    },
    {
        name: 'VideoPost',
        widget: VideoPostScreen,
        options: CommonOption2,
    },
    {
        name: 'PostDetail',
        widget: PostDetailScreen,
        options: CommonOption2,
    },
    {
        name: 'Question',
        widget: QuestionScreen,
        options: CommonOption2,
    },
    {
        name: 'VideoExplanation',
        widget: VideoExplanationScreen,
        options: CommonOption2,
    },
    {
        name: 'Rank',
        widget: RankScreen,
        options: CommonOption2,
    },
    {
        name: 'Withdraws',
        widget: WithdrawsScreen,
        options: CommonOption2,
    },
    {
        name: 'withdrawLogDetails',
        widget: WithdrawLogDetailScreen,
        options: CommonOption2,
    },
    {
        name: 'WithdrawApply',
        widget: WithdrawApplyScreen,
        options: CommonOption2,
    },
    {
        name: 'Balance',
        widget: BalanceScreen,
        options: CommonOption2,
    },
    {
        name: 'CpcTask',
        widget: CpcTaskScreen,
        options: CommonOption2,
    },
    {
        name: 'SubmitTask',
        widget: SubmitTaskScreen,
        options: CommonOption2,
    },
    {
        name: 'Attendance',
        widget: AttendanceScreen,
        options: CommonOption2,
    },
    {
        name: 'Contribute',
        widget: ContributeScreen,
        options: CommonOption2,
    },
    {
        name: 'Contributes',
        widget: ContributesScreen,
        options: CommonOption2,
    },
    {
        name: 'ContributeRule',
        widget: ContributeRuleScreen,
        options: CommonOption2,
    },
    {
        name: 'ContributeSubmited',
        widget: ContributeSubmitedScreen,
        options: CommonOption2,
    },
    {
        name: 'EditCategory',
        widget: ContributeEditCategoryScreen,
        options: CommonOption2,
    },
    {
        name: 'EditOptions',
        widget: ContributeEditOptionsScreen,
        options: CommonOption2,
    },
    {
        name: 'EditExplain',
        widget: ContributeEditExplainScreen,
        options: CommonOption2,
    },
    {
        name: 'AskQuestion',
        widget: AskQuestionScreen,
        options: CommonOption2,
    },
    {
        name: 'Share',
        widget: ShareScreen,
        options: CommonOption2,
    },
    {
        name: 'InviteeList',
        widget: InviteeListScreen,
        options: CommonOption2,
    },
    {
        name: 'AppShareCard',
        widget: AppShareCardScreen,
        options: CommonOption2,
    },
    {
        name: 'EditProfile',
        widget: EditScreen,
        options: CommonOption2,
    },
    {
        name: 'FavoritesLog',
        widget: FavoritesLogScreen,
        options: CommonOption2,
    },
    {
        name: 'AnswerLog',
        widget: AnswerLogScreen,
        options: CommonOption2,
    },
    {
        name: 'CommonIssue',
        widget: CommonIssueScreen,
        options: CommonOption2,
    },
    {
        name: 'ModifyAliPay',
        widget: ModifyAliPayScreen,
        options: CommonOption2,
    },
    {
        name: 'ModifyPassword',
        widget: ModifyPasswordScreen,
        options: CommonOption2,
    },
    {
        name: 'ModifyAccount',
        widget: ModifyAccountScreen,
        options: CommonOption2,
    },
    {
        name: 'VerificationCode',
        widget: VerificationCodeScreen,
        options: CommonOption2,
    },
    {
        name: 'BillingRecord',
        widget: BillingRecordScreen,
        options: CommonOption2,
    },
    {
        name: 'Introduce',
        widget: IntroduceScreen,
        options: CommonOption2,
    },
    {
        name: 'Society',
        widget: SocietyScreen,
        options: CommonOption2,
    },
    {
        name: 'Recruit',
        widget: RecruitScreen,
        options: CommonOption2,
    },
    {
        name: 'MakeMoenyManual',
        widget: MakeMoenyManualScreen,
        options: CommonOption2,
    },
    {
        name: 'MyPublish',
        widget: MyPublishScreen,
        options: CommonOption2,
    },
    {
        name: 'Notification',
        widget: NotificationScreen,
        options: CommonOption2,
    },
    {
        name: 'SystemNotification',
        widget: SystemNotificationScreen,
        options: CommonOption2,
    },
    {
        name: 'OfficialNotice',
        widget: OfficialNoticeScreen,
        options: CommonOption2,
    },
    {
        name: 'CommentNotification',
        widget: CommentNotificationScreen,
        options: CommonOption2,
    },
    {
        name: 'FansNotification',
        widget: FansNotificationScreen,
        options: CommonOption2,
    },
    {
        name: 'PushNotification',
        widget: PushNotificationScreen,
        options: CommonOption2,
    },
    {
        name: 'LikeNotification',
        widget: LikeNotificationScreen,
        options: CommonOption2,
    },
    {
        name: 'NoticeItemDetail',
        widget: NoticeItemDetailScreen,
        options: CommonOption2,
    },
    {
        name: 'Feedback',
        widget: FeedbackScreen,
        options: CommonOption2,
    },
    {
        name: 'FeedbackDetails',
        widget: FeedbackDetails,
        options: CommonOption2,
    },
    {
        name: 'ReportUser',
        widget: ReportUserScreen,
        options: CommonOption2,
    },
    {
        name: 'ReportComment',
        widget: ReportCommentScreen,
        options: CommonOption2,
    },
    {
        name: 'ReportQuestion',
        widget: ReportQuestionScreen,
        options: CommonOption2,
    },
    {
        name: 'User',
        widget: UserScreen,
        options: CommonOption2,
    },
    {
        name: 'Setting',
        widget: SettingScreen,
        options: CommonOption2,
    },
    {
        name: 'AccountSecurity',
        widget: AccountSecurityScreen,
        options: CommonOption2,
    },
    {
        name: 'GradeDescription',
        widget: GradeDescriptionScreen,
        options: CommonOption2,
    },
    {
        name: 'UserProtocol',
        widget: UserProtocolScreen,
        options: CommonOption2,
    },
    {
        name: 'ShareApp',
        widget: ShareAppScreen,
        options: CommonOption2,
    },
    {
        name: 'AboutUs',
        widget: AboutUsScreen,
        options: CommonOption2,
    },
    {
        name: 'UpdateLog',
        widget: UpdateLogScreen,
        options: CommonOption2,
    },
    {
        name: 'PrivacyPolicy',
        widget: PrivacyPolicyScreen,
        options: CommonOption2,
    },
    {
        name: 'SetLoginInfo',
        widget: SetLoginInfoScreen,
        options: CommonOption2,
    },
    {
        name: 'SettingWithdrawInfo',
        widget: SettingWithdrawInfoScreen,
        options: CommonOption2,
    },
    //
    {
        name: 'liveroom',
        widget: Live,
        options: CommonOption2,
    },
    {
        name: 'startlive',
        widget: StartLive,
        options: CommonOption2,
    },
    {
        name: 'livewatch',
        widget: LiveWatch,
        options: CommonOption2,
    },
    {
        name: 'exercise',
        widget: DoExercise,
        options: CommonOption2,
    },
];
