import { Socket, Request, Client, RouteMethodListener } from './interfaces';
export declare const on: RouteMethodListener;
export declare const onGet: RouteMethodListener;
export declare const onPost: RouteMethodListener;
export declare const onPatch: RouteMethodListener;
export declare const onPut: RouteMethodListener;
export declare const onDelete: RouteMethodListener;
export declare const routeRequest: (client: Client, socket: Socket, { i, m, u, d }: Request) => Promise<void>;
