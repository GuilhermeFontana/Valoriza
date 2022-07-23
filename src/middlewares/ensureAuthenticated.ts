import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";


interface decodeToken {
    sub: string;
    exp: number;
    iat: number;
    admin: boolean;
    email?: string;
}

export default function ensureAuthenticated (req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if (!authToken)
        return res.status(401).end();

    if(!authToken.startsWith("Bearer"))
        return res.status(401).end();

    const [, token] = authToken.split(" ");

    try {
        const { sub, admin, email } = verify(token, process.env.SECRETE) as decodeToken

        req.user = {
            id: Number(sub),
            email: email,
            admin: admin

        }

        return next();
    }
    catch {
        return res.status(401).end();
    }
}