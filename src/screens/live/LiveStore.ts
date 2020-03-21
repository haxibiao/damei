import { observable, action } from 'mobx';

class LiveStore {

    @observable showlivemodal: {
        change: boolean,
        flag: boolean } = { change: false, flag: false };
    
    @observable dankamu: {name:string,message:string}[] = [
        {
            name: "Cersei Lannister",
            message: "When you play the Game of Thrones, you win or you die. There is no middle ground."
        },
        {
            name: "Tyrion Lannister",
            message: "Speaking for the grotesques, I’d have to disagree. Death is so final, whereas life is full of possibilities."
        },
        {
            name: "琼·雪诺",
            message: "害,难搞"
        },
        {
            name: "Cersei Lannister",
            message: "When you play the Game of Thrones, you win or you die. There is no middle ground."
        },
        {
            name: "Tyrion Lannister",
            message: "Speaking for the grotesques, I’d have to disagree. Death is so final, whereas life is full of possibilities."
        },
        {
            name: "琼·雪诺",
            message: "害,难搞"
        }
    ];


    @action.bound
    public setshowlivemodal(show:boolean){
        this.showlivemodal = {change:true,flag:show};
    }
    @action.bound
    public closelivemodaltower(){
        this.showlivemodal.change = false;
    }
    @action.bound
    public setDankamu(dankamu:any){
        this.dankamu = [...dankamu]
    }
}

export default new LiveStore();