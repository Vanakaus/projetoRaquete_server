
export interface CreateCampeonatoDTO {
    cpf: string;
    nome: string;
    descricao?: string;
    regras: string;
    classe: string;
    numJogadores: number;
    dataInicio: Date;
    dataFim: Date;

    // Opicional
    premiacao?: string;
    local?: string;
}


export interface ListaCampeonatoDTO {
    cpf: string;
}


export interface LeCampeonatoDTO {
    id: string;
    cpf: string;
}