import { Request, Response, NextFunction, response } from "express";

export default function ensureAdmin(req: Request, res: Response, next: NextFunction) {
    const admin = true;

    if (admin)
        return next();
    

    return res.status(401)
        .json({ erro: "Você não tem autorização para executar esta ação"})
}