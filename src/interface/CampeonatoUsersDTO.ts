
export interface CreateCampeonatoDTO {
    cpf: string;
    nome: string;
    descricao?: string;
    tipo: string;
    regras: string;
    classe: string;
    numJogadores: number;
    dataInicio: Date;
    dataFim: Date;

    // Opicional
    premiacao?: string;
    local?: string;
}
