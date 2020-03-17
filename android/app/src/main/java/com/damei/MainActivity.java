package com.damei;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;

import com.facebook.react.ReactActivity;
import com.haxibiao.ad.AdBoss;

import org.devio.rn.splashscreen.SplashScreen;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // SplashScreen.show(this, R.style.SplashScreenTheme); // here
        super.onCreate(savedInstanceState);
        // AdBoss.init(this, "5026208"); //初始化tt广告appid (正式，不容易改动的)
    }

    @Override
    protected String getMainComponentName() {
        return "damei";
    }

    // 穿山甲激励视频广告的返回
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        try {
            if (resultCode == RESULT_OK && requestCode == 10000) {
                JSONObject json = new JSONObject();
                json.put("video_play", intent.getBooleanExtra("video_play", false));
                json.put("ad_click", intent.getBooleanExtra("ad_click", false));
                json.put("apk_install", intent.getBooleanExtra("apk_install", false));
                json.put("verify_status", intent.getBooleanExtra("verify_status", false));
                AdBoss.myBlockingQueue.add(json.toString());
            }
        } catch (JSONException e) {
            e.printStackTrace();
            AdBoss.myBlockingQueue.add(null);
        }
    }

    /**
     * 动态获取权限
     * 
     * @param requestCode
     * @param permissions
     * @param grantResults
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

}
