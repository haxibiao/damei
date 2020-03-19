import { observable, action } from 'mobx';
import { Storage } from './Storage';

// Individual Store
import AppStore from './store/AppStore';
import UserStore from './store/UserStore';

const TAG = "数据 :: 数据中心DataCenter :: \\";

// 处理对象类型  -- key声明
interface DataKeys {
    DCAssets: string,
    DCUser: string,
}
type DATA = number | string | boolean ;



class DataCenter {
    @observable public App = new AppStore();
    @observable public User = new UserStore();

    constructor(){
        /**
         *  在这初始化相关操作
         */
    }

    /**********************************
     * AppStore 操作模块
     **********************************
     */
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


     /**********************************
     * @param data 
     * @param key 
     * 数据处理模块 ，包括对象数据，基本类型数据模块
     ***********************************
     */
    @action.bound
    public DataSettingHandler< T extends DATA >(data: T,key: keyof DataKeys){
        let t = typeof(data);
        console.log("OneForAll::数据中心:: 数据处理器接收到的数据和数据类型为 : ",data,t);
        switch(t){
            case 'object':
                this.__ObjectTypeHandler(data,key);
                break;
            case 'number':
                this.__BaseTypeDataHandler(data);
                break;
            default:
                console.error("Error : 数据类型错误，请检查待处理的数据 ",data);
        }
    }

    private __souceCombine(source:any,data:any,keys:any){
        if(keys.length > 0){
            for(let k of keys){
                if(source[k] != undefined || source[k] != null){
                    source[k] = data[k]
                }else {
                    console.error("Error: 数据中存在目标对象所未拥有的数据类型，key-> ",k," value-> ",data[k]," 所有已注册类型为 : ",Object.keys(source),"传入的数据所有类型: ",keys);
                }
            }
            return source;
        }
    }

    @action.bound
    public __ObjectTypeHandler<T extends DATA>(data:T,key: keyof DataKeys){
        console.log("OneForAll::数据中心:: <对象类型>数据处理器 接收到的数据和key为",data,key)
        // switch(key){
        //     case 'DCAssets':
        //         let source:DCAssets = this.Assets;
        //         let IncomeObjKeys = Object.keys(data);
        //         // REPLACE_TAG 1
        //         let resultSource = this.__souceCombine(source,data,IncomeObjKeys);
        //         this.Assets = resultSource;
        //         break;
        //     case 'DCUser':
        //         let source_user :DCUserType = this.User.user;
        //         let IncomeObjKeys_user = Object.keys(data);
        //         let resultSource_user = this.__souceCombine(source_user,data,IncomeObjKeys_user);
        //         this.User.user = resultSource_user;
        //         break;
        //     //TODO: ADD MORE 
        //     default:
        //         console.error("Error: 数据类型未注册，请检查数据中心已注册数据类型");
        // }
    }
    @action.bound
    public __BaseTypeDataHandler<T extends DATA>(data:T){
        //处理基本类型数据更新
    }
}

export default new DataCenter();