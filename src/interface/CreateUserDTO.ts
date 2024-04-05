export interface CreateUserDTO {
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