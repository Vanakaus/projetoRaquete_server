
export interface CriaClasseDTO {
    id_academia: string;
    sigla: string;
    nome: string;
    masculino: boolean;
    misto: boolean;
    dupla: boolean;
}


export interface AtualizarClasseDTO {
    sigla_original: string;
    sigla: string;
    nome: string;
    masculino: boolean;
    misto: boolean;
    dupla: boolean;
}
