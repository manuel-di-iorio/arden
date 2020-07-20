const { create } = require('arden')
const WebSocket = require('ws')

const server = new WebSocket.Server({ port: 4000 })

server.on('connection', (socket) => {
  const arden = create(socket)
  const todos = []

  arden.onPost('/todos', (ctx) => {
    todos.push(ctx.body)
  })

  arden.onGet('/todos', () => todos)
})

server.on('listening', () => {
  console.log('Server started on port 4000')
})
