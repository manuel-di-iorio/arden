import React, { useState } from 'react'
import { create } from "arden"

const socket = new WebSocket("ws://localhost:4000")
const arden = create(socket)

function App() {
  const [todos, setTodos] = useState([])

  const addTodo = async () => {
    try {
      await arden.post("/todos", { text: "Improve tests!" })
      const todos = await arden.get("/todos")
      setTodos(todos.map((todo, key) => ({...todo, key })))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div><button onClick={() => addTodo()}>Add todo</button></div>

      <div>
        <h3>Todos:</h3>
        {todos.length ? todos.map(todo => <div key={todo.key}>{todo.text}</div>) : "No todos yet"}
      </div>
    </>
  )
}

export default App
