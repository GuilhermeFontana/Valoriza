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
router.post("/login", authenticateController.login)
router.post("/forgot-password", authenticateController.forgotPassword)

/* Rotas de Usuário */
router.post("/users/create", userController.criar);
router.post("/users/search", ensureAuthenticated, userController.buscar);
router.get("/users/search/:ID", ensureAuthenticated, userController.buscarPorId);
router.put("/users/update", ensureAuthenticated, userController.editar);
router.put("/users/update/:ID", ensureAuthenticated, ensureAdmin, userController.editarOutro);
router.delete("/users/remove", ensureAuthenticated, userController.remover);
router.delete("/users/remove/:ID", ensureAuthenticated, ensureAdmin, userController.removerOutro);

/* Rotas de  Etiqueta */
router.post("/tags/create", ensureAuthenticated, ensureAdmin, tagController.criar);
router.post("/tags/search", ensureAuthenticated, tagController.buscar);
router.put("/tags/update/:ID", ensureAuthenticated, ensureAdmin, tagController.editar);
router.delete("/tags/remove/:ID", ensureAuthenticated, ensureAdmin, tagController.remover);

/* Rotas de Elogio */
router.post("/compliment/send", ensureAuthenticated, complimentController.criar);
router.post("/compliment/sended", ensureAuthenticated, complimentController.buscarMeusEviados);
router.post("/compliment/received", ensureAuthenticated, complimentController.buscarMeusRecebidos);
router.post("/compliment/received/:ID", ensureAuthenticated, complimentController.buscarRecebidosPorUsuario);
router.delete("/compliment/remove/:ID", ensureAuthenticated, complimentController.removerElogio);


router.use(function (req, res) {
    return res.status(404).json({
        erro: `Rota ${req.url} não encontrada.`
    });
});

export { router }