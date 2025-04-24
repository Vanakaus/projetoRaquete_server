
export interface GerarChaveDTO {
    id_torneio: string;
    id_classeTorneio: number;
    numCabecas: number;
}



export interface LimparChaveDTO {
    id_torneio: string;
    id_classeTorneio: number;
}



export interface ListarChaveDTO {
    id_torneio: string;
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
    id_torneio: string;
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
    chave: string;
    classe: string;
    inscricao1: IInscricao | null;
    inscricao2: IInscricao | null;
}
export default interface IInscricao {
    id: number;
    tenista1: string;
    tenista2?: string;
}