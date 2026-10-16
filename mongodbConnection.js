import mongoose from "mongoose";
import "dotenv/config";

function mongodbConnection() {
  console.log(process.env.DB_URL);
  const db = mongoose.connect("mongodb+srv://rizwan852844_db_user:3xDt0UZEfpLgPFps@cluster0.dqrz6xb.mongodb.net/todoApp");

  db.then((data) =>
    console.log("data", data.connection._connectionString),
  ).catch((error) => console.log(error, "error"));
}

export default mongodbConnection;
