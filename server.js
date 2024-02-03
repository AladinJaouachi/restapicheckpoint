console.clear();
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userrouter from "./routes/userRoute.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const P = process.env.PO;
const url = process.env.url_DB;

mongoose
  .connect(url)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });
//

app.use("/q", userrouter);

app.listen(P, (err) => {
  if (err) throw err;
  console.log(`server run on http://localhost:${P}`);
});
