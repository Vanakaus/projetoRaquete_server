
export interface CreateUserDTO {
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
    email: string;
    novoEmail: string;
    username: string | null;
    telefone: string;
    celular: string;
}