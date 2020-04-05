/// <reference types="react" />

interface DMUser {
    id?: number;
    token?: string;
    account?: string;
    name?: string;
    avatar?: string;
    gender?: number;
    gold?:number;
    ticket?:number;
    profile?:{
        introduction?:string;
        birthday?:string;
        age?:number;
        total_contributes?:number;
    };
    followers_count?:number;
    follow_users_count?:number;
    level?:{
        id?:number;
        name?:string;
        ticket_max?:number;
        level?:number;
        exp?:number
    };
    next_level_exp?:number;
    withdrawInfo?:{amount:number,description:string}[];
    wallet?:{
        id?:number;
        real_name?:string;
        balance?:number;
        available_balance?:number;
        pay_account?:string;
        open_id?:string;
        total_withdraw_amount?:number;
        pay_info_change_count?:number
    };
    is_bind_wechat?:boolean;
    is_admin?:number;
    verified_at?:string;
    auto_uuid_user?:boolean;
    auto_phone_user?:boolean;
}
