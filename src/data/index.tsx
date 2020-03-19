import {observer} from 'mobx-react';
import {observable,action,when} from 'mobx';
import { Storage } from './Storage';
import DataCenter from './DataCenter';

export {
    observer,       //Mobx :: observer
    observable,     //Mobx :: observable
    action,         //Mobx :: action
    when,           //Mobx :: when
    Storage,        //持久化存储工具函数
    DataCenter,      //全局数据管理中心 (Include : AppStore, UserStore)
}