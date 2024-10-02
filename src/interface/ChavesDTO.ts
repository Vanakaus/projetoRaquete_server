
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

    novoPS1: [ number, number, number, number, number ];
    novoPS2: [ number, number, number, number, number ];
    novoPT1: [ boolean, boolean, boolean, boolean, boolean ];
    novoPT2: [ boolean, boolean, boolean, boolean, boolean ];
    id_vencedor: number;
}