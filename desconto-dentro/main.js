/*
Sumario do Pdf:

v = valor de empréstimo
x = preço à prazo
y = preço à vista
p = número de prestações
R = valor de cada prestação
A = Valor presente = valor a vista [fator *= 1 + t][fator, x * fator]
valor  futuro = x(inverso / dividir  (fator =/ 1+ t))CF = Coeficiente de financiamento
t = taxa(porcentagem)
k = fator aplicado


Valor a voltar: Adiantamento(pagar) 

Valor final: Soma das parcelas


Multiplicar juros por saldo devedor pra ter o primo juros
    -> Juros[0] = juros do Usuario
    -> Os demais = Juros * saldo
     
Se tem entrada, primeira prestacao = 0; amortização = 0; juros = juros; amortização = preco a vista, 

Se tiver taxa a juros e valor a vista -> Calular o valor a prazo
Se tiver valor a vista e a prazo -> Calcular taxa de juros commetodo de newton


// ao usar navbar escuro, colocar navbar-dark dentro da classe e style = "background:<cor>"


// CF * y = x

*/

// desconto racional por dentro | ou desconto por dentro


/*
TODO: Calcular coisas antes da tabela price. Apenas pegar parametros necessarios
  - Se possivel, apenas usar np,pmt,t,pv

  - Tirar calculos de dentro da funcao getTabelaPrice()
*/




"use strict";

/** 
 
@param {Boolean} ehPrimeiraTaxa
@param {Number} taxaJuros
@returns {Number}

**/

function fe(ehPrimeiraTaxa, taxaJuros){
    return  (ehPrimeiraTaxa == true)?  1 + taxaJuros : 1;
}

/**
 * @param {Number} taxaJuros 
 * @param {Number} quantidadeParcelas 
 * @returns {Number}
*/

export function calcularCoeficienteFinanciamento(taxaJuros, quantidadeParcelas){

    let taxaCorrigida = (taxaJuros > 1) ? taxaJuros / 100 : taxaJuros;
    // taxaCorrigida /= 100;

    return taxaCorrigida / (1 - Math.pow(1 + taxaCorrigida, quantidadeParcelas * -1) );
}

/**
 * @param {Number} coeficienteFinanciamento 
 * @param {Number} taxaJuros
 * @param {Number} precoAPrazo
 * @param {Number} parcelas
 * @param {Boolean} ehPrimeiraTaxa  
 * @returns {Number}  
*/
export function calcularValorPresente(coeficienteFinanciamento, taxaJuros, precoAPrazo,parcelas,ehPrimeiraTaxa){
    let f = fe(ehPrimeiraTaxa, taxaJuros);

    return (precoAPrazo / parcelas) * (f / coeficienteFinanciamento);
}

/** 
   @description Calcula o Valor Final(Preço à prazo) quando não fornecido(Precisa da taxa de Juros)

   @param {Number} coeficienteFinanciamento
   @param {Number} taxaJuros
   @param {Number} precoAVista
   @param {Nymber} parcelas 
   @param {Boolean} temEntrada
   
   @returns {Number}
*/
export function calcularValorFuturo(coeficienteFinanciamento, taxaJuros, precoAVista,parcelas,temEntrada){

    let resultado = precoAVista / calcularFatorAplicado(temEntrada,parcelas,coeficienteFinanciamento,taxaJuros);

    return Number(resultado.toFixed(2));
}

 export function calcularFatorAplicado(temEntrada, numParcelas,coeficienteFinanciamento, taxaJuros){
    let f = fe(temEntrada, taxaJuros);

    return f/(numParcelas * coeficienteFinanciamento);
}

/**
@description Sò converte taxa de juros mensal para anual.
@param {Number} juros
@returns {Number} 
*/

export function converterJurosMensalParaAnual(juros){
    juros /= 100;
    let resultado = (Math.pow(1 + juros, 12) - 1) * 100;
    return Number(resultado.toFixed(2));
}

/**
@description Função para calcular a taxa de juros usando o Método de Newton
@param {Number} precoAVista
@param {Number} precoAPrazo
@param {Number} numParcelas 
@param {Boolean} temEntrada
@returns {Number}
*/
export function calcularTaxaDeJuros(precoAVista, precoAPrazo, numParcelas, temEntrada) {
    const tolerancia = 0.0001;  
    let taxaDeJuros = 0.1; // Palpite inicial
    let taxaDeJurosAnterior = 0.0;


    let funcao = 0; let derivada = 0;
    let iteracao = 0;

    
    while(Math.abs(taxaDeJurosAnterior - taxaDeJuros ) >= tolerancia){
        
        taxaDeJurosAnterior = taxaDeJuros;
        funcao = calcularValorFuncao(precoAPrazo,taxaDeJuros,precoAVista,temEntrada,numParcelas);

        derivada = calcularValorDerivadaFuncao(precoAPrazo,taxaDeJuros,precoAVista,temEntrada,numParcelas);

        taxaDeJuros = taxaDeJuros - (funcao / derivada);

        iteracao++;
    }

   
    return taxaDeJuros;
}

/**
 * 
 * @param {Array<Array<String>>} tabelaPrice 
 * @param {Number} numeroParcelas 
 * @param {Number} mesesAVoltar 
 * @returns {Number}
 */
export function getValorCorrigido(tabelaPrice,numeroParcelas,mesesAVoltar){
    mesesAVoltar = Number(mesesAVoltar);
    if(mesesAVoltar == 0 || mesesAVoltar >= numeroParcelas){
        return 0;
    }
    else{
        let tamanho = tabelaPrice.length - 2;
        return tabelaPrice[tamanho - mesesAVoltar ][4];
    }
}

/**
 * 
 * @param {Number} pmt 
 * @param {Number} numeroParcelas 
 * @param {Number} mesesAVoltar 
 * @returns {Number}
 */
export function calcularValorAVoltar(pmt, numeroParcelas,mesesAVoltar){
    if( Number(mesesAVoltar) > Number(numeroParcelas)){
        return 0;
    }
    else{
        return pmt * mesesAVoltar;
    }
}

/**
 * 
 * @param {Number} precoAPrazo 
 * @param {Number} taxaDeJuros 
 * @param {Number} precoAVista 
 * @param {Boolean} temEntrada 
 * @param {Number} numParcelas 
 * @returns {Number}
 */
function calcularValorFuncao(precoAPrazo,taxaDeJuros,precoAVista, temEntrada, numParcelas){
let a = 0; let b = 0; let c = 0;
    if(temEntrada){
        a = Math.pow(1+taxaDeJuros,numParcelas-2);
        b = Math.pow(1 + taxaDeJuros, numParcelas - 1);
        c = Math.pow(1 + taxaDeJuros, numParcelas);

        return (precoAVista * taxaDeJuros * b) - (precoAPrazo/numParcelas * (c - 1));
       
    }
    else{
        a = Math.pow(1 + taxaDeJuros, -numParcelas);
        b = Math.pow(1 + taxaDeJuros, -numParcelas - 1 );

        return (precoAVista * taxaDeJuros) - ( (precoAPrazo / numParcelas) * (1 - a) ); 
    }
}

/**
 * 
 * @param {Number} precoAPrazo 
 * @param {Number} taxaDeJuros 
 * @param {Number} precoAVista 
 * @param {Boolean} temEntrada 
 * @param {Number} numParcelas 
 * @returns {Number}
 */
function calcularValorDerivadaFuncao(precoAPrazo,taxaDeJuros,precoAVista, temEntrada, numParcelas){
    let a = 0; let b = 0;
        if(temEntrada){
            a = Math.pow(1+taxaDeJuros,numParcelas-2);
            b = Math.pow(1 + taxaDeJuros, numParcelas - 1);

            return precoAVista * (b + (taxaDeJuros * a * (numParcelas - 1) ) ) - (precoAPrazo * b);
           
        }
        else{
            a = Math.pow(1 + taxaDeJuros, -numParcelas);
            b = Math.pow(1 + taxaDeJuros, -numParcelas - 1 );
    
            return precoAVista - (precoAPrazo * b); 
        }
}
 
/**
 * 
 * @param {Number} precoAVista 
 * @param {Number} coeficienteFinanciamento 
 * @returns {Number}
 */
export function calcularPMT(precoAVista,coeficienteFinanciamento){
    return precoAVista * coeficienteFinanciamento;
}

/**
 * 
 * @param {Number} precoAVista 
 * @param {Number} pmt 
 * @param {Number} numParcelas 
 * @param {Number} taxaDeJuros 
 * @param {Boolean} temEntrada 
 * @returns {Array<Array<String>>}
 */
export function getTabelaPrice(precoAVista,pmt,numParcelas,taxaDeJuros, temEntrada){

    let jurosTotal = 0, amortizacaoTotal = 0;
    let totalPago = temEntrada? pmt : 0;

    let tabelaPrice = [["Mês","Prestação", "Juros", "Amortizacao","Saldo Devedor"]];

  

    let juros = taxaDeJuros, amortizacao = 0,  saldoDevedor = precoAVista;



    for(let i = 1; i <= numParcelas; i++){


        // se for a primeira taxa, usar o juros la, senao, calcular
        juros = (saldoDevedor * taxaDeJuros);

        amortizacao = (pmt - juros);

        saldoDevedor -=  amortizacao;
        
         saldoDevedor = saldoDevedor > 0 ? saldoDevedor : 0;
     
        tabelaPrice.push([i ,pmt.toFixed(2), juros.toFixed(3), amortizacao.toFixed(2), saldoDevedor.toFixed(2)]);

        jurosTotal +=  juros;
        totalPago +=pmt;
        amortizacaoTotal += amortizacao;

    }

    totalPago = totalPago.toFixed(2);
    jurosTotal = jurosTotal.toFixed(3);
    amortizacaoTotal = amortizacaoTotal.toFixed(2);

    tabelaPrice.push([`Total:`, `${totalPago}`,`${jurosTotal}`, `${amortizacaoTotal}`,`${saldoDevedor.toFixed(2)}`]);

    return tabelaPrice;
}






