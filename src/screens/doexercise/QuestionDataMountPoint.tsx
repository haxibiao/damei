import React,{useEffect} from 'react';
import {View} from 'react-native';
import {observer,when,DataCenter} from '../../data';
import { GQL } from '../../network';
import ExerciseStore from './ExerciseStore';
import {ApolloClient} from 'apollo-boost';

let client:ApolloClient<unknown>;

export default observer(() => {

    when(
        () => ExerciseStore.fetch,
        () => {
            //执行fetch操作
            fetchData(ExerciseStore.library_id,10);
            ExerciseStore.setFetch(false);
        }
    )
    
    function fetchData(id:number,offset:number){
        console.log('题库挂载点获取数据函数，client: ',client);
        if(client){
            client.query({
                query: GQL.QuestionListQuery,
                variables:{
                    category_id: id,
                    offset:offset
                }
            }).then((rs:any) => {
                console.log('一组题目查询结果: ',rs);
                let list = rs.data?.questions ?? [];
                ExerciseStore.setQuestions([...list]);
                ExerciseStore.setLoadingData(false);
            }).catch((err:any) => {
                console.log('一组题目查询错误: ',err)
            })
        }
    }
    
    useEffect(() => {
        //获取旧后端的 client
        client = DataCenter.App.client;
    }, [DataCenter.App.client])

    return <View/>
})