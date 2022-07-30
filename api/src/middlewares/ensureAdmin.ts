import { Request, Response, NextFunction } from "express";

export default function ensureAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user.admin)
        return next();
    
    return res.status(401)
        .json({ erro: "Você não tem autorização para executar esta ação"})
}