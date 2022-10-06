let http: any = {}
let { net } = require('electron')

// 发送get
http.get = async (path, options, parameter = null) => {
  let json = options ? Object.assign({
    method: 'GET',
    protocol: 'http:',
    hostname: 'p.njupt.edu.cn',
    path: path,
    port: 801,
  }, options) : path;

  return await send(json, parameter)
}

// 发送post
http.post = async (path, options, parameter = null) => {
  let json = options ? Object.assign({
    method: 'POST',
    protocol: 'http:',
    hostname: 'p.njupt.edu.cn',
    path: path,
    port: 801,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, options) : path;

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

    let result: any = {
      data: ''
    }

    // 结果回调

    request.on('redirect', (statusCode: number, method: string, redirectUrl: string) => {
      result._redirectable = {
        method,
        statusCode,
        redirectUrl
      }
    })

    request.on('response', (response) => {
      result.headers = response.headers;
      result.statusCode = response.statusCode;
      response.on('data', (chunk) => {
        result.data += chunk.toString()
      })

      response.on('end', () => {
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
