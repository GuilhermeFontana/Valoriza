import express from "express";
import "express-async-errors";
const cors = require('cors');
const http = require('http');
import 'dotenv/config';

import { router } from "./routes";

import exceptionHandling from "./middlewares/exceptionHandling";


const app = express();
const server = http.Server(app);

app.use(cors({origin: true}));

app.use(express.json());
app.use(router);
app.use(exceptionHandling);


server.listen(
    process.env.PORT, 
    () => console.log("Server is running on port " + process.env.PORT)
)