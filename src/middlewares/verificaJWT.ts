import e, { NextFunction } from "express";
const jwt = require('jsonwebtoken');



export function verificaJWT(req: e.Request, res: e.Response, next: NextFunction) {
    const token = req.headers['x-access-token']

    if (!token) {
        console.log("Token não encontrado");
        return res.status(401).json({
            status: "error",
            mensagem: "Acesso não autorizado" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token válido, acesso permitido");
        return next();
    } catch (error) {
        console.log("Token inválido");
        return res.status(401).json({
            status: "error",
            mensagem: "Acesso não autorizado" });
    }
}