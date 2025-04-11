
export interface listarRankingDTO {
    id_academia: string;
}


export interface listarRankingClassesDTO {
    id_ranking: number;
}


export interface CriaRankingDTO {
    id_academia: string;
    nome: string;
    classes: number[];
}


export interface RankingDTO {
    id_classeRanking: number;
}
