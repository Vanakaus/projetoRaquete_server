
export interface listarClassesDTO {
    id_academia: string;
}


export interface CriaClasseDTO {
    id_academia: string;
    sigla: string;
    nome: string;
    masculino: boolean;
    misto: boolean;
    dupla: boolean;
}


export interface AtualizarClasseDTO {
    id: number;
    sigla: string;
    nome: string;
    masculino: boolean;
    misto: boolean;
    dupla: boolean;
}
