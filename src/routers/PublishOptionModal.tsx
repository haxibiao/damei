import React from 'react';
import { View,Text,Dimensions,TouchableOpacity } from 'react-native';
import { Overlay } from 'teaset';
import { app, config } from 'store';

const {width:sw,height:sh} = Dimensions.get('window');
const ViewWidth = sw * 0.6;
const ViewHeight = ViewWidth * 0.5;

let overlaykey:any = null;
const showPublishOption = (navigation:any) => {
    const chooseView = (
        <Overlay.View overlayOpacity={0.6} style={{justifyContent: 'center',alignItems: 'center'}}>
            <View style={{height: ViewHeight,width:ViewWidth,borderRadius:8,flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate(app.login ? 'AskQuestion' : 'Login');
                    hidePublishOption();
                }} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontWeight:'bold',fontSize:17,color:'#333'}}>发布动态</Text>
                </TouchableOpacity>
                <View style={{height:'60%',width:1,backgroundColor:'#aaa'}}/>
                <TouchableOpacity onPress={() => {
          
                    navigation.navigate(app.login ? 'startlive' : 'login');
                    hidePublishOption();
                }} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontWeight:'bold',fontSize:17,color:'#333'}}>开始直播</Text>
                </TouchableOpacity>
            </View>
        </Overlay.View>
    );
    overlaykey = Overlay.show(chooseView);
}
const hidePublishOption = () => {
    Overlay.hide(overlaykey);
}

export { showPublishOption,hidePublishOption }