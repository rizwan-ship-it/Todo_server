import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({}, { strict: false });

const TodoModel = mongoose.model("todo-Schema", todoSchema);

export default TodoModel;
