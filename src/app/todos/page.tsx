"use client"

import axios from "axios"
import { useEffect, useState } from "react"

// Define the type for a todo object
export type TTodo = {
  id: string,
  desc: string,
  completed: boolean,
  category: string // Added category field to the TTodo type
}

// Predefined list of categories
const CATEGORIES = [
  "Sport",
  "Work",
  "Administrative",
  "Home",
  "Hobbies",
  "Shopping",
  "Other",
];

// Predefined colors for each category
const CATEGORY_COLORS: Record<string, string> = {
  Sport: "bg-green-700",
  Work: "bg-yellow-500",
  Administrative: "bg-blue-500",
  Home: "bg-orange-500",
  Hobbies: "bg-purple-500",
  Shopping: "bg-pink-500",
  Other: "bg-gray-500",
};

const TodosPage = () => {

  // State to store the list of todos
  const [todos, setTodos] = useState<TTodo[]>([])

  // State to control the edit mode and the todo being edited
  const [editMode, setEditMode] = useState(false)
  const [editTodoInfo, setEditTodoInfo] = useState<TTodo>({
    id: "",
    desc: "",
    completed: false,
    category: "" // Added category field to the editTodoInfo state
  })

  // State to control the visibility of the add todo form
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);

  // State to store the new todo's description and category
  const [newTodoDesc, setNewTodoDesc] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState("");

  // Fetch todos from the server when the component mounts
  useEffect(() => {
    axios.get("/api/todos")
      .then(res => {
        console.log(res.data)
        setTodos(res.data.todos)
      })
  }, [])

  // Function to add a new todo
  const addTodo = async () => {
    const data = {
      desc: newTodoDesc,
      category: newTodoCategory
    }

    try {
      const res = await axios.post("/api/todos", data)

      const newTodo: TTodo = res.data.savedTodo; // Use the savedTodo returned from the backend

      setTodos(prevTodos => [...prevTodos, newTodo])
      setNewTodoDesc(''); // Clear the input field after adding the todo
      setNewTodoCategory(''); // Clear the input field after adding the category
      setShowAddTodoForm(false); // Hide the add todo form

    } catch (error) {
      console.error("Failed to add the todo", error)
    }
  }

  // Function to clear all todos
  const clearTodos = async () => {
    try {
      const res = await axios.delete("/api/todos")
      console.log(res.data)

      setTodos([])
    } catch (error) {
      console.error("Failed to clear todos", error)
    }
  }

  // Function to delete a todo
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

  // Function to edit a todo
  const editTodo = async (todo: TTodo) => {
    try {
      setEditMode(true)
      setEditTodoInfo({
        id: todo.id,
        desc: todo.desc,
        completed: todo.completed,
        category: todo.category // Added category field to the editTodoInfo state
      })
    } catch (error) {
      console.error("Failed to edit the todo", error)
    }
  }

  // Function to update a todo
  const updateTodo = async () => {
    const data = {
      desc: editTodoInfo.desc,
      completed: editTodoInfo.completed,
      category: editTodoInfo.category
    }
    try {
      const res = await axios.put(`/api/todos/${editTodoInfo.id}`, data)

      if (res.status === 200) {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === editTodoInfo.id
              ? { ...editTodoInfo }
              : todo
          ))
        setEditMode(false)
      }
    } catch (error) {
      console.error("Failed to update the todo", error)
    }
  }

  // Function to toggle a todo's completed status
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

  // Render the edit todo form if in edit mode
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
        <div className="flex gap-4">
          <div className="text-lg">Edit Category:</div>
          <select
            value={editTodoInfo.category}
            onChange={(e) => setEditTodoInfo({ ...editTodoInfo, category: e.target.value })}
            className="rounded-md shadow-md text-lg"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <button
          onClick={updateTodo}
          className="text-xl shadow-md bg-blue-600 text-white hover:bg-blue-500 rounded-md px-3 py-1">
          Submit
        </button>
      </div>
    )
  }

  // Render the add todo form
  if (showAddTodoForm) {
    return (
      <div className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-2">Add New Todo</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter Todo Description"
            value={newTodoDesc}
            onChange={(e) => setNewTodoDesc(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          />
          <select
            value={newTodoCategory}
            onChange={(e) => setNewTodoCategory(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={addTodo}
            className="bg-green-600 text-white rounded-md py-1"
          >
            Add Todo
          </button>
        </div>
      </div>
    )
  }
  // Render the main todo list page
  return (
    <div className="pt-8 pb-32 bg-violet-200 flex flex-col items-center gap-8">
      <div className='text-2xl'>Todo List Next</div>
      <div className="flex gap-2">
        {/* Button to show the add todo form */}
        <button
          className="text-xl shadow-md bg-green-600 text-white hover:bg-green-500 rounded-md px-3 py-1"
          onClick={() => setShowAddTodoForm(true)}>Create New Todo</button>
        <button
          onClick={clearTodos}
          className="text-xl shadow-md bg-gray-600 text-white hover:bg-gray-500 rounded-md px-3">
          Clear
        </button>
      </div>

      {/* Render the list of todos */}
      <div className="w-5/6 flex flex-col gap-2">
        {todos.map((todo, index) => (
          <div className="bg-violet-600 flex justify-between items-center p-2 rounded-lg shadow-lg" key={index}>
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodoCompleted(todo)} />
              <h2 className="text-white text-xl">{todo.desc}</h2>
              {/* Render the category as a disabled button with a colored background */}
              <button
                disabled
                className={`text-white px-2 py-1 rounded-md ${CATEGORIES.includes(todo.category) ? CATEGORY_COLORS[todo.category] : "bg-gray-500"
                  }`}
              >{todo.category}</button>
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
