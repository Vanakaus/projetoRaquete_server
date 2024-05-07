import { Router } from "express";
import { userRoutes } from "./user.routes";
import { informativo } from "../middlewares";
import { campenatoRoutes } from "./campeonatos.routes";


const routes = Router();


// Rota para testar o servidor
routes.get('/', informativo, (req, res) => {
    res.send('Projeto Tennis - API BackEnd');
  });


routes.use('/users', userRoutes);
routes.use('/campeonatos', campenatoRoutes);


export { routes };