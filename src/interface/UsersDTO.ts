
export interface CriaUserDTO {
    cpf: string;
    email: string;
    senha: string;
    nome: string;
    sobrenome: string;
    dataNascimento: Date;

    // Opicional
    username?: string;
    telefone?: string;
    celular?: string;
}

export interface LoginUserDTO {
    email: string;
    senha: string;
}


export interface UpdateUserDTO {
    cpf: string;
    email: string;
    novoEmail: string;
    username: string | null;
    telefone: string;
    celular: string;
}


export interface UpdatePasswordDTO {
    cpf: string;
    email: string;
    senha: string;
    novaSenha: string;
}