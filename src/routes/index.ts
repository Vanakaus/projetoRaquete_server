import { Router } from "express";
import { informativo } from "../middlewares";
import { userRoutes } from "./user.routes";
import { campenatoRoutes } from "./campeonatos.routes";
import { inscricaoRoutes } from "./inscricao.routes";


const routes = Router();


// Rota para testar o servidor
routes.get('/', informativo, (req, res) => {
    res.send('Projeto Tennis - API BackEnd');
  });


routes.use('/users', userRoutes);
routes.use('/campeonatos', campenatoRoutes);
routes.use('/inscricao', inscricaoRoutes);


export { routes };