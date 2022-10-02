let http: any = {}
let { net } = require('electron')

// 发送get
http.get = async (path, parameter, url) => {
  url = url || 'https://fundmobapi.eastmoney.com'
  let json = url + path + parameter
  return await send(json, null)
}

// 发送post
http.post = async (path, parameter, host) => {
  let json = {
    method: 'POST',
    protocol: 'http:',
    hostname: host || 'p.njupt.edu.cn',
    path: path,
    port: 801,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return await send(json, parameter)
}

// 发送请求
async function send (json, parameter) {
  return new Promise((resolve, reject) => {
    // 请求体
    let request = net.request(json)

    // 请求参数
    if (parameter) {
      request.write(parameter)
    }

    let result: any = {}

    // 结果回调

    request.on('redirect', (statusCode: number, method: string, redirectUrl: string) => {
      result._redirectable = {
        method,
        statusCode,
        redirectUrl
      }
    })

    request.on('response', (response) => {
      response.on('data', (chunk) => {
        result.data = chunk.toString()
        resolve(result);
      })
    })

    request.on('error', (err) => {
      reject(err.toString())
    })

    request.end()
  })
}

export default http
