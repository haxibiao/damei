//直播
 import Live from '../screens/live';
 import LiveWatch from '../screens/live/LiveRoom';
 import StartLive from '../screens/live/ShowTimeStartLive';


import MainTabNavigator from './MainTabNavigator';
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

export default {
    Main: {
        screen: MainTabNavigator,
    },
    // 登录验证
    Login: {
        screen: LoginScreen,
    },
    ForgetPassword: {
        screen: ForgetPasswordScreen,
    },
    RetrievePassword: {
        screen: RetrievePasswordScreen,
    },
    PhoneBind: {
        screen: PhoneBindScreen,
    },
    VerificationPhone: {
        screen: VerificationPhoneScreen,
    },
    RegisterSetPassword: {
        screen: RegisterSetPasswordScreen,
    },
    PasswordLogin: {
        screen: PasswordLoginScreen,
    },
    // 答题
    Answer: {
        screen: AnswerScreen,
    },
    // 视频动态
    VideoPost: {
        screen: VideoPostScreen,
    },
    PostDetail: {
        screen: PostDetailScreen,
    },
    // 题目详情
    Question: {
        screen: QuestionScreen,
    },
    VideoExplanation: {
        screen: VideoExplanationScreen,
    },
    Rank: {
        screen: RankScreen,
    },
    // 提现
    Withdraws: {
        screen: WithdrawsScreen,
    },
    withdrawLogDetails: {
        screen: WithdrawLogDetailScreen,
    },
    WithdrawApply: {
        screen: WithdrawApplyScreen,
    },
    Balance: {
        screen: BalanceScreen,
    },
    // 任务
    CpcTask: {
        screen: CpcTaskScreen,
    },
    SubmitTask: {
        screen: SubmitTaskScreen,
    },
    Attendance: {
        screen: AttendanceScreen,
    },
    // 出题
    Contribute: {
        screen: ContributeScreen,
    },
    Contributes: {
        screen: ContributesScreen,
    },
    ContributeRule: {
        screen: ContributeRuleScreen,
    },
    ContributeSubmited: {
        screen: ContributeSubmitedScreen,
    },
    EditCategory: {
        screen: ContributeEditCategoryScreen,
    },
    EditOptions: {
        screen: ContributeEditOptionsScreen,
    },
    EditExplain: {
        screen: ContributeEditExplainScreen,
    },
    AskQuestion: {
        screen: AskQuestionScreen,
    },

    // 分享
    Share: {
        screen: ShareScreen,
    },
    InviteeList: {
        screen: InviteeListScreen,
    },
    AppShareCard: {
        screen: AppShareCardScreen,
    },

    // 个人
    EditProfile: {
        screen: EditScreen,
    },
    FavoritesLog: {
        screen: FavoritesLogScreen,
    },
    AnswerLog: {
        screen: AnswerLogScreen,
    },

    CommonIssue: {
        screen: CommonIssueScreen,
    },
    ModifyAliPay: {
        screen: ModifyAliPayScreen,
    },
    ModifyPassword: {
        screen: ModifyPasswordScreen,
    },
    ModifyAccount: {
        screen: ModifyAccountScreen,
    },
    VerificationCode: {
        screen: VerificationCodeScreen,
    },
    BillingRecord: {
        screen: BillingRecordScreen,
    },
    Introduce: {
        screen: IntroduceScreen,
    },
    Society: {
        screen: SocietyScreen,
    },
    Recruit: {
        screen: RecruitScreen,
    },
    MakeMoenyManual: {
        screen: MakeMoenyManualScreen,
    },
    MyPublish: {
        screen: MyPublishScreen,
    },
    // 通知
    Notification: {
        screen: NotificationScreen,
    },
    SystemNotification: {
        screen: SystemNotificationScreen,
    },
    OfficialNotice: {
        screen: OfficialNoticeScreen,
    },
    CommentNotification: {
        screen: CommentNotificationScreen,
    },
    FansNotification: {
        screen: FansNotificationScreen,
    },
    PushNotification: {
        screen: PushNotificationScreen,
    },
    LikeNotification: {
        screen: LikeNotificationScreen,
    },
    NoticeItemDetail: {
        screen: NoticeItemDetailScreen,
    },
    // 反馈
    Feedback: {
        screen: FeedbackScreen,
    },
    FeedbackDetails: {
        screen: FeedbackDetails,
    },
    // 举报
    ReportUser: {
        screen: ReportUserScreen,
    },
    ReportComment: {
        screen: ReportCommentScreen,
    },
    ReportQuestion: {
        screen: ReportQuestionScreen,
    },
    // 用户
    User: {
        screen: UserScreen,
    },
    //  设置
    Setting: {
        screen: SettingScreen,
    },
    AccountSecurity: {
        screen: AccountSecurityScreen,
    },
    GradeDescription: {
        screen: GradeDescriptionScreen,
    },
    UserProtocol: {
        screen: UserProtocolScreen,
    },
    ShareApp: {
        screen: ShareAppScreen,
    },
    AboutUs: {
        screen: AboutUsScreen,
    },
    UpdateLog: {
        screen: UpdateLogScreen,
    },
    PrivacyPolicy: {
        screen: PrivacyPolicyScreen,
    },
    SetLoginInfo: {
        screen: SetLoginInfoScreen,
    },
    liveroom: {
        screen: Live
    },
    startlive: {
        screen: StartLive
    },
    livewatch: {
        screen: LiveWatch
    }
};
