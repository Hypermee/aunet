import qs from 'qs';
import http from './http';

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
      Cookie: 'JSESSIONID=' + JSESSIONID,
      'Content-Type': 'application/json'
    }
  });

  if(res.statusCode !== 200) return false;

  try {
    res = JSON.parse(res.data)
  } catch { }


  return !!res["success"];
}

export default Login;
