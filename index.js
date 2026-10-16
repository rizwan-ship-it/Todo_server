import express from "express";
import dns from "dns";
import mongodbConnection from "./mongodbConnection.js";
import TodoModel from "./todoModel.js";
import cors from "cors";

dns.setServers(["8.8.8.8", "1.1.1.1", "0.0.0.0"]);

const app = express();
app.use(
  cors({
    origin: "*",
  }),
);

mongodbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.send("server is running");
});
// =======================Get method ===================================================
app.get("/todo", async function (req, res) {
  try {
    const limit = req.query.limit || 20;
    const page = req.query.page || 1;
    // =============================search URL LIMIT and skips method =========================================
    const q = req.query.search;
    const query = !q ? {} : { title: { $regex: q, $options: "i" } };
    const skip = (page - 1) * limit;

    console.log(query);

    const todoDetails = await TodoModel.find(query).skip(skip).limit(limit);
    const todoCountDocuments = await TodoModel.countDocuments(query);
    // =======================================================================
    return res.status(201).json({ todoDetails, todoCountDocuments });
  } catch (error) {
    return res.status(500).json({ message: `error ${error}` });
  }
});

// =======================Post method ===================================================

app.post("/todo", async function (req, res) {
  try {
    const payload = req.body;
    const newTodo = await TodoModel.create(payload);
    const todo = await newTodo.save();
    res.status(201).json({ message: "Todo Created successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
});
// =======================Put method ===================================================

app.put("/todo/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const payload = req.body;

    const todo = await TodoModel.findByIdAndUpdate(id, payload, { new: true });
    console.log(todo);

    if (!todo) {
      return res.status(404).json({ message: "todo not found" });
    }

    res.status(200).send({ message: "todo Update successfully" });
  } catch (error) {
    res.status(500).send({ message: `error ${error}` });
  }
});
// =======================Delete method ===================================================
app.delete("/todo/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const todo = await TodoModel.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ message: "todo not found" });
    }
    res.status(200).send({ message: "todo delete successfully" });
  } catch (error) {
    res.status(500).send({ message: `error ${error}` });
  }
});
// =============================GET TODO PAYLOAD =========================
app.get("/todo/:id", async function (req, res) {
  try {
    const todoId = req.params.id;
    const todos = await TodoModel.findById(todoId);
    return res.status(200).json({ todos });
  } catch (error) {
    return res.status(500).json({ message: `error ${error}` });
  }
});
// ======================= Server listen ===================================================
app.listen(8000, function () {
  console.log("server running on 8080");
});
