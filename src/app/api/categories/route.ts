import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/db";
import Todo from "@/models/todo";

connect();

export const GET = async (request: NextRequest) => {
  try {
    const todos = await Todo.find({});
    const categories = Array.from(new Set(todos.map((todo) => todo.category)));

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ msg: "Issue happened!" }, { status: 500 });
  }
};
