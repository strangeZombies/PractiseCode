//worker.js

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const targetUrl = 'https://bilibili-parse.blackwhite44.repl.co' // 目标 API 服务器地址
  const proxyUrl = targetUrl + url.pathname + url.search // 构造代理 URL

  // 构造新的请求对象，设置 headers 和方法等
  const proxyRequest = new Request(proxyUrl, {
    method: request.method,
    headers: request.headers,
    redirect: 'follow',
  })

  // 将原始请求 body 写入代理请求 body
  if (request.method === 'POST' || request.method === 'PUT') {
    proxyRequest.body = await request.clone().text()
  }

  // 转发请求到目标 API 服务器，并获取响应
  const response = await fetch(proxyRequest)

  // 返回目标 API 服务器响应
  return response
}


