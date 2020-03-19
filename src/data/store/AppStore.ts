import { observable } from 'mobx';
//import { ApolloClient } from 'apollo-boost';

class AppStore {

    @observable public network_connected: boolean = true;
    //@observable public client:any = null;
    @observable public appLoading: boolean = true;

    /**
     **********************
     *  直播相关 
     **********************
     */

    //是否有足够的权限开启直播( 麦克风，摄像头 )
    @observable sufficient_permissions: boolean = false;
    
}

export default AppStore;

// @action.bound
// public setsufficient_permissions(complete: boolean) {
//     this.sufficient_permissions = complete;
// }