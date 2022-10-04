import Core from "./core";
import { execa } from "execa";
import { RadiusErrorAry } from "./core/data";
import {getUrlParams, getISPSuffix, strAnsi2Unicode, base64decode} from "./core/func";

const _pNjupt = "p.njupt.edu.cn";
const _pSource = "http://6.6.6.6";
const WiFiName = ["NJUPT", "NJUPT-CMCC", "NJUPT-CHINANET"];

export async function checkWiFi() {
  let ret;
  let cmd = 'netsh';
  let args = ['wlan', 'show', 'profiles'];

  try {
    ret = await execa(cmd, args);
  } catch {
    ret = "";
  }

  let all: [] = ret.stdout.match(/(?<=: )(.+)/gim);

  let WiFiQueen = [];
  for(let i in all) {
    if(WiFiName.includes(all[i])) {
      WiFiQueen.push(all[i]);
    }
  }

  return WiFiQueen;
}

export async function isConnected(ip?: string) {
  let ret: any = {};
  const cmd = 'ping';
  const args = [ip ? ip : _pNjupt, '-n', '1'];

  try {
    ret = await execa(cmd, args);
  } catch {
    ret.exitCode = 1;
  }

  return ret.exitCode === 0;
}

export async function cmdCurlTo(url?: string) {
  let ret: any = {};
  const cmd = 'curl';
  const args = ['--connect-timeout', '1', url ? url : _pSource];

  try {
    ret = await execa(cmd, args);
  } catch {
    ret.exitCode = 1;
  }

  return ret.exitCode === 0 ? ret.stdout : false;
}

export async function isOnline() {
  let ret;
  let cmd = 'netsh';
  let args = ['wlan', 'disconnect'];

  let T = await isConnected();
  if(!T) {
    // 断开当前Wi-Fi连接
    try {
      await execa(cmd, args);
    } catch { }
  } else return true;

  // 查找wifi
  let Queen = await checkWiFi();
  if(Queen.length === 0) return false;

  // 连接wifi
  cmd = 'netsh';
  args = ['wlan', 'connect', ''];

  for(let i in Queen) {
    try {
      args[2] = 'name=';
      args[2] += Queen[i];
      ret = await execa(cmd, args);
      if(ret.exitCode === 0) {
        return true;
      }
    } catch { }
  }

  return false;
}

export async function Login(account, password, ISP) {
  let F = !await isOnline();
  if(F) return [1, '没有连上正确的校园网络'];


  let T = await cmdCurlTo();
  if(!T) return [0, '已连接校园网'];

  // http连接
  let res;

  let ISPName = getISPSuffix(parseInt(ISP));
  let args = T.match(/(?<=location.href=")(.*?)(?=")/);
  let params = getUrlParams(args.length > 0 ? args[0] : "?", ["wlanacip", "wlanuserip", "wlanacname"]);

  res = await Core.default_login(account, password, ISPName, params);

  if(!res) return [2, '请求连接失败'];

  let errMsg = getUrlParams(res._redirectable.redirectUrl, ['ACLogOut', 'ErrorMsg'])

  if(errMsg['ACLogOut'] == 5) {
    let msg = '';
    let error = strAnsi2Unicode(base64decode(errMsg['ErrorMsg']));

    switch (error) {
      case "1":
        msg = '账号密码错误';
        break;
      case "512":
        msg = 'AC认证失败';
        break;
      case "2":
        msg = '终端IP已经在线';
        break;
      case "3":
        msg = '系统繁忙，请稍后再试';
        break;
      case "4":
        msg = '发生未知错误，请稍后再试';
        break;
      case "5":
        msg = 'REQ_CHALLENGE失败，请联系AC确认';
        break;
      case "6":
        msg = 'REQ_CHALLENGE超时，请联系AC确认';
        break;
      case "7":
        msg = 'Radius认证失败';
        break;
      case "8":
        msg = 'Radius认证超时';
        break;
      case "9":
        msg = 'Radius下线失败';
        break;
      case "10":
        msg = 'Radius下线超时';
        break;
      case "11":
        msg = '发生其他错误，请稍后再试';
        break;
      case "998":
        msg = 'Portal协议参数不全，请稍后再试';
        break;
      default:
        //匹配错误码则显示对应提示
        for(let i = 0; i < RadiusErrorAry.length; i++){
          let option_array = RadiusErrorAry[i].split("|");
          let regx = option_array[1];
          if(error.indexOf(regx) != -1){
            msg = option_array[2];
            break;
          }
        }

        msg = msg == '' ? '自动连接失败' : msg;
    }


    return [3, msg]
  }

  return [0, '自动连接成功'];
}

