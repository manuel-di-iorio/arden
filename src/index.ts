import { Socket, Deferred, Client, Message, Method } from './interfaces'
import { call, get, post, patch, put, del, commitResponses } from './request'
import { on, onGet, onPost, routeRequest } from './router'

/** Create a new Arden instance, by attaching the socket to it and start listening to messages */
export const create = (socket: Socket): Client => {
  const client: Client = {
    socket,
    onError: console.error,
    onRouteError: (error, ctx) => {
      console.error(error)
      ctx.status = 500
      ctx.send()
    },
    call: call.bind(null, socket),
    get: get.bind(null, socket, Method.GET),
    post: post.bind(null, socket, Method.POST),
    patch: patch.bind(null, socket, Method.PATCH),
    put: put.bind(null, socket, Method.PUT),
    delete: del.bind(null, socket, Method.DELETE),
    on,
    onGet,
    onPost
  }

  // Handle the incoming messages
  const onEvent = (socket.on !== undefined ? socket.on.bind(socket) : socket.addEventListener.bind(socket))
  onEvent('message', async (payload: any) => {
    try {
      const decodedPayload = JSON.parse(typeof payload === 'string' ? payload : payload.data)

      if (decodedPayload.t === Message.REQUEST) {
        await routeRequest(client, socket, decodedPayload)
      } else {
        commitResponses(decodedPayload)
      }
    } catch (err) {
      client.onError(err)
    }
  })

  return client
}

/** Get a cancel token. It is used to cancel pending requests */
export const cancelToken = (): Deferred => {
  const deferred: Deferred = {}
  deferred.builder = async (timeoutId: number) => await new Promise((resolve, reject) => {
    deferred.reject = (error: Error) => {
      clearTimeout(timeoutId) // Clear the request retry timeout
      reject(error)
    }
  })
  return deferred
}
