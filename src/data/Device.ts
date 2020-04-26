import DeviceInfo from 'react-native-device-info';


//FIXME: 重构3：所有class,methods 比如重构进入utils

export class Device {
    static shared: Device = new Device();
    /**
     *  设备信息
     */
    hasNotch: boolean = false;
    deviceName: string = "";
    brand: string = "";
    systemName: string = "";
    systemVersion: string = "";
    ip: string = "";
    mac: string = "";

    constructor() {
        this.init();
    }

    private init() {
        // uncomment for DEBUG

        DeviceInfo.getIpAddress().then(v => this.ip = v);
        DeviceInfo.getMacAddress().then(v => this.mac = v);
        DeviceInfo.getDeviceName().then(v => this.deviceName = v);

        this.hasNotch = DeviceInfo.hasNotch();
        this.brand = DeviceInfo.getBrand();
        this.systemName = DeviceInfo.getSystemName();
        this.systemVersion = DeviceInfo.getSystemVersion();

    }
}