import { observable, action, runInAction } from 'mobx';
import user from './user';
import { keys, storage } from './storage';
import Config from '../utils/Config';
import exceptionCapture from '../common/helper/exceptionCapture';
import { syncGetter } from '../common/helper/adapter';
import { GQL } from '../service/graphql';
class app {
    @observable me = {};
    @observable login = false;
    @observable fetching = false;
    @observable contributeRuleRead = false;
    @observable firstReadSpiderVideoTask = false;
    @observable firstOpenVideoOperation = false;
    @observable echo = null;
    @observable resetVersion = 1;
    @observable userCache = null;
    @observable taskCache = null;
    @observable categoryCache = null;
    @observable noTicketTips = true;
    @observable unreadNotice = 0;
    @observable withdrawTips = false;
    @observable newClient = {};
    @observable client = {};
    @observable modelDisplay = false;
    @observable config: object = {
        max_signs_day: 31,
    };
    @observable sufficient_permissions: boolean = false;

    @action.bound
    setClient(c){
        this.client = c;
    }
    @action.bound
    setNewClient(c){
        this.newClient = c;
    }
    @action.bound
    AppSetSufficientPermissions(sufficent) {
        this.sufficient_permissions = sufficent;
    }

    @action.bound
    setFetching(isFetching) {
        this.fetching = isFetching;
    }

    @action.bound
    async recallUser() {
        console.log('recallUser222');
        const json = await storage.getItem(keys.me);
        const resetVersion = await storage.getItem(keys.resetVersion);
        console.log('json', json);
        console.log('resetVersion', resetVersion, Config.AppVersionNumber);
        if (json && resetVersion == Config.AppVersionNumber) {
            runInAction(() => {
                // this.me = new user(json.id, json.name, json.avatar, json.token);
                this.me = json;
                this.login = true;
                global.TOKEN = json.token;
            });
        }
    }

    @action.bound
    async remember(json) {
        await storage.setItem(keys.me, json);
        // this.me = json;
        // runInAction(() => {
        //   // this.me = new user(json.id, json.name, json.avatar, json.token);
        //   this.me = json;
        // });
    }

    @action.bound
    async signIn(json) {
        this.me = json;
        this.login = true;
        global.TOKEN = json.token;
        await storage.setItem(keys.me, json);
    }

    @action.bound
    async forget() {
        await storage.removeItem(keys.me);
        await storage.removeItem(keys.viewedVersion);
        await storage.removeItem(keys.commentAppStoreVersion);
        await storage.removeItem(keys.contributeRuleRead);
        runInAction(() => {
            this.me = {};
        });
    }

    @action.bound
    signOut() {
        this.me = {};
        this.login = false;
        global.TOKEN = null;
    }

    @action.bound
    changeUserStatus(status: boolean) {
        this.me.isNewUser = status;
        storage.setItem(keys.me, this.me);
        this.updateUserCache(this.me);
    }

    @action.bound
    changeAvatar(avatarUrl) {
        this.me.avatar = avatarUrl;
    }

    @action.bound
    recordOperation(noTicketTips) {
        this.noTicketTips = noTicketTips;
    }

    // 记住已查看出题规则
    @action.bound
    async updateContributeRuleRead(contributeRuleRead) {
        this.contributeRuleRead = contributeRuleRead;
        await storage.setItem(keys.contributeRuleRead, contributeRuleRead);
    }

    // 记录已查看的版本更新提示
    @action.bound
    async updateViewedVesion(viewedVersion) {
        this.viewedVersion = viewedVersion;
        await storage.setItem(keys.viewedVersion, viewedVersion);
    }

    // 记录已查看的版本更新提示
    @action.bound
    async setReadSpiderVideoTask(firstReadSpiderVideoTask) {
        this.firstReadSpiderVideoTask = firstReadSpiderVideoTask;
        await storage.setItem(keys.firstReadSpiderVideoTask, firstReadSpiderVideoTask);
    }

    // 视频操作提示
    @action.bound
    async setOpenVideoOperation(firstOpenVideoOperation) {
        this.firstOpenVideoOperation = firstOpenVideoOperation;
        await storage.setItem(keys.firstOpenVideoOperation, firstOpenVideoOperation);
    }

    // echo对象
    @action.bound
    setEcho(echo) {
        this.echo = echo;
    }

    // 用于signToken 每个版本静默重新登录一次，防止storage数据结构改动引起的错误
    @action.bound
    async updateResetVersion(resetVersion) {
        this.resetVersion = resetVersion;
        console.log('updateResetVersion', resetVersion);
        await storage.setItem(keys.resetVersion, resetVersion);
    }

    // 用于提现后的应用商店好评提醒  每个版本只提醒一次
    @action.bound
    async updateCommentAppStoreVersion(version) {
        await storage.setItem(keys.commentAppStoreVersion, version);
    }

    @action.bound
    async updateUserCache(user) {
        this.userCache = user;
        await storage.setItem(keys.userCache, user);
    }

    @action.bound
    async updateCategoryCache(categories) {
        this.categoryCache = categories;
        await storage.setItem(keys.categoryCache, categories);
    }

    @action.bound
    async updateTaskCache(tasks) {
        this.taskCache = tasks;
        await storage.setItem(keys.taskCache, tasks);
    }

    @action.bound
    async recallCache() {
        const resetVersion = await storage.getItem(keys.resetVersion);
        this.withdrawTips = await storage.getItem(keys.withdrawTips);
        this.firstReadSpiderVideoTask = await storage.getItem(keys.firstReadSpiderVideoTask);
        this.firstOpenVideoOperation = await storage.getItem(keys.firstOpenVideoOperation);

        if (resetVersion === Config.AppVersionNumber) {
            this.userCache = await storage.getItem(keys.userCache);
            this.taskCache = await storage.getItem(keys.taskCache);
            this.categoryCache = await storage.getItem(keys.categoryCache);
        }
    }

    @action.bound
    async updateNoticeCount(count) {
        this.unreadNotice = count;
    }

    @action.bound
    async updateWithdrawTips(boolean) {
        this.withdrawTips = boolean;
        await storage.setItem(keys.withdrawTips, boolean);
    }

    @action.bound
    async updateUserInfo(key, value) {
        this.me[key] = value;
        console.log('====================================');
        console.log('this.me', this.me);
        console.log('====================================');
        await storage.setItem(keys.me, this.me);
    }

    @action.bound
    async systemConfig() {
        const [err, res] = await exceptionCapture(() => {
            return this.client.query({
                query: GQL.systemConfigQuery,
            });
        });
        console.log('err', err);
        const systemConfig = syncGetter('data.systemConfig', res);

        if (systemConfig) {
            this.config = systemConfig;
        }
    }
}

export default new app();
