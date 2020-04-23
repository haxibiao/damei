import { observable, action } from 'mobx';

class ExerciseStore {

    @observable public fetch:boolean = false;               //是否获取题目数据
    @observable public library_id: number = -1;             //题库ID
    @observable public questions: any[] = [];               //题目数组
    @observable public loading_data:boolean = true;         //是否正在获取题目数据
    @observable public correct_answer:string = '';          //正确答案
    @observable public answer_stack:string[] = [];               //用户选择的答案栈

    @observable public verify_answer: boolean = false;      //是否进行答案校验

    @action.bound
    public reset(){
        this.fetch = false;
        this.library_id = -1;
        this.questions = [];
        this.loading_data = true;
        this.correct_answer = '';
        this.answer_stack = [];
        this.verify_answer = false;
    }

    @action.bound
    public switchQuestion(){
        let temp = this.questions;
        temp.splice(0,1);
        this.questions = [...temp];
    }

    /**
     * @param fetch 
     * 设置 fetch 标志状态，如果为true则执行题目数据获取
     */
    @action.bound
    public setFetch(fetch:boolean){
        this.fetch = fetch;
    }

    /**
     * @param loading_data
     * 设置加载状态，默认true，表示在获取题目
     */
    @action.bound
    public setLoadingData(loading:boolean){
        this.loading_data = loading;
    }

    /**
     * @param select 
     * 设置当前题库的ID
     */
    @action.bound
    public setLibraryId(id:number){
        this.library_id = id;
    }

    /**
     * @param verify 
     * 校验答案
     */
    @action.bound
    public setVerifyAnswer(verify:boolean){
        this.verify_answer = verify;
    }

    @action.bound
    public setCorrectAnswer(answer:string){
        this.correct_answer = answer;
    }

    @action.bound
    public setSelectAnswer(selects:string[]){
        this.answer_stack = selects;
    }

    @action.bound
    public setQuestions(questions:any[]){
        this.questions = questions;
    }
    
}

export default new ExerciseStore();