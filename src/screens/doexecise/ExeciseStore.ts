import { observable, action } from 'mobx';

class ExeciseStore {
    
    @observable public selected_answer:string = '';

    @action.bound
    public setSelectedAnswer(select:string){
        this.selected_answer = select;
    }
    
}

export default new ExeciseStore();