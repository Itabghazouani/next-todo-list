"use client"

import axios from "axios"
import { useEffect, useState } from "react"

const TodosPage = () => {

  const [inputText, setInputText] = useState("")
  const [todos, setTodos] = useState([])
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    axios.get("/api/todos")
      .then(res => {
        console.log(res.data)
        setTodos(res.data.todos)
      })
  }, [])
  if (editMode) {
    return (
      <div className="pt-8 pb-32 bg-violet-200 flex flex-col items-center gap-8">
        <div className="text-2xl">Edit Todo</div>
        <div className="flex gap-4">
          <div className="text-lg">Edit Description:</div>
          <input type="text" placeholder="Enter new desc..." className="rounded-md shadow-md text-lg" />
        </div>
        <div className="flex gap-4">
          <div className="text-lg">Edit Completed:</div>
          <input type="checkbox" />
        </div>
        <button className="text-xl shadow-md bg-blue-600 text-white hover:bg-blue-500 rounded-md px-3 py-1">Submit</button>
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
        <button className="text-xl shadow-md bg-green-600 text-white hover:bg-green-500 rounded-md px-3">Add</button>
        <button className="text-xl shadow-md bg-gray-600 text-white hover:bg-gray-500 rounded-md px-3">Clear</button>
      </div>
      <div className="w-5/6 flex flex-col gap-2">
        {todos.map((todo, index) => (
          <div className="bg-violet-600 flex justify-between items-center p-2 rounded-lg shadow-lg" key={index}>
            <div className="flex gap-2">
              <input type="checkbox" />
              <div className="text-white text-xl">Write code</div>
            </div>
            <div className="flex gap-2">
              <button className="text-xl shadow-md bg-blue-600 text-white hover:bg-blue-500 rounded-md px-1">Edit</button>
              <button className="text-xl shadow-md bg-red-600 text-white hover:bg-red-500 rounded-md px-1">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TodosPage
