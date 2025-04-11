
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
    id_torneio: string;
}

export interface ListaInscricoesCampeonatoDTO {
    cpf: string;
    id_jogador: string;
    id_campeonato: string;
}
