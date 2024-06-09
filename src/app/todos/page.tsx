"use client"

import { useState } from "react"

const TodosPage = () => {

  const [inputText, setInputText] = useState("")
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
          <button className="text-xl shadow-md bg-blue-600 text-white hover:bg-blue-500 rounded-md px-3">Add</button>
          <button className="text-xl shadow-md bg-green-600 text-white hover:bg-green-500 rounded-md px-3">Clear</button>
      </div>
    </div>
  )
}

export default TodosPage
