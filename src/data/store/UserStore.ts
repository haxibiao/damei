import { observable } from 'mobx';

class UserStore {

    @observable public me:DMUser = {};
    @observable public loggined:boolean = false;
    @observable public start_livepush_socket:boolean = false;
    @observable public start_livewatch_socket:boolean = false;
}

export default UserStore;