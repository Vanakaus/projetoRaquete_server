import "express-async-errors";
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { routes } from './routes';
import { AppError } from "./errors/AppErrors";


const server = express();

server.use(express.json());
server.use(cors());
server.use(routes);



// Função para tratar erros e mostra-lo de forma mais amigável
server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof AppError){
    return res.status(err.statusCode).json({
      status: 'error',
      mensagem: err.message
    });
  }

  return res.status(500).json({
    status: 'error',
    message: `Internal Server Error - ${err.message}`
  });
});






server.listen(process.env.SERVER_PORT, () => {

  console.log('\n');
  console.log('= = = = = = = = = = = = = = = = = = = =');
  console.log('Servidor rodando na porta ' + process.env.SERVER_PORT);
  console.log('= = = = = = = = = = = = = = = = = = = =');
});


