import { observable,action } from 'mobx';

class LocalStore {

    @observable public constellation:string = '';
    @observable public love:string = '';

    @action.bound
    public setConstellation(con:string){
        this.constellation = con;
    }
    @action.bound
    public setlove(lv:string){
        this.love = lv;
    }
}

export default new LocalStore();