"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeRequest = exports.onDelete = exports.onPut = exports.onPatch = exports.onPost = exports.onGet = exports.on = void 0;
const routes = [];
exports.on = (method, url, middlewares, callback) => {
    if (typeof middlewares === 'function') {
        callback = middlewares;
        middlewares = [];
    }
    const params = [];
    routes.push({
        method,
        url,
        params,
        regex: url instanceof RegExp ? url : new RegExp(url.replace(/(:[a-z0-9_$]+)/gi, (match) => {
            params.push(match.slice(1));
            return '(.+)';
        })),
        handlers: middlewares.concat(callback)
    });
};
exports.onGet = exports.on.bind(null, "GET");
exports.onPost = exports.on.bind(null, "POST");
exports.onPatch = exports.on.bind(null, "PATCH");
exports.onPut = exports.on.bind(null, "PUT");
exports.onDelete = exports.on.bind(null, "DELETE");
exports.routeRequest = async (client, socket, { i, m, u, d }) => {
    for (const route of routes) {
        if (route.method !== m)
            continue;
        const ret = route.regex.exec(u);
        if (ret === null)
            continue;
        const locals = {};
        let responseStatus = 200;
        const params = ret.slice(1).reduce((obj, item, idx) => ({ ...obj, [route.params[idx]]: item }), {});
        const queryIdx = u.indexOf('?');
        const query = queryIdx !== -1 ? new URLSearchParams(u.slice(queryIdx + 1)) : null;
        const ctx = {
            socket,
            locals,
            url: u,
            params,
            query,
            body: d,
            sent: false,
            get status() { return responseStatus; },
            set status(status) { responseStatus = status; },
            send: (data) => {
                ctx.sent = true;
                socket.send(JSON.stringify({ t: 1, i, u, m, s: responseStatus, d: data }));
            }
        };
        try {
            for (const handler of route.handlers) {
                const response = await handler(ctx);
                if (typeof response === 'object' || typeof response === 'number' || typeof response === 'string') {
                    ctx.send(response);
                    return;
                }
                else if (ctx.sent) {
                    return;
                }
            }
            if (!ctx.sent)
                ctx.send();
            return;
        }
        catch (err) {
            client.onRouteError(err, ctx);
            return;
        }
    }
    socket.send(JSON.stringify({ t: 1, i, u, m, s: 404 }));
};
//# sourceMappingURL=router.js.map