import mongoose from "mongoose"

const TodoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  desc: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  }
})

const Todo = mongoose.models.todos || mongoose.model("todos", TodoSchema)

export default Todo
