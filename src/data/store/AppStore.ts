import { observable } from 'mobx';
import ApolloClient from 'apollo-boost';

class AppStore {

    @observable public network_connected: boolean = true;
    @observable public appLoading: boolean = true;

    //Apollo Client 新旧均保留
    @observable public client:ApolloClient<unknown>  = null;
    @observable public newclient:ApolloClient<unknown>  = null;

    /**
     **********************
     *  直播相关
     **********************
     */

    //是否有足够的权限开启直播( 麦克风，摄像头 )
    @observable public sufficient_permissions: boolean = false;

    /**
     **********************
     *  动态开关相关
     **********************
     */
    @observable public ad_configs = {};

}

export default AppStore;

