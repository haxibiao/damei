import { observable, action } from 'mobx';

class ExerciseStore {

    @observable public fetch:boolean = false;
    @observable public library_id: number = -1;
    @observable public questions: any[] = [];
    @observable public selected_answer:string = '';

    /**
     * @param fetch 
     * 设置 fetch 标志状态，如果为true则执行题目数据获取
     */
    @action.bound
    public setFetch(fetch:boolean){
        this.fetch = fetch;
    }

    /**
     * 
     * @param select 
     * 设置当前题库的ID
     */
    @action.bound
    public setLibraryId(id:number){
        this.library_id = id;
    }

    @action.bound
    public setSelectedAnswer(select:string){
        this.selected_answer = select;
    }

    @action.bound
    public setQuestions(questions:any[]){
        this.questions = questions;
    }
    
}

export default new ExerciseStore();