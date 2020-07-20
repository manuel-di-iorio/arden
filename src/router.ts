import { Method, Socket, Request, Route, Client, Context, Message, RouteMethodListener } from './interfaces'

const routes: Route[] = []

/** Add a route */
export const on: RouteMethodListener = (method, url, middlewares?, callback?) => {
  if (typeof middlewares === 'function') {
    callback = middlewares
    middlewares = []
  }

  const params = []
  routes.push({
    method,
    url,
    params,
    regex: url instanceof RegExp ? url : new RegExp(url.replace(/(:[a-z0-9_$]+)/gi, (match) => {
      params.push(match.slice(1))
      return '(.+)'
    })),
    handlers: middlewares.concat(callback)
  })
}

// Alias methods
export const onGet: RouteMethodListener = on.bind(null, Method.GET)
export const onPost: RouteMethodListener = on.bind(null, Method.POST)
export const onPatch: RouteMethodListener = on.bind(null, Method.PATCH)
export const onPut: RouteMethodListener = on.bind(null, Method.PUT)
export const onDelete: RouteMethodListener = on.bind(null, Method.DELETE)

/** Route the incoming requests to the related handlers */
// @TODO: implement Acks for the socket.send() response with auto-retry (small timeout in this case, like 5 sec)
export const routeRequest = async (client: Client, socket: Socket, { i, m, u, d }: Request): Promise<void> => {
  for (const route of routes) {
    if (route.method !== m) continue
    const ret = route.regex.exec(u)
    if (ret === null) continue

    /** Route locals & status */
    const locals = {}
    let responseStatus = 200

    // Get the URL params
    const params = ret.slice(1).reduce((obj, item, idx) => ({ ...obj, [route.params[idx]]: item }), {})

    // Get the querystring params
    const queryIdx = u.indexOf('?')
    const query = queryIdx !== -1 ? new URLSearchParams(u.slice(queryIdx + 1)) : null

    // Create the context
    const ctx: Context = {
      socket,
      locals,
      url: u,
      params,
      query,
      body: d,
      sent: false,
      get status () { return responseStatus },
      set status (status: number) { responseStatus = status },
      send: (data) => {
        ctx.sent = true
        socket.send(JSON.stringify({ t: Message.RESPONSE, i, u, m, s: responseStatus, d: data }))
      }
    }

    // Execute the route handlers in sequence
    try {
      for (const handler of route.handlers) {
        const response = await handler(ctx)

        if (typeof response === 'object' || typeof response === 'number' || typeof response === 'string') {
          ctx.send(response)
          return
        } else if (ctx.sent) {
          return
        }
      }

      if (!ctx.sent) ctx.send()
      return
    } catch (err) {
      client.onRouteError(err, ctx)
      return
    }
  }

  // Send the NotFound error
  socket.send(JSON.stringify({ t: Message.RESPONSE, i, u, m, s: 404 }))
}
