![Arden logo](https://i.imgur.com/rxbPy7f.png)

### Arden adds REST routing capabilities to create full-featured WebSocket apps

## Example

Client:
```ts
const user = await arden.get("/users/24")
```

Server:
```ts
arden.onGet("/users/:id", ctx => db.users.findById(ctx.params.id))
```
---

**Under the hood, Arden does something like this (pseudocode):**

Client:
```ts
const user = await new Promise((resolve, reject) => {
    socket.on("message", (payload) => {
        const { url, data } = JSON.parse(payload)
        if (url === "/users/24") resolve(data)
    })

    socket.send(JSON.stringify({ 
        url: "/users/24",
        method: "GET" 
    }))
})
```

Server:
```ts
socket.on("message", (payload) => {
    const { url, method } = JSON.parse(payload)
    if (url === "/users/24" && method === "GET") {
        socket.send(JSON.stringify({ username: "Harry" }))
    }
})
```

Arden simplifies WebSocket requests and response management with a standard API and additional features

---

## Install

```bash
$ npm install arden
```

## Features

- REST requests with websockets
- Auto-retry based on request timeout and acks [@TODO]
- Promise based (you can await responses!)
- Isomorphic (works both on client and server)
- Requests cancellation [@TODO]
- Request/response interceptors [@TODO]
- Router middlewares and sub routers [@TODO]
- Status codes and errors management
- JSON messages
- No dependencies and lightweight size (1.3kb minified and gzipped)

## Documentation

You can read the [Getting Started](./docs/GETTING_STARTED.md) tutorial or the full [API documentation](./docs/LATEST.md)

## Contributing

It is very appreciated that you're reading this, because Arden needs volunteer developers to help this project come to fruition! Checkout the guidelines [here](./CONTRIBUTING.md)

## License

MIT

## Running the examples

If you want to try out the Todos List example, please install the dependencies in both folders with `npm install`, then run `npm start` to start the client and the server.

## Production note

This library is still in early development and not meant to be used in production yet
