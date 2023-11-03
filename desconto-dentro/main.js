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

TODO: Usar a taxa de juros do usuario

TODO: modularizar codigo pra pegar algumas informações individualmente

TODO: transformar a tabela price em um array de arrays

// ao usar navbar escuro, colocar navbar-dark dentro da classe e style = "background:<cor>"


// CF * y = x
// TODO: Usar visibilidade pra alternar entre formulario e Tabela

*/

// desconto racional por dentro | ou desconto por dentro
function fe(ehPrimeiraTaxa, taxaJuros){
    return  (ehPrimeiraTaxa == true)?  1 + taxaJuros : 1;
}

function calcularParcelasComJuros(valorDeEmprestimo,coeficienteFinanciamento, ehPrimeiraTaxa, taxaJuros){
    let f = fe(ehPrimeiraTaxa, taxaJuros);

    return valorDeEmprestimo * (coeficienteFinanciamento / f);
}

export function calcularCoeficienteFinanciamento(taxaJuros, quantidadeParcelas){
    let taxaCorrigida = taxaJuros / 100;
    return taxaCorrigida / (1 - Math.pow(1 + taxaCorrigida, -quantidadeParcelas) );
}

export function calcularValorPresente(coeficienteFinanciamento, taxaJuros, precoAPrazo,parcelas,ehPrimeiraTaxa){
    let f = fe(ehPrimeiraTaxa, taxaJuros);

    return (precoAPrazo / parcelas) * (f / coeficienteFinanciamento);
}

export function calcularValorFuturo(coeficienteFinanciamento, taxaJuros, precoAVista,parcelas,ehPrimeiraTaxa){
    let f = fe(ehPrimeiraTaxa, taxaJuros);
    return (precoAVista / parcelas) / (f / coeficienteFinanciamento);

}

 export function calcularFatorAplicado(temEntrada, numParcelas,coeficienteFinanciamento, taxaJuros){
    let f = fe(temEntrada, taxaJuros);

    return f/(numParcelas * coeficienteFinanciamento);
}

// Função para calcular a taxa de juros usando o Método de Newton
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

export function getValorCorrigido(tabelaPrice,numeroParcelas,mesesAVoltar){
    if(mesesAVoltar == 0 || mesesAVoltar >= numeroParcelas) return 0;
    else{
        let tamanho = tabelaPrice.length - 2;
        return tabelaPrice[tamanho - mesesAVoltar ][4];
    }
}

export function calcularValorAVoltar(pmt, numeroParcelas,mesesAVoltar){
    if( Number(mesesAVoltar) > Number(numeroParcelas)){
        return 0;
    }
    else{
        return pmt * mesesAVoltar;
    }
}

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

function calcularValorDerivadaFuncao(precoAPrazo,taxaDeJuros,precoAVista, temEntrada, numParcelas){
    let a = 0; let b = 0;
    // let c = 0;
        if(temEntrada){
            a = Math.pow(1+taxaDeJuros,numParcelas-2);
            b = Math.pow(1 + taxaDeJuros, numParcelas - 1);
           // c = Math.pow(1 + taxaDeJuros, numParcelas);
    
            return precoAVista * (b + (taxaDeJuros * a * (numParcelas - 1) ) ) - (precoAPrazo * b);
           
        }
        else{
            a = Math.pow(1 + taxaDeJuros, -numParcelas);
            b = Math.pow(1 + taxaDeJuros, -numParcelas - 1 );
    
            return precoAVista - (precoAPrazo * b); 
        }
}
    
export function calcularPrecoAPrazo(precoAVista, taxaDeJuros, numParcelas ){
    // let precoAPrazo = 0;

    // for(let i =0; i < numParcelas; i++){
    //     precoAPrazo += (precoAVista / numParcelas) * taxaDeJuros;
    // }

    // return precoAPrazo;
    return precoAVista * (1 + taxaDeJuros)**numParcelas + taxaDeJuros;
}

export function calcularPMT(precoAVista,coeficienteFinanciamento){
    return precoAVista * coeficienteFinanciamento;
}

// TODO Tirar Variavel Valor Parcela, uar PMT

export function getTabelaPrice(precoAVista,precoAPrazo,numParcelas,taxaDeJuros,temEntrada){

    let jurosReal = 0;

    let quantidadeParcelas = (temEntrada) ? (numParcelas - 1) : numParcelas;


    jurosReal = calcularTaxaDeJuros(precoAVista,precoAPrazo,numParcelas,temEntrada) * 100;
    let coeficienteFinanciamento = calcularCoeficienteFinanciamento(jurosReal,numParcelas);


    jurosReal = jurosReal.toFixed(4);

    precoAPrazo = (precoAPrazo > 0) ? precoAPrazo : precoAVista * coeficienteFinanciamento;

    let jurosTotal = 0, totalPago = 0, amortizacaoTotal = 0, saldoDevedorTotal = precoAVista;
 
    let pmt =calcularPMT(precoAVista,coeficienteFinanciamento).toFixed(2);


    let jurosUsado = taxaDeJuros > 0? taxaDeJuros : jurosReal;
   // jurosUsado = jurosUsado;

    let tabelaPrice = [["Mês","Prestação", "Juros", "Amortizacao","Saldo Devedor"]];

  

    let juros = jurosUsado, amortizacao = 0, saldo = 0, saldoDevedor = precoAVista;



    for(let i = 1; i <= quantidadeParcelas; i++){


        // se for a primeira taxa, usar o juros la, senao, calcular
        juros = (saldoDevedor * jurosUsado)/100;
        juros = juros.toFixed(2); 

        amortizacao = (pmt - juros).toFixed(2);

        saldoDevedor -=  amortizacao;
        saldoDevedor = saldoDevedor > 0 ? saldoDevedor : 0;
        saldoDevedor = saldoDevedor.toFixed(2);

        //saldoDevedorTotal = saldoDevedorTotal - amortizacao;
     
        tabelaPrice.push([i,pmt, juros, amortizacao,saldoDevedor]);

        jurosTotal +=  Number(juros);
        totalPago += Number(pmt);
        amortizacaoTotal += Number(amortizacao);

    }

    totalPago = totalPago.toFixed(2);
    jurosTotal = jurosTotal.toFixed(2);
    amortizacaoTotal = amortizacaoTotal.toFixed(2);

    tabelaPrice.push([`Total:`, `${totalPago}`,`${jurosTotal}`, `${amortizacaoTotal}`,`${saldoDevedor}`]);

    return tabelaPrice;
}






