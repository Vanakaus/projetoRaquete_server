
export interface ListaTorneiosAcademiaDTO {
    id_academia: string;
}


export interface LeTorneioDTO {
    id: string;
}



export interface CriaTorneioDTO {
    id_academia: string;
    idRanking: number;
    nome: string;
    descricao?: string;
    local?: string;
    sets: number;
    tiebreak: boolean;
    modalidade: { simples: boolean, duplas: boolean };
    pontuacao: { participacao: number, r32: number, r16: number, r8: number, r4: number, r2: number, r1: number, vencedor: number };
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
    tiebreak: boolean;
    modalidade: { simples: boolean, duplas: boolean };
    pontuacao: { participacao: number, r32: number, r16: number, r8: number, r4: number, r2: number, r1: number, vencedor: number };
    classesDeleta: number[];
    classesAdiciona: number[];
    dataInicio: Date;
    dataFim: Date;
}



export interface GerarPontuacaoDTO {
    idTorneio: string;
}

export interface FinalizarTorneioDTO {
    idTorneio: string;
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









export interface ListaCampeonatosCriadosDTO {
    cpf: string;
    id_criador: string;
}


export interface LeCampeonatoCriadoDTO {
    cpf: string;
    id: string;
    id_criador: string;    
}


export interface AbrirFecharInscricoesDTO {
    cpf: string;
    id: string;
    id_criador: string;
    abreFecha: boolean;
}


export interface ReabrirCampeonatoDTO {
    cpf: string;
    id: string;
    id_criador: string;
}