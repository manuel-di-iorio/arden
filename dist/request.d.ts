import { Method, RequestOptions, Response, Socket, RequestMethod } from './interfaces';
export declare const call: (socket: Socket, method: Method, url: string, data?: unknown, opts?: RequestOptions, _retry?: {
    tempt: number;
    delay: number;
}) => Promise<unknown>;
export declare const get: RequestMethod;
export declare const post: RequestMethod;
export declare const patch: RequestMethod;
export declare const put: RequestMethod;
export declare const del: RequestMethod;
export declare const commitResponses: ({ i, u, d, s }: Response) => void;
