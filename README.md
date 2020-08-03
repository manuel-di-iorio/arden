![Arden logo](https://i.imgur.com/rxbPy7f.png)

### Arden - REST routing capabilities to create full-featured WebSocket apps

<a href="https://www.patreon.com/manuel_di_iorio"><img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="38">
<a href="https://www.buymeacoffee.com/manueldiiorio" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

---

[![Join the chat at https://discord.gg/JaVKyPV](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg?style=flat)](https://discord.gg/JaVKyPV)
[![npm version](https://badge.fury.io/js/arden.svg)](https://badge.fury.io/js/arden)
![Dependencies](https://img.shields.io/badge/Dependencies-none-darklime.svg)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](https://github.com/olton/Metro-UI-CSS/blob/master/LICENSE)

## Install

```bash
$ npm install arden
```

## Usage

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

![Network example](https://i.imgur.com/OwX94MH.png)

Arden simplifies WebSocket requests and response management with a standard API and additional features


---

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

Arden is an **Open Source Project**. This means that:

> Individuals making significant and valuable contributions (via Pull Requests) are given commit-access to the project to contribute as they see fit.

See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for more details.

## License

Licensed under MIT

## Running the examples

If you want to try out the Todos List example, please install the dependencies in both folders with `npm install`, then run `npm start` to start the client and the server.

## Production note

This library is still in early development and not meant to be used in production yet.
