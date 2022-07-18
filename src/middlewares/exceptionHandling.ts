import { Request, Response, NextFunction } from "express";

export default function exceptionHandling(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof Error)
        return res.status(400)
            .json({erro: err.message})
    
    return res.status(500)
        .json({
            erro: "Internal Server Error"
        })
}