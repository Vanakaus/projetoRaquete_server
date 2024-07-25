
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
    cpf: string;
    id_jogador: string;
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

    chave: string;
    id_jogador1: number;
    id_jogador2: number;
    pontuacaoJog1: number;
    pontuacaoJog2: number;
    id_vencedor: number;
}