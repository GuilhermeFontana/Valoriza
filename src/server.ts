import express from "express";
import "express-async-errors"
import exceptionHandling from "./middlewares/exceptionHandling";
import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(router);
app.use(exceptionHandling);


app.listen(
    3000, 
    () => console.log("Server is running on port 3000")
)