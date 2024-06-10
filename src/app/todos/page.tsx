"use client"

import axios from "axios"
import { useEffect, useState } from "react"

export type TTodo = {
  id: string,
  desc: string,
  completed: boolean
}
const TodosPage = () => {

  const [inputText, setInputText] = useState("")
  const [todos, setTodos] = useState<TTodo[]>([])
  const [editMode, setEditMode] = useState(false)
  const [editTodoInfo, setEditTodoInfo] = useState<TTodo>({
    id: "",
    desc: "",
    completed: false
  })

  useEffect(() => {
    axios.get("/api/todos")
      .then(res => {
        console.log(res.data)
        setTodos(res.data.todos)
      })
  }, [])

  const addTodo = async () => {
    const data = {
      desc: inputText
    }
    try {
      const res = await axios.post("/api/todos", data)

      const newTodo: TTodo = res.data.savedTodo; // Use the savedTodo returned from the backend

      setTodos(prevTodos => [...prevTodos, newTodo])
      setInputText(''); // Clear the input field after adding the todo

    } catch (error) {
      console.error("Failed to add the todo", error)
    }
  }

  const clearTodos = async () => {
    try {
      const res = await axios.delete("/api/todos")
      console.log(res.data)

      setTodos([])
    } catch (error) {
      console.error("Failed to clear todos", error)
    }
  }

  const deleteTodo = async (todo: TTodo) => {
    const id = todo.id

    try {
      const res = await axios.delete(`/api/todos/${id}`)

      if (res.status === 200) {
        setTodos(prevTodos => prevTodos.filter(t => t.id !== id))
      }

    } catch (error) {
      console.error("Failed to delete the todo", error)
    }
  }

  const editTodo = async (todo: TTodo) => {
    try {
      setEditMode(true)
      setEditTodoInfo({
        id: todo.id,
        desc: todo.desc,
        completed: todo.completed
      })
    } catch (error) {
      console.error("Failed to edit the todo", error)
    }
  }

  const updateTodo = async () => {
    const data = {
      desc: editTodoInfo.desc,
      completed: editTodoInfo.completed
    }
    try {
      const res = await axios.put(`/api/todos/${editTodoInfo.id}`, data)

      if (res.status === 200) {
        setTodos(prevTodos => prevTodos.map(
          todo => todo.id === editTodoInfo.id
            ? { ...editTodoInfo }
            : todo
        ))
        setEditMode(false)
      }
    } catch (error) {
      console.error("Failed to update the todo", error)
    }
  }

  const toggleTodoCompleted = async (todo: TTodo) => {
    const updatedTodo = { ...todo, completed: !todo.completed }

    try {
      const res = await axios.put(`/api/todos/${todo.id}`, { completed: updatedTodo.completed })

      if (res.status === 200) {
        setTodos(prevTodos => prevTodos.map(t => t.id === todo.id ? updatedTodo : t))
      }
    } catch (error) {
      console.error("Failed to update the todo", error)
    }
  }

  if (editMode) {
    return (
      <div className="pt-8 pb-32 bg-violet-200 flex flex-col items-center gap-8">
        <div className="text-2xl">Edit Todo</div>
        <div className="flex gap-4">
          <div className="text-lg">Edit Description:</div>
          <input
            type="text"
            placeholder="Enter new desc..."
            className="rounded-md shadow-md text-lg"
            value={editTodoInfo.desc}
            onChange={(e) => { setEditTodoInfo({ ...editTodoInfo, desc: e.target.value }) }} />
        </div>
        <div className="flex gap-4">
          <div className="text-lg">Edit Completed:</div>
          <input
            type="checkbox"
            checked={editTodoInfo.completed}
            onChange={e => setEditTodoInfo({ ...editTodoInfo, completed: !editTodoInfo.completed })} />
        </div>
        <button
          onClick={updateTodo}
          className="text-xl shadow-md bg-blue-600 text-white hover:bg-blue-500 rounded-md px-3 py-1">
          Submit
        </button>
      </div>
    )
  }

  return (
    <div className="pt-8 pb-32 bg-violet-200 flex flex-col items-center gap-8">
      <div className='text-2xl'>Todo List Next</div>
      <div className="flex gap-2">
        <input
          className="text-xl rounded-md shadow-md"
          type="text"
          placeholder='Enter Todo...'
          value={inputText}
          onChange={e => setInputText(e.target.value)} />
        <button
          onClick={addTodo}
          className="text-xl shadow-md bg-green-600 text-white hover:bg-green-500 rounded-md px-3">
          Add
        </button>
        <button
          onClick={clearTodos}
          className="text-xl shadow-md bg-gray-600 text-white hover:bg-gray-500 rounded-md px-3">
          Clear
        </button>
      </div>
      <div className="w-5/6 flex flex-col gap-2">
        {todos.map((todo, index) => (
          <div className="bg-violet-600 flex justify-between items-center p-2 rounded-lg shadow-lg" key={index}>
            <div className="flex gap-2">
              <input type="checkbox" checked={todo.completed} onChange={() => toggleTodoCompleted(todo)} />
              <div className="text-white text-xl">{todo.desc}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editTodo(todo)}
                className="text-xl shadow-md bg-blue-600 text-white hover:bg-blue-500 rounded-md px-1">
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo)}
                className="text-xl shadow-md bg-red-600 text-white hover:bg-red-500 rounded-md px-1">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TodosPage
