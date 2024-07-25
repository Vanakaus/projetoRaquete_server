
export default function formataNumero(numero: number){
    return numero < 10 ? '0' + numero : numero;
}