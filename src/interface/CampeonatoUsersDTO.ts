
export interface AtualizaCampeonatoDTO {
    cpfToken: string;
    id: string;
    id_criador: string;
    nome: string;
    descricao?: string;
    regras: string;
    classe: string;
    numJogadores: number;
    dataInicio: Date;
    dataFim: Date;
    premiacao: string;
    sets: number;
    local: string;
}


export interface CriaCampeonatoDTO {
    cpfToken: string;
    cpf: string;
    nome: string;
    descricao?: string;
    regras: string;
    classe: string;
    numJogadores: number;
    dataInscricao: Date;
    dataInicio: Date;
    dataFim: Date;
    sets: number;

    // Opicional
    premiacao?: string;
    local?: string;
}


export interface ListaCampeonatoDTO {
    cpf: string;
}


export interface ListaCampeonatosCriadosDTO {
    cpf: string;
    id_criador: string;
}


export interface LeCampeonatoDTO {
    id: string;
    cpf: string;
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


export interface FinalizarCampeonatoDTO {
    cpf: string;
    id: string;
    id_criador: string;
    cancela: boolean;
}


export interface ReabrirCampeonatoDTO {
    cpf: string;
    id: string;
    id_criador: string;
}