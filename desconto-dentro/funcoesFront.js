import { getTabelaPrice,
    calcularCoeficienteFinanciamento,
     calcularTaxaDeJuros,
     calcularFatorAplicado,
     calcularValorFuturo,
     calcularValorPresente,
     calcularPrecoAPrazo,
     calcularPMT,
    getValorCorrigido,
    calcularValorAVoltar } from "./main.js"; 


   // dragAndSave("#cdcfieldset"); // $("#cdcfieldset").draggable()


function handleButtonClick(){



    let tableElement,numeroParcelas,  juros,valorFinanciado,valorFinal,mesesAVoltar,temEntrada, imprimir;

    tableElement = document.querySelector("#table-content");
    let box1Element = document.querySelector("#left-box");
    let box2Element = document.querySelector("#right-box");


    $("#submitButton").click(function (event) {

        

        numeroParcelas = document.querySelector("#parc").value;
        juros = document.querySelector("#itax").value;
        valorFinanciado = document.querySelector("#ipv").value;
        valorFinal = document.querySelector("#ipp").value;
        mesesAVoltar = document.querySelector("#ipb").value;
        temEntrada = document.querySelector("#idp").checked;   
        imprimir = document.querySelector("#ipr").checked;   

      


         // let errorDiv = document.querySelector("#errorMessage");
    // let successDiv = document.querySelector("#successMessage");

        var errorMessage = "";
        if (juros == 0 && valorFinal == 0) {
            errorMessage +=
            "<p>Taxa de juros e valor final não podem ser ambos nulos.</p>";
        }
        if (juros == 0 && $("#ipv").val() == 0) {
            errorMessage +=
            "<p>Taxa de juros e valor financiado não podem ser ambos nulos.</p>";
        }
        if ($("#ipv").val() == 0 && $("#ipp").val() == 0) {
            errorMessage +=
            "<p>Valor financiado e valor final não podem ser ambos nulos.</p>";
        }
        if (errorMessage != "") {
            $("#errorMessage").html(errorMessage);
            $("#errorMessage").show();
            $("#successMessage").hide();

        } else {
            $("#successMessage").show();
            $("#errorMessage").hide();

            let tabelaPrice, valorCorrigido, coeficienteFinanciamento;


            if(valorFinal == 0){
                coeficienteFinanciamento = calcularCoeficienteFinanciamento(juros, numeroParcelas);
                valorFinal = calcularValorPresente(coeficienteFinanciamento,juros,valorFinanciado,numeroParcelas,temEntrada);
            }

            tabelaPrice = getTabelaPrice(valorFinanciado,valorFinal,numeroParcelas,juros,temEntrada);

            printTabelaPrice(tabelaPrice, tableElement);
           
            printBox1(valorFinanciado,valorFinal,numeroParcelas,juros,temEntrada, mesesAVoltar,box1Element);
            printBox2(valorFinanciado,valorFinal,numeroParcelas,juros,temEntrada, tableElement);


        //        printTabelaPrice(450,500,10,0,false, tableDocumentElement);
        }

            
    });
}


// TODO: Fazer a tabela price retornar o Valor a voltar e o

function printTabelaPrice(tabelaPrice, tableDocumentElement){
   let table = "";
 
   for(let i = 0; i < tabelaPrice.length; i++){
       if(i == 0){
           table += "<thead><tr>";
           tabelaPrice[i].forEach(function(element){
               table += `<th> ${element} </th>`;
                });
           table += "</tr></thead>";
       }else{
           table += "<tr>";
           tabelaPrice[i].forEach(function (element){
               table += `<td> ${element} </td>`;
           });
           table += "</tr>";
       }
   }

   tableDocumentElement.innerHTML = table;
   
}




/*
Texto:
Parcelamento: 
Taxa: ##% Ao Mês (##% Ao Ano)
Valor Financiado:
Valor a voltar
Meses a voltar
Entrada: S/N
*/

function printBox1(precoAVista,precoAPrazo,numParcelas,taxaDeJuros,temEntrada,mesesAVoltar,divElement){


    let valorParcelas = 0; 
    let jurosReal = 0;



    jurosReal = calcularTaxaDeJuros(precoAVista,precoAPrazo,numParcelas,temEntrada) * 100;
    let coeficienteFinanciamento = calcularCoeficienteFinanciamento(jurosReal,numParcelas);


    jurosReal = jurosReal.toFixed(4);

    precoAPrazo = (precoAPrazo > 0) ? precoAPrazo : precoAVista * calcularCoeficienteFinanciamento;

    let jurosTotal = 0, totalPago = 0, amortizacaoTotal = 0, saldoDevedorTotal = precoAVista;
 
    let pmt = calcularPMT(precoAVista,coeficienteFinanciamento).toFixed(2);

 
     valorParcelas = (precoAPrazo / numParcelas).toFixed(2);
 
    
 

    let jurosUsado = taxaDeJuros > 0? taxaDeJuros : jurosReal;
    jurosUsado = jurosUsado;

    /*
Texto:
Parcelamento: 
Taxa: ##% Ao Mês (##% Ao Ano)
Valor Financiado:
Valor a voltar
Meses a voltar
Entrada: S/N
*/


    divElement.innerHTML = `<p>Parcelamento: ${numParcelas} </p>
    <p>Taxa: ${taxaDeJuros} Ao Mês (### Ao Ano) </p>
    <p>Valor Financiado: ${precoAVista} </p>
    <p>Valor Final: ${precoAPrazo}</p>
    <p>Valor a voltar(Adiantamento da dívida) ${calcularValorAVoltar(pmt,numParcelas,mesesAVoltar).toFixed(2)} </p>
    <p>Meses a Voltar ${mesesAVoltar} </p>
    <p>Entrada: ${temEntrada ? "Sim" : "Não"} </p>`;

}

/*
Texto:
Coeficiente de Financiamento: 
Prestacao: Conta la do PMT Ao mês
Valor Pago:
Taxa Real:
Valor Corrigido:
Juros Embutidos = ( x - y) / y * 100 = 11.11%
Desconto = ( x - y) / x * 100 = 10.00%
Excesso = $1889 .10 - $1889 .10 = $ -0.00
Excesso = ( $2099 .00 - $2099 .00) * 0.9000 = $ -0.00
Percentual pago a mais = -0.00%
*/
function printBox2(precoAVista,precoAPrazo,numParcelas,taxaDeJuros,temEntrada,divElement){

    let text = "";

    let valorParcelas = 0; 
    let jurosReal = 0;

    let quantidadeParcelas = (temEntrada) ? (numParcelas - 1) : numParcelas;


    jurosReal = calcularTaxaDeJuros(precoAVista,precoAPrazo,numParcelas,temEntrada) * 100;
    let coeficienteFinanciamento = calcularCoeficienteFinanciamento(jurosReal,numParcelas);


    jurosReal = jurosReal.toFixed(4);

    precoAPrazo = (precoAPrazo > 0) ? precoAPrazo : precoAVista * calcularCoeficienteFinanciamento;

    let jurosTotal = 0, totalPago = 0, amortizacaoTotal = 0, saldoDevedorTotal = precoAVista;
 
    let pmt = calcularPMT(precoAVista,coeficienteFinanciamento).toFixed(2);

 
     valorParcelas = (precoAPrazo / numParcelas).toFixed(2);
 
    
 

    let jurosUsado = taxaDeJuros > 0? taxaDeJuros : jurosReal;
    jurosUsado = jurosUsado;


  

    let juros = jurosUsado, amortizacao = 0, saldo = 0, saldoDevedor = precoAVista;



    /*
    Texto:
    Coeficiente de Financiamento: 
    Prestacao: Conta la do PMT Ao mês
    Valor Pago:
    Taxa Real:
    Valor Corrigido:
    Juros Embutidos = ( x - y) / y * 100 = 11.11%
    Desconto = ( x - y) / x * 100 = 10.00%
    Excesso = $1889 .10 - $1889 .10 = $ -0.00
    Excesso = ( $2099 .00 - $2099 .00) * 0.9000 = $ -0.00
    Percentual pago a mais = -0.00%
    */

    divElement.innerHTML = `
    <p> Coeficiente de Financiamento: ${coeficienteFinanciamento} </p>
    <p> Prestação: ${pmt}</p>
    <p> Taxa Real:  ${jurosReal}</p>
    <p> Valor Corrigido:  </p>
    <p> Juros Embutido:   </p>
    <p> Desconto:   </p>




    `;
}


handleButtonClick()