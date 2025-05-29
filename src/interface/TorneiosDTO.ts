
export interface ListaTorneiosAcademiaDTO {
    id_academia: string;
}

export interface ListaTorneiosPrincipaisAcademiaDTO {
    id_academia: string;
}

export interface ListaTorneiosStatusAcademiaDTO {
    id_academia: string;
}


export interface LeTorneioDTO {
    id: string;
}



export interface CriaTorneioDTO {
    id_academia: string;
    id_ranking: number;
    nome: string;
    descricao?: string;
    local?: string;
    sets: number;
    modalidade: { simples: boolean, duplas: boolean };
    pontuacao: { participacao: number, r64: number, r32: number, r16: number, r8: number, r4: number, r2: number, vencedor: number };
    classes: number[];
    dataInicio: Date;
    dataFim: Date;
}


export interface AtualizarTorneioDTO {
    id_academia: string;
    id: string;
    nome: string;
    descricao: string;
    local: string;
    sets: number;
    pontuacao: { participacao: number, r64: number, r32: number, r16: number, r8: number, r4: number, r2: number, vencedor: number };
    classesDeleta: number[];
    classesAdiciona: number[];
    dataInicio: Date;
    dataFim: Date;
}



export interface GerarPontuacaoDTO {
    id_torneio: string;
}

export interface FinalizarTorneioDTO {
    id_torneio: string;
    resultados: {
        posicao: string;
        pontuacao: number;
        inscricao: {
            id: number;
            tenista1: string;
            tenista2?: string;
        };
    }[];
}

export interface ReabrirTorneioDTO {
    id_torneio: string;
}



export interface ListarResultadoDTO {
    id_torneio: string;
}
