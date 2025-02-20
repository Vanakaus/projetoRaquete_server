
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


export interface AtualizarDatasDTO {
    novosDados: novaData[];
}

export interface novaData {
    id: number;
    classe: string;
    data: string;
    hora: string;
    local: string;
    resposta: string;
}