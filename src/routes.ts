import { Router } from "express";

import { UserController } from "./controllers/UserController";
import { TagController } from "./controllers/TagController";
import { AuthenticateController } from "./controllers/AuthenticateController";
import { ComplimentController } from "./controllers/ComplimentController";

import ensureAdmin from "./middlewares/ensureAdmin";
import ensureAuthenticated from "./middlewares/ensureAuthenticated";


const router = Router();


/* Controllers */
const authenticateController = new AuthenticateController();
const userController = new UserController();
const tagController = new TagController();
const complimentController = new ComplimentController();


/* Autenticação */
router.post("/login", authenticateController.handle)

/* Rotas de Usuário */
router.post("/users/create", userController.criar);
router.post("/users/search", userController.buscar);
router.get("/users/search/:ID", userController.buscarPorId);
router.put("/users/update/:ID", userController.editar);
router.delete("/users/remove/:ID", userController.remover);

/* Rotas de  Etiqueta */
router.post("/tags/create", ensureAuthenticated, ensureAdmin, tagController.criar)
router.post("/tags/search", ensureAuthenticated, tagController.buscar)

/* Rotas de Elogio */
router.post("/compliment/send", ensureAuthenticated, complimentController.criar);
router.post("/compliment/sended", ensureAuthenticated, complimentController.buscarMeusEviados);
router.post("/compliment/received", ensureAuthenticated, complimentController.buscarMeusRecebidos);


router.use(function (req, res) {
    return res.status(404).json({
        erro: `Rota ${req.url} não encontrada.`
    });
});

export { router }