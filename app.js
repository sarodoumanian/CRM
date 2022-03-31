import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mysql from "mysql";
import CookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "PATCH", "HEAD", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(CookieParser());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection((err, con) => {
  if (err) return console.log(err);
  console.log("connected to db...");
});

import { userRouter, hourRouter, pdfRouter } from "./routes/index.js";

app.use("/api/user", userRouter);
app.use("/api/hour", hourRouter);
app.use("/api/pdf", pdfRouter);

app.listen(process.env.PORT, () => {
  console.log("server started...");
});

export { pool };
