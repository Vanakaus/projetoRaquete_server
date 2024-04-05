import e, { NextFunction } from 'express';


export function informativo(req: e.Request, res: e.Response, next: NextFunction) {

    console.log('\n');
    console.log('ROTA CHAMADA:');
    console.log(`Tipo: ${req.method}`);
    console.log(`URL: ${req.url}`);

    const body = JSON.stringify(req.body).replace(/"senha":"[^"]*"/g, '"senha":"******"')
                                            .replace(/"novaSenha":"[^"]*"/g, '"novaSenha":"******"')
                                            .replace(/","/g, '",\n\t"')
                                            .replace(/{"/g, '{\n\t"')
                                            .replace(/"}/g, '"\n}')
    
    console.log(`\nheaders: \n${req.rawHeaders}`);
    console.log(`\nbody: \n${body}`);
    console.log(`\n`);

    return next();
}

