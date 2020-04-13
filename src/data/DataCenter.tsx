import { observable, action } from 'mobx';
import ApolloClient from 'apollo-boost';
import { Storage } from './Storage';

// Individual Store
import AppStore from './store/AppStore';
import UserStore from './store/UserStore';

const TAG = "数据 :: 数据中心DataCenter :: \\";

// 处理对象类型  -- key声明
interface DataKeys {
    DMUser: string,
}

type DATA = number | string | boolean | DMUser;



class DataCenter {
    @observable public App = new AppStore();
    @observable public User = new UserStore();
    
    @observable public navigation:any = null;

    constructor(){
        /**
         *  在这初始化相关操作
         */
    }

    @action.bound
    public setNavigation(navigation:any){
        this.navigation = navigation;
    }

    /**********************************
     * AppStore 操作模块
     **********************************
     */
    @action.bound
    public AppSetClient(client:ApolloClient<unknown>){
        this.App.client = client;
    }
    @action.bound
    public AppSetNewClient(client:ApolloClient<unknown>){
        this.App.newclient = client;
    }

    @action.bound
    public AppSetSufficientPermissions(sufficient: boolean){
        this.App.sufficient_permissions = sufficient;
    }
    @action.bound
    public AppSetNetworkConnection(connected: boolean){
        this.App.network_connected = connected;
    }

     /**********************************
     * UserStore 操作模块
     ***********************************
     */
    @action.bound
    public UserSetStartLivePushSocket(start: boolean){
        this.User.start_livepush_socket = start;
    }
    @action.bound
    public UserSetStartLiveWatchSocket(start: boolean){
        this.User.start_livewatch_socket = start;
    }
    @action.bound
    public UserSaveUserInfo(user:DMUser){ //直接设置整个 User.me
        this.User.me = user;
    }
    @action.bound
    public UserUpdateUserInfo(user:DMUser){ //更新 User.me 的字段
        this.__ObjectTypeHandler(user,'DMUser')
    }
    @action.bound
    public UserSetLoggined(login:boolean){
        this.User.loggined = login;
    }

     /**********************************
     * @param data
     * @param key
     * 数据处理模块 ，包括对象数据，基本类型数据模块
     ***********************************
     */
     private static __souceCombine(source:any, data:any, keys:any){
        let t = source;
        if(keys.length > 0){
            for(let k of keys){
                //如果源对象中不存在该 key，则直接赋值
                let _o = t[k];
                let _t = data[k];
                if(!_o){
                    t[k] = _t;
                    //console.log('WARNING: 目标对象中存在源对象未声明属性、请检查数据，并严格声明数据类型。key: ',k,' value: ',data[k])
                }else{
                    //源对象中存在该Key,在第一层遍历中判断值的类型，如果非object类型则直接赋值。object类型还需要做数组判断
                    if(typeof _o != 'object'){
                        t[k] = data[k];
                    }else{
                        if(_o instanceof Array){
                            //数组类型
                            t[k] = [...data[k]];
                        }else{
                            //对象类型,继续做Key筛选
                            for(let key of Object.keys(_t)){
                                if(!_o[key]){
                                    t[k][key] = data[k][key];
                                    console.log('WARNING: 目标对象属性二级子对象中存在源对象二级子对象未声明属性，请检查数据，严格声明数据类型。 key: ',key,'  value: ',data[k][key]);
                                }else{
                                    t[k][key] = data[k][key];
                                }
                            }
                        }
                    }
                }
            }
        }
        return t;
    }

    @action.bound
    public __ObjectTypeHandler<T extends DATA>(data:T,key: keyof DataKeys){
        console.log("OneForAll::数据中心:: <对象类型>数据处理器 接收到的数据和key为",data,key)
        switch(key){
            case 'DMUser':
                let source_user :DMUser = this.User.me;
                let IncomeObjKeys_user = Object.keys(data);
                let resultSource_user = DataCenter.__souceCombine(source_user,data,IncomeObjKeys_user);
                this.User.me = {...resultSource_user};
                break;
            //TODO: ADD MORE
            default:
                console.error("Error: 数据类型未注册，请检查数据中心已注册数据类型");
        }
    }
}

export default new DataCenter();
