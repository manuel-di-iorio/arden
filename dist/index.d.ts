import { Socket, Deferred, Client } from './interfaces';
export declare const create: (socket: Socket) => Client;
export declare const cancelToken: () => Deferred;
