import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/db";
import Todo from "@/models/todo";
import { v4 } from "uuid";

connect();

export const GET = async (request: NextRequest) => {
  try {
    const todos = await Todo.find({});
    console.log(todos);

    return NextResponse.json({ msg: "Found all todos", success: true, todos });
  } catch (error) {
    return NextResponse.json({ msg: "Issue happened!" }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();
    const { desc, category } = reqBody;
    console.log(desc, category);

    let newCategory = category.toLowerCase();

    // Check if the category already exists
    const existingTodos = await Todo.find({ category });

    if (existingTodos.length === 0) {
      // If the category doesn't exist, create a new one
      newCategory = category.trim();
    }

    const newTodo = new Todo({
      id: v4(),
      desc,
      completed: false,
      category,
    });

    const savedTodo = await newTodo.save();

    return NextResponse.json({ msg: "todo added", success: true, savedTodo });
  } catch (error) {
    return NextResponse.json({ msg: "Issue happened!" }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    await Todo.deleteMany({})
    return NextResponse.json({ msg: "todos cleared", success: true })
  } catch (error) {
    return NextResponse.json({ msg: "Issue happened!" }, { status: 500 });
  }
};
