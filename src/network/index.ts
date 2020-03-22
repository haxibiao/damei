import * as GQL from './apollo/gqls';
import useClientMaker from './apollo'
import {useApolloClient,useQuery,useLazyQuery,useMutation,useSubscription,ApolloProvider as ApolloHooksProvider} from '@apollo/react-hooks';
//兼容旧版写法
import gql from 'graphql-tag';
import {Query,Mutation} from '@apollo/react-components';
import {graphql,withApollo,withQuery,withMutation} from '@apollo/react-hoc';
import { compose } from 'recompose';
//旧版^2.5.8的 react-apollo才提供 class 组件的 ApolloProvider
import { ApolloProvider } from 'react-apollo'; 


export { 
    GQL,
    useClientMaker,
    ApolloProvider,
    ApolloHooksProvider,
    useApolloClient,
    useQuery,
    useLazyQuery,
    useMutation,
    useSubscription,
    gql,
    Query,//below -> 旧版兼容
    Mutation,
    graphql,
    withApollo,
    withQuery,
    withMutation,
    compose
}