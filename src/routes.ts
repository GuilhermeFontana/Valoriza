import { Router } from "express";

import { UserController } from "./controllers/UserController";
import { TagController } from "./controllers/TagController";
import { AuthenticateController } from "./controllers/AuthenticateController";

import ensureAdmin from "./middlewares/ensureAdmin";
import { ComplimentController } from "./controllers/ComplimentController";


const router = Router();


/* Controllers */
const authenticateController = new AuthenticateController();
const userController = new UserController();
const tagController = new TagController();
const complimentController = new ComplimentController();


/* Autenticação */
router.post("/login", authenticateController.handle)

/* Rotas de Usuário */
router.post("/users", userController.criar);
router.get("/users", userController.buscar);

/* Rotas de  Etiqueta */
router.post("/tags", ensureAdmin, tagController.criar)

/* Rotas de Elogio */
router.post("/compliment", complimentController.criar);

export { router }