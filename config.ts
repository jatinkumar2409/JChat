import * as Device from "expo-device";

export const BACKEND_URL= Device.isDevice ? "http://192.168.31.95:8080" : 
"http://10.0.2.2:8080";


