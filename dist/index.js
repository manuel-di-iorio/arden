"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelToken = exports.create = void 0;
const request_1 = require("./request");
const router_1 = require("./router");
exports.create = (socket) => {
    const client = {
        socket,
        onError: console.error,
        onRouteError: (error, ctx) => {
            console.error(error);
            ctx.status = 500;
            ctx.send();
        },
        call: request_1.call.bind(null, socket),
        get: request_1.get.bind(null, socket, "GET"),
        post: request_1.post.bind(null, socket, "POST"),
        patch: request_1.patch.bind(null, socket, "PATCH"),
        put: request_1.put.bind(null, socket, "PUT"),
        delete: request_1.del.bind(null, socket, "DELETE"),
        on: router_1.on,
        onGet: router_1.onGet,
        onPost: router_1.onPost
    };
    const onEvent = (socket.on !== undefined ? socket.on.bind(socket) : socket.addEventListener.bind(socket));
    onEvent('message', async (payload) => {
        try {
            const decodedPayload = JSON.parse(typeof payload === 'string' ? payload : payload.data);
            if (decodedPayload.t === 0) {
                await router_1.routeRequest(client, socket, decodedPayload);
            }
            else {
                request_1.commitResponses(decodedPayload);
            }
        }
        catch (err) {
            client.onError(err);
        }
    });
    return client;
};
exports.cancelToken = () => {
    const deferred = {};
    deferred.builder = async (timeoutId) => await new Promise((resolve, reject) => {
        deferred.reject = (error) => {
            clearTimeout(timeoutId);
            reject(error);
        };
    });
    return deferred;
};
//# sourceMappingURL=index.js.map