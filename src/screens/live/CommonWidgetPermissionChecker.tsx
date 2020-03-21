import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
const { width: sw, height: sh } = Dimensions.get("window");
import { Overlay } from "teaset";
import { observer,DataCenter } from '../../data';
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

const BOXWIDTH = sw * 0.86;
const MicroIcon = require("./res/maikefeng.png");
const CameraIcon = require("./res/xiangji.png");

const GRANT = "已授权";
const CHECKING = "检查中";
const UNAVAILABLE = "该项不可用";
const BLOCK = "已禁用、请手动授予权限";
const DENY = "已拒绝";

const DEFAULT = "#333";
const GREEN = "green";
const BAD = "red";

const PermissionView = observer((props: any) => {
  const [camerastatus, setcamerastatus] = useState(CHECKING);
  const [microstatus, setmicrostatus] = useState(CHECKING);
  const [cameracolor, setcamearcolor] = useState(DEFAULT);
  const [microcolor, setmicrocolor] = useState(DEFAULT);
  const [checkdone, setcheckdone] = useState(false);

  useEffect(() => {
    // 检查相机授权
    check(PERMISSIONS.ANDROID.CAMERA).then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          setcamerastatus(UNAVAILABLE);
          setcamearcolor(BAD);
          //检查麦克风授权
          MicroCheck();
          break;
        case RESULTS.GRANTED:
          setcamerastatus(GRANT);
          setcamearcolor(GREEN);
          //检查麦克风授权
          MicroCheck();
          break;
        case RESULTS.DENIED:
            request(PERMISSIONS.ANDROID.CAMERA)
                .then(result => {
                    if(result == RESULTS.GRANTED){
                        setcamerastatus(GRANT);
                        setcamearcolor(GREEN);
                    }else if(result == RESULTS.DENIED){
                        setcamerastatus(DENY);
                        setcamearcolor(BAD);
                    }else if(result == RESULTS.BLOCKED){
                        setcamerastatus(BLOCK);
                        setcamearcolor(BAD);
                    }
                }).then(
                    //检查麦克风授权
                    () => {
                        MicroCheck();
                    }
                );
          break;
        case RESULTS.BLOCKED:
          setcamerastatus(BLOCK);
          setcamearcolor(BAD);
          break;
      }
    });
  }, []);

  function MicroCheck(){
      check(PERMISSIONS.ANDROID.RECORD_AUDIO)
        .then(result => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                  setmicrostatus(UNAVAILABLE);
                  setmicrocolor(BAD);
                  setcheckdone(true);
                  break;
                case RESULTS.GRANTED:
                  setmicrostatus(GRANT);
                  setmicrocolor(GREEN);
                  setcheckdone(true);

                  DataCenter.AppSetSufficientPermissions(true);
                  break;
                case RESULTS.DENIED:
                    request(PERMISSIONS.ANDROID.RECORD_AUDIO)
                        .then(result => {
                            if(result == RESULTS.GRANTED){
                                setmicrostatus(GRANT);
                                setmicrocolor(GREEN);
                            }else if(result == RESULTS.DENIED){
                                setmicrostatus(DENY);
                                setmicrocolor(BAD);
                            }else if(result == RESULTS.BLOCKED){
                                setmicrostatus(BLOCK);
                                setmicrocolor(BAD);
                            }
                        }).then(() => { 
                            setcheckdone(true);
                            if(camerastatus == GRANT && microstatus == GRANT){
                                DataCenter.AppSetSufficientPermissions(true);
                            }
                        });
                  break;
                case RESULTS.BLOCKED:
                  setmicrostatus(BLOCK);
                  setmicrocolor(BAD);
                  setcheckdone(true);
                  DataCenter.AppSetSufficientPermissions(true);
                  break;
              }
        }).then(() => {
            if(DataCenter.App.sufficient_permissions){
                DataCenter.AppSetSufficientPermissions(true);
            }else{
                DataCenter.AppSetSufficientPermissions(false);
            }
        });
  }

  return (
    <Overlay.View
      modal={true}
      animated={true}
      overlayOpacity={0.8}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <View style={styles.container}>

        <Text style={{fontSize:17,color:'#222',width:'100%',textAlign:'center',paddingBottom:15}}>直播需要打开以下权限哦~</Text>

        <View style={styles.row_item}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={CameraIcon}
              style={{ height: 25, width: 25, marginEnd: 5 }}
              resizeMode="contain"
            />
            <Text>摄像头</Text>
          </View>
          <Text style={{ color: cameracolor, fontSize: 16 }}>
            {camerastatus}
          </Text>
        </View>
        <View style={styles.row_item}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={MicroIcon}
              style={{ height: 25, width: 25, marginEnd: 5 }}
              resizeMode="contain"
            />
            <Text>麦克风</Text>
          </View>
          <Text style={{ color: microcolor, fontSize: 16 }}>{microstatus}</Text>
        </View>

        { (checkdone || DataCenter.App.sufficient_permissions) && (
          <TouchableOpacity
            onPress={() => {
              hidePermissionCheck();
            }}
            activeOpacity={0.88}
            style={styles.done_btn}
          >
            <Text style={{ color: DataCenter.App.sufficient_permissions ? "green" : "#222", fontSize: 16 }}>{DataCenter.App.sufficient_permissions ? '前往直播吧' : '关闭'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Overlay.View>
  );
});

let overlaykey: any = null;
const showPermissionCheck = () => {
  overlaykey = Overlay.show(<PermissionView />);
};
const hidePermissionCheck = () => {
  Overlay.hide(overlaykey);
};

export { showPermissionCheck, hidePermissionCheck };

const styles = StyleSheet.create({
  container: {
    width: BOXWIDTH,
    paddingHorizontal: 17,
    paddingVertical: 13,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "space-evenly",
  },
  row_item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 30,
    marginVertical: 10
  },
  done_btn:{
    width: "100%",
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  }
});
