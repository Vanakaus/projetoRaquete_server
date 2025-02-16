import { Router } from "express";
import { informativo } from "../middlewares";
import { userRoutes } from "./user.routes";
import { torneioRoutes } from "./torneios.routes";
import { inscricaoRoutes } from "./inscricao.routes";
import { partidasRoutes } from "./partidas.routes";
import { horariosRoutes } from "./horarios.routes";
import { quadrasRoutes } from "./quadras.routes";
import { classesRoutes } from "./classes.routes";
import { rankingRoutes } from "./ranking.routes";


const routes = Router();


// Rota para testar o servidor
routes.get('/', informativo, (req, res) => {
    res.send('Projeto Tennis - API BackEnd');
  });


routes.use('/users', userRoutes);
routes.use('/classes', classesRoutes);
routes.use('/ranking', rankingRoutes);
routes.use('/torneios', torneioRoutes);
routes.use('/inscricoes', inscricaoRoutes);
routes.use('/partidas', partidasRoutes);

routes.use('/horarios', horariosRoutes);
routes.use('/quadras', quadrasRoutes);


export { routes };