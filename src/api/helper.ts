import qs from 'qs';
import http from './http';

export const Login = async function Login(account, password) {
  let res;
  let checkcode;
  let JSESSIONID;
  // 第一步，请求获取JSESSIONID
  res = await http.get('http://10.10.244.240:8080/Self/login/');

  if(res.statusCode !== 200) return false;

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

  if(res.statusCode !== 200) return false;

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

  if(res.statusCode !== 200) return false;
  let fields: any = (res.data as string).match(/(?<=}\)\()(.*?)(?=\);)/gi);

  if(!fields || fields.length < 1 || fields[0] == '') return false;

  fields = JSON.parse(fields[0]) as object;

  let username = fields!.userName + fields!.userRealName || '请先登录';

  return {
    username,
    JSESSIONID
  }

}

export default Login;