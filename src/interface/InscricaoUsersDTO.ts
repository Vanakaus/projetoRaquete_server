
export interface CreateInscricaoDTO {
    cpf: string;
    id_campeonato: string;
    id_jogador: string;
}


export interface ListaInscricoesDTO {
    cpf: string;
    id_jogador: string;
}

export interface ListaInscricoesCampeonatoDTO {
    cpf: string;
    id_jogador: string;
    id_campeonato: string;
}
