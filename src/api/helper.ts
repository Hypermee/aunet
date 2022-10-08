import qs from 'qs';
import http from './http';
import Core from "./core";
import {base64decode, getISPSuffix, getUrlParams, strAnsi2Unicode} from "./core/func";
import {RadiusErrorAry} from "./core/data";

const Store = require('electron-store');
let store = new Store();

const setCheckCode = (csrftoken, JSESSIONID, confirm?: boolean) => {
  // const ip = store.get('ip');
  //
  // if(!/^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/.test(ip)) return;
  //
  // let args = ip.split('.').map((item, index) => {
  //   let len = item.length;
  //   if(index != 0 && len < 3) {
  //     for(let i = 0;i < 3 - len;i++) {
  //       item = '0' + item;
  //     }
  //   }
  //
  //   return item.toString();
  // });
  //
  // let ipNum = '';
  //
  // for(let i in args) {
  //   ipNum += args[i];
  // }
  //
  // // @ts-ignore
  // let checkCode = ipNum.toString(36);
  const ip = store.get('ip');
  let checkCode = confirm ? '' : (ip?.wlanacip || '') + '|' + (ip?.wlanuserip || '') + '|' + (ip?.wlanacname || '');

  http.post('http://10.10.244.240:8080/Self/setting/updateUserSecurity', {
    hostname: '10.10.244.240',
    port: 8080,
    headers: {
      Cookie: 'JSESSIONID=' + JSESSIONID,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, qs.stringify({
    csrftoken,
    checkCode,
  }));
}

export const Login = async function Login(account, password, JSESSIONID) {
  if(JSESSIONID !== '') return await refresh(JSESSIONID);

  let res;
  let checkcode;
  // 第一步，请求获取JSESSIONID
  res = await http.get('http://10.10.244.240:8080/Self/login/');

  if(res.statusCode != 200) return false;

  try {
    JSESSIONID = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
    checkcode = (res.data as string).match(/(?<=name="checkcode" value=")(.*?)(?=")/gi)

    if(!checkcode || checkcode.length < 1) return false;

    checkcode = parseInt(checkcode[0]);
  } catch {
    return false;
  }

  // 激活会话，为了下一步的登录
  res = await http.get('http://10.10.244.240:8080/Self/login/randomCode', {
    hostname: '10.10.244.240',
    port: 8080,
    headers: {
      Cookie: 'JSESSIONID=' + JSESSIONID
    }
  });


  if(res.statusCode != 200) return false;

  // 最终登录
  res = await http.post('http://10.10.244.240:8080/Self/login/verify', {
    hostname: '10.10.244.240',
    port: 8080,
    headers: {
      Cookie: 'JSESSIONID=' + JSESSIONID,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, qs.stringify({
    account,
    password,
    checkcode
  }));


  if(res.statusCode != 200) return false;


  let fields: any = (res.data as string).match(/(?<=}\)\()(.*?)(?=\);)/gi);

  if(!fields || fields.length < 1 || fields[0] == '' || fields[0] == "''") return false;

  fields = JSON.parse(fields[0]) as object;

  let username = fields!.userName + fields!.userRealName || '';


  let args = (res.data as string).match(/(?<=csrftoken: ')(.*?)(?=',)/gi)
  let csrftoken = (!args || args.length < 1 || args[0] == '' || fields[0] == "''") ? '' : args[0];

  setCheckCode(csrftoken, JSESSIONID)

  return {
    username,
    JSESSIONID,
    userdata: fields
  }

}

export const refresh = async (JSESSIONID) => {
  // 刷新会话
  let res = await http.get('http://10.10.244.240:8080/Self', {
    hostname: '10.10.244.240',
    port: 8080,
    headers: {
      Cookie: 'JSESSIONID=' + JSESSIONID
    }
  });

  if(res.statusCode !== 200) return false;

  let fields: any = (res.data as string).match(/(?<=}\)\()(.*?)(?=\);)/gi);

  if(!fields || fields.length < 1 || fields[0] == '' || fields[0] == "''") return false;

  fields = JSON.parse(fields[0]) as object;

  let username = fields!.userName + fields!.userRealName || '';


  let args = (res.data as string).match(/(?<=csrftoken: ')(.*?)(?=',)/gi);
  let csrftoken = (!args || args.length < 1 || args[0] == '' || fields[0] == "''") ? '' : args[0];

  setCheckCode(csrftoken, JSESSIONID);

  return {
    username,
    JSESSIONID,
    userdata: fields
  }
}

export async function getOnlineList(JSESSIONID) {
  let res = await http.get('http://10.10.244.240:8080/Self/dashboard/getOnlineList', {
    hostname: '10.10.244.240',
    port: 8080,
    headers: {
      Cookie: 'JSESSIONID=' + JSESSIONID
    }
  });

  if(res.statusCode !== 200) return false;

  let list;

  try {
    list =  JSON.parse(res.data)
  } catch { }

  return list ? list : false;
}

export async function logoutOnline(sessionid, JSESSIONID) {
  let res = await http.get('http://10.10.244.240:8080/Self/dashboard/tooffline?sessionid=' + sessionid, {
    hostname: '10.10.244.240',
    port: 8080,
    headers: {
      Cookie: 'JSESSIONID=' + JSESSIONID
    }
  });

  if(res.statusCode !== 200) return false;

  try {
    res = JSON.parse(res.data)
  } catch { }

  return !!res["success"];
}

export async function remoteLogin(options) {
  const { JSESSIONID = '', account = '', password = '', ISP = '0' } = options;

  if(JSESSIONID == '') return false;

  let res = await http.get('http://10.10.244.240:8080/Self/setting/personList', {
    hostname: '10.10.244.240',
    port: 8080,
    headers: {
      Cookie: 'JSESSIONID=' + JSESSIONID
    }
  });

  if(res.statusCode !== 200) return false;

  let fields: any = (res.data as string).match(/(?<=}\)\()(.*?)(?=\);)/gi);

  if(!fields || fields.length < 1 || fields[0] == '' || fields[0] == "''") return [9, '授权码已失效'];

  fields = JSON.parse(fields[0]) as object;

  let checkCode = fields.userExtar.checkCode;
  let username = fields!.userName + fields!.userRealName || '';

  let ipArgs;

  try {
    ipArgs = checkCode.split('|');
  } catch {
    return [8, '没有远程上线请求', { ip: '', username }];
  }

  let ip = ipArgs[1] || '';

  // 清除checkCode
  let args = (res.data as string).match(/(?<=csrftoken: ')(.*?)(?=',)/gi)
  let csrftoken = (!args || args.length < 1 || args[0] == '' || args[0] == "''") ? '' : args[0];
  setCheckCode(csrftoken, JSESSIONID, true);

  // 没有请求上线的IP
  if(
    ipArgs.length !== 3 ||
    !/^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/.test(ipArgs[0]) ||
    !/^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/.test(ipArgs[1]) ||
    ipArgs[2] == ''
  ) {

    if(
        /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/.test(ipArgs[1])
        && ipArgs[0] == '' && ipArgs[2] == ''
    ) {
      let ip = store.get('ip');
      ipArgs[0] = ip?.wlanacip || null;
      ipArgs[2] = ip?.wlanacname || null;

    } else return [1, '没有远程上线请求', { ip, username }];
  }

  res = await http.get('http://p.njupt.edu.cn:801/eportal/?c=ACSetting&a=checkScanIP&wlanuserip=' + ipArgs[1]);

  let isLogin;

  try {
    isLogin = (JSON.parse(res.data.slice(2, res.data.length - 1))["result"]) == 'ok';
  } catch { }

  if(isLogin) return [0, '该用户已联网', { ip, username }];

  if(res.statusCode !== 200) return [false, null, { ip, username }];

  let ISPName = getISPSuffix(parseInt(ISP));
  let params = { wlanacip: ipArgs[0] || null, wlanuserip: ipArgs[1] || null, wlanacname: ipArgs[2] || null };
  res = await Core.default_login(account, password, ISPName, params);

  if(!res) return [2, '请求连接失败', { ip, username }];

  let errMsg = getUrlParams(res._redirectable.redirectUrl, ['ACLogOut', 'ErrorMsg'])

  if(errMsg['ACLogOut'] == 5) {
    let msg = '';
    let error = '';

    try {
      error = strAnsi2Unicode(base64decode(errMsg['ErrorMsg']))
    } catch { }

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
          if(error?.indexOf(regx) != -1){
            msg = option_array[2];
            break;
          }
        }

        msg = msg == '' ? '远程上线失败' : msg;
    }


    return [3, msg, { ip, username }]
  }

  return [0, '远程上线成功', { ip, username }]

}

export default Login;
