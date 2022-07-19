import { Router } from "express";

import { UserController } from "./controllers/UserController";
import { TagController } from "./controllers/TagController";
import { AuthenticateController } from "./controllers/AuthenticateController";

import ensureAdmin from "./middlewares/ensureAdmin";


const router = Router();


/* Controllers */
const userController = new UserController();
const tagController = new TagController();
const authenticateController = new AuthenticateController();

/* Autenticação */
router.post("/login", authenticateController.handle)

/* Rotas de Usuário */
router.post("/users", userController.criar);

/* Rotas de  Etiqueta */
router.post("/tags", ensureAdmin, tagController.criar)


export { router }