"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitResponses = exports.del = exports.put = exports.patch = exports.post = exports.get = exports.call = void 0;
let reqId = 0;
const requests = new Map();
exports.call = async (socket, method, url, data, opts = { retry: { timeout: 30000, tempts: 1, delay: 1000, incremental: 2 } }, _retry) => {
    let timeoutId;
    const responsePromise = new Promise((resolve, reject) => {
        requests.set(reqId, { resolve, reject, timeoutId });
        socket.send(JSON.stringify({ t: 0, i: reqId, u: url, m: method, d: data }));
        reqId++;
    });
    return await Promise.race([
        responsePromise
    ]);
};
exports.get = exports.call;
exports.post = exports.call;
exports.patch = exports.call;
exports.put = exports.call;
exports.del = exports.call;
exports.commitResponses = ({ i, u, d, s }) => {
    if (!requests.has(i)) {
        return;
    }
    const { resolve, reject, timeoutId } = requests.get(i);
    clearTimeout(timeoutId);
    s > 199 && s < 400 ? resolve(d) : reject({ url: u, status: s, data: d });
    requests.delete(i);
};
//# sourceMappingURL=request.js.map