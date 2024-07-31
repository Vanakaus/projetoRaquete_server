
export interface GerarChaveDTO {
    cpf: string;
    id_jogador: string;
    id_campeonato: string;
}


export interface LimparChaveDTO {
    cpf: string;
    id_jogador: string;
    id_campeonato: string;
}


export interface ListarChaveDTO {
    id_campeonato: string;
}


export interface AtualizarChaveDTO {
    cpf: string;
    id: string;
    id_jogador: string;

    data: string;
    local: string;
}


export interface AtualizarPlacarDTO {
    cpf: string;
    id: number;
    id_jogador: string;

    pontuacao1: number;
    pontuacao2: number;
    id_vencedor: number;
}