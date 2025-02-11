
export interface AdicionarInscricoesDTO {
    id_academia: string;
    id_torneio: string;
    inscricaoClasse: {
        id_classeTorneio: number;
        duplas: boolean;
        inscricaoJogador: {
            cpf: string;
            nome: string;
        }[];
    }[];
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
