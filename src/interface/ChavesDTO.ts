
export interface GerarChaveDTO {
    idTorneio: string;
    idClasseTorneio: number;
    numCabecas: number;
}



export interface LimparChaveDTO {
    idTorneio: string;
    id_ClasseTorneio: number;
}



export interface ListarChaveDTO {
    idTorneio: string;
}



export interface AtualizarDadosDTO {
    novosDados: novoDado[];
}

export interface novoDado {
    id: number;
    classe: string;
    data: string;
    hora: string;
    local: string;
    resposta: string;
}



export interface AtualizarPlacarDTO {
    idTorneio: string;
    novosPlacares: partidaPlacarDTO[];
}

export interface partidaPlacarDTO {
    id: number;
    sets: {
        id: number;
        tiebreak: boolean;
        placar: [number, number];
    }[];
}

export interface partidaPlacarRespostaDTO extends partidaPlacarDTO {
    id_vencedor: number;
}
export interface novaPartidaPlacarRespostaDTO extends partidaPlacarDTO {
    chave: string;
    classe: string;
    id_vencedor: number;
    inscricao1: IInscricao | null;
    inscricao2: IInscricao | null;
}
export default interface IInscricao {
    id: number;
    tenista1: string;
    tenista2?: string;
}