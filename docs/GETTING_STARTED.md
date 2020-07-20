# Getting started

**Install Arden both on your client and server:**

```bash
$ npm install arden
```

**Full example using SocketIO to add and retrieve a list of todos**

Client:
```ts
import { create } from 'arden'
import socketIOClient from 'socket.io-client'

const socket = socketIOClient('localhost:4000')
const arden = create(socket)

(async () => {
    try {
        await arden.post("/todos", { text: "Improve tests!" })
        const todos = await arden.get("/todos")
        console.log(todos) // [{ text: "Improve tests!" }]
    } catch (err) {
        console.error(err)
    }
})()
```

Server:

```js
const { create } = require('arden')
const socketIO = require('socket.io')

const server = socketIO(4000)
server.on('connection', (socket) => {
    const arden = create(socket)
    const todos = []

    arden.onPost("/todos", (ctx) => {
        todos.push(ctx.body)
    })

    arden.onGet("/todos", () => todos)
})
```

---

### You can find the full API documentation [here](./LATEST.md)
