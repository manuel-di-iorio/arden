import { call, get, post, patch, put, del } from './request'
import { onGet, onPost, on } from './router'

export interface Deferred {
  builder?: (timeoutId: number) => Promise<void>
  reject?: (reason?: any) => void
}

export const enum Message {
  REQUEST,
  RESPONSE
}

/* Request */
export const enum Method {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface RequestOptions {
  /** Retry options */
  retry?: {
    timeout?: number
    tempts?: number
    delay?: number
    incremental?: number
  }

  /** Cancellation token */
  cancelToken?: Deferred
}

export type RequestMethod = (socket: Socket, url: string, data?: unknown, opts?: RequestOptions) => Promise<unknown>

export interface Request {
  i: number // Request ID
  t: number // Message type
  u: string // URL
  m: string // Method
  d?: unknown // Data
}

/* Response */
export interface Context {
  socket: Socket
  locals: unknown
  url: string
  params: unknown
  query: unknown
  body: unknown
  sent: boolean
  status: number
  send: (data?: unknown) => void
}

export interface Response {
  i: number // Request ID
  t: number // Message type
  u: string // URL
  m: string // Method
  d?: unknown // Data
  s: number // Status
}

/* Client */
export interface Socket {
  send: (data: unknown) => {}
  on?: (event: string, data: unknown) => {}
  addEventListener?: (event: string, data: unknown) => {}
}

export interface Client {
  socket: Socket
  onError: (...data: unknown[]) => unknown
  onRouteError: (error: unknown, ctx: Context) => unknown
  call: typeof call
  get: typeof get
  post: typeof post
  patch: typeof patch
  put: typeof put
  delete: typeof del
  on: typeof on
  onGet: typeof onGet
  onPost: typeof onPost
}

/* Router */
export type RouteHandler = (ctx: Context) => Promise<unknown>

export interface Route {
  method: string
  params: string[]
  url: string | RegExp
  regex: RegExp
  handlers: RouteHandler[]
}

export type RouteMethodListener = (
  method: string,
  url: string | RegExp,
  middlewares?: RouteHandler[],
  callback?: RouteHandler
) => void
