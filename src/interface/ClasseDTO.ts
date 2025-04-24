
export interface listarClassesDTO {
    id_academia: string;
}


export interface CriaClasseDTO {
    id_academia: string;
    id_ranking: number;
    sigla: string;
    nome: string;
    masculino: boolean;
    misto: boolean;
    dupla: boolean;
}


export interface AtualizarClasseDTO {
    id_academia: string;
    id: number;
    sigla: string;
    nome: string;
    masculino: boolean;
    misto: boolean;
    dupla: boolean;
}


export interface AdicionarClasseRankingDTO {
    id_academia: string;
    idClasse: number;
    idRanking: number;
}