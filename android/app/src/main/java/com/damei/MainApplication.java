package com.damei;

import com.brentvatne.react.ReactVideoPackage;

import android.app.Application;
import android.util.Log;

import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.PackageList;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.soloader.SoLoader;

import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;

import cn.jpush.reactnativejpush.JPushPackage;
import cn.jpush.android.api.JPushInterface;
// 
import com.haxibiao.ad.AdPackage;
import com.haxibiao.toolkits.ToolkitsPackage;
import com.haxibiao.vodupload.VodUploadPackage;

import com.bytedance.sdk.openadsdk.TTAdNative;
import com.bytedance.sdk.openadsdk.TTRewardVideoAd;
import com.bytedance.sdk.openadsdk.TTFullScreenVideoAd;

// import com.damei.wxapi.WxEntryPackage;
import com.theweflex.react.WeChatPackage;
import androidx.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")

      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for
      // example:

      packages.add(new JPushPackage(true, true));
      packages.add(new AdPackage());
      packages.add(new ToolkitsPackage());
      packages.add(new VodUploadPackage());
      // packages.add(new WxEntryPackage());
      packages.add(new ReactVideoPackage());
      packages.add(new WeChatPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    JPushInterface.init(this);
  }
}
