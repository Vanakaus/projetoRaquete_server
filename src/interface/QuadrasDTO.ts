
export interface CriaQuadraDTO {
    cpf: string;
    id_jogador: string;

    id_campeonato: string;
    quadra: string;
}


export interface ListaQuadrasDTO {
    cpf: string;
    id_jogador: string;

    id_campeonato: string;
}


export interface AtualizaQuadraDTO {
    cpf: string;
    id_jogador: string;

    id: number;
    id_campeonato: string;
    quadra: string;    
}


export interface DeletaQuadraDTO {
    cpf: string;
    id_jogador: string;

    id: number;
    id_campeonato: string;
}