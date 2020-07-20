import { Method, RequestOptions, Response, Socket, Message, RequestMethod } from './interfaces'

/** Request ID */
let reqId = 0

/** Response listeners map */
const requests = new Map<number, {
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
  timeoutId: number
}>()

/** Emit a websocket request */
export const call = async (
  socket: Socket,
  method: Method,
  url: string,
  data?: unknown,
  opts: RequestOptions = { retry: { timeout: 30000, tempts: 1, delay: 1000, incremental: 2 } },
  _retry?: { tempt: number, delay: number }
): Promise<unknown> => {
  let timeoutId: number

  const responsePromise = new Promise((resolve, reject) => {
    // Retry strategy
    // @TESTS NEEDED
    // if (opts.retry !== false) {
    //   const { tempts, delay, incremental, timeout } = opts.retry

    //   // Setup the timeout callback
    //   timeoutId = setTimeout(async () => {
    //     // Check if the max tempts have been reached
    //     if (_retry.tempt > tempts) {
    //       return reject(new Error('MaxRetriesReached'))
    //     }

    //     // Retry the request
    //     try {
    //       resolve(await call(socket, method, url, data, opts, {
    //         tempt: (_retry.tempt ?? 0) + 1,
    //         delay: delay * incremental
    //       }))
    //     } catch (err) {
    //       reject(err)
    //     }
    //   }, timeout)
    // }

    // Setup the response callback
    requests.set(reqId, { resolve, reject, timeoutId })

    // Emit the data
    socket.send(JSON.stringify({ t: Message.REQUEST, i: reqId, u: url, m: method, d: data }))
    reqId++
  })

  return await Promise.race([
    responsePromise
    // opts.cancelToken?.builder(timeoutId) // @TESTS NEEDED
  ])
}

// Alias methods
export const get: RequestMethod = call
export const post: RequestMethod = call
export const patch: RequestMethod = call
export const put: RequestMethod = call
export const del: RequestMethod = call

/** Commit the response promises */
export const commitResponses = ({ i, u, d, s }: Response): void => {
  if (!requests.has(i)) { return }
  const { resolve, reject, timeoutId } = requests.get(i)
  clearTimeout(timeoutId) // Clear the request retry timeout

  // Commit the main request promise
  s > 199 && s < 400 ? resolve(d) : reject({ url: u, status: s, data: d })
  requests.delete(i)
}
