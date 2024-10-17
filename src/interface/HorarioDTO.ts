
export interface CriaHorarioDTO {
    cpf: string;
    id_jogador: string;

    id_campeonato: string;
    horario: string;
}


export interface ListaHorariosDTO {
    cpf: string;
    id_jogador: string;

    id_campeonato: string;
}


export interface AtualizaHorarioDTO {
    cpf: string;
    id_jogador: string;

    id: number;
    id_campeonato: string;
    horario: string;    
}


export interface DeletaHorarioDTO {
    cpf: string;
    id_jogador: string;

    id: number;
    id_campeonato: string;
}