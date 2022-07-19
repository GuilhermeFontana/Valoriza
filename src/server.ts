import express from "express";
import "express-async-errors";
import 'dotenv/config';

import { router } from "./routes";

import exceptionHandling from "./middlewares/exceptionHandling";


const app = express();

app.use(express.json());
app.use(router);
app.use(exceptionHandling);


app.listen(
    process.env.PORT, 
    () => console.log("Server is running on port " + process.env.PORT)
)