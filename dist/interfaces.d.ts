import { call, get, post, patch, put, del } from './request';
import { onGet, onPost, on } from './router';
export interface Deferred {
    builder?: (timeoutId: number) => Promise<void>;
    reject?: (reason?: any) => void;
}
export declare const enum Message {
    REQUEST = 0,
    RESPONSE = 1
}
export declare const enum Method {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE"
}
export interface RequestOptions {
    retry?: {
        timeout?: number;
        tempts?: number;
        delay?: number;
        incremental?: number;
    };
    cancelToken?: Deferred;
}
export declare type RequestMethod = (socket: Socket, url: string, data?: unknown, opts?: RequestOptions) => Promise<unknown>;
export interface Request {
    i: number;
    t: number;
    u: string;
    m: string;
    d?: unknown;
}
export interface Context {
    socket: Socket;
    locals: unknown;
    url: string;
    params: unknown;
    query: unknown;
    body: unknown;
    sent: boolean;
    status: number;
    send: (data?: unknown) => void;
}
export interface Response {
    i: number;
    t: number;
    u: string;
    m: string;
    d?: unknown;
    s: number;
}
export interface Socket {
    send: (data: unknown) => {};
    on?: (event: string, data: unknown) => {};
    addEventListener?: (event: string, data: unknown) => {};
}
export interface Client {
    socket: Socket;
    onError: (...data: unknown[]) => unknown;
    onRouteError: (error: unknown, ctx: Context) => unknown;
    call: typeof call;
    get: typeof get;
    post: typeof post;
    patch: typeof patch;
    put: typeof put;
    delete: typeof del;
    on: typeof on;
    onGet: typeof onGet;
    onPost: typeof onPost;
}
export declare type RouteHandler = (ctx: Context) => Promise<unknown>;
export interface Route {
    method: string;
    params: string[];
    url: string | RegExp;
    regex: RegExp;
    handlers: RouteHandler[];
}
export declare type RouteMethodListener = (method: string, url: string | RegExp, middlewares?: RouteHandler[], callback?: RouteHandler) => void;
