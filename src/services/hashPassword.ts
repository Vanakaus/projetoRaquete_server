import { genSalt, hash, compare,  } from 'bcryptjs';


const SALT_RANDOMS = 10;

export const hashSenha = async (senha: string) => {
    const saltGenerated = await genSalt(SALT_RANDOMS);

    return await hash(senha, saltGenerated);
};

export const verificaSenha = async (senha: string, senhaEncriptada: string) => {
    return await compare(senha, senhaEncriptada);
};
