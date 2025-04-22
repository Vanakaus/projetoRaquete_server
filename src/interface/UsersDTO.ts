
export interface CriaAcademiaDTO {
    id: string;
    nome: string;
    telefone: string;
}

export interface CriaUsuarioDTO {
    login: string;
    nome: string;
    senha: string;
    id_academia: string;
}


export interface AtualizaSenhaDTO {
    login: string;
    novaSenha: string;
}


export interface LoginUserDTO {
    login: string;
    senha: string;
}

