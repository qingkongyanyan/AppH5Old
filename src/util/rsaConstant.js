// RSA 公钥/私钥
var rsaConstant = {};

var host = location.hostname;
// 非生产环境
var devRsaKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC29hONnZUDSiDGJQ1PuSnXEzLLrbJntCctf4yTwGG2GQW+LIzvITaaFYnrJTJHdP1AilB/OeaL1LAhQsYiMONMWLFz8nXnqbwV/oqWmjcIrXZ/CHrDyUu0DfmsEalbicUotWm+ygwK+Y9qNETnZT2VtedCMAlGd7SZhAT8NZwLSQIDAQAB`;
// 生产环境 
var proRsaKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVlF2OQ7Z0vGeG4swFFomcTD45RoHHR9CgFEuQbI8alC8RFLXht3lzxEg6vDZ4kflf+u4+5Sj0lWNeIL1ASgG+gWH8PutUyM4zC62dqMicJlrBg7goFiOmJT72NcSII37ltWCu/ENFvfqCt8Cq6J/TskX98vzRrxdSiIBjmzx5owIDAQAB`;
// 最后导出的 RSA  公钥
var rsaPublicKey = '';
var developmentEnv = "10.1.26.203"; // 开发环境
var testEnv = "10.1.26.200"; // 测试环境
var releaseEnv = "precapp.nuoyuan.com.cn"; // 准生产环境
var productionEnv = "nyapp.nuoyuan.com.cn"; // 生产环境

// 生产环境
if(host === productionEnv){
	rsaPublicKey = proRsaKey;
}else{
	// 非生产环境
	rsaPublicKey = devRsaKey;
}

rsaConstant.publicKey = rsaPublicKey;
// 导出 rsaConstant
export default rsaConstant;


