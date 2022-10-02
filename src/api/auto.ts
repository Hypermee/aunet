import Core from "./core";
import { execa } from "execa";
import { getUrlParams, getISPSuffix } from "./core/func";

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
        // 等待连接成功
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true)
          }, 500)
        })
        return await isConnected();
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
  let params = getUrlParams(T);
  let ISPName = getISPSuffix(ISP);

  res = await Core.default_login(account, password, ISPName, params);

  if(!res) return [2, '请求连接失败'];

  console.log(res);

  return [0, '自动连接成功'];
}

