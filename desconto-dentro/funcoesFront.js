import { getTabelaPrice,
    calcularCoeficienteFinanciamento,
    calcularTaxaDeJuros,
    calcularFatorAplicado,
    calcularValorFuturo,
    calcularPMT,
    getValorCorrigido,
    calcularValorAVoltar,
    converterJurosMensalParaAnual } from "./main.js"; 


   // dragAndSave("#cdcfieldset"); // $("#cdcfieldset").draggable()

   
function handleButtonClick(){



    let tableElement,numeroParcelas,  juros,valorFinanciado,valorFinal,mesesAVoltar,temEntrada, imprimir;

    tableElement = document.querySelector("#table-content");
    let box1Element = document.querySelector("#left-box");
    let box2Element = document.querySelector("#right-box");

    let resultContainer = document.querySelector("#result-container");

    togleVisibility(resultContainer,false);

    $("#submitButton").click(function (event) {

        

        numeroParcelas = document.querySelector("#parc").value;
        juros = document.querySelector("#itax").value;
        valorFinanciado = document.querySelector("#ipv").value;
        valorFinal = document.querySelector("#ipp").value;
        mesesAVoltar = document.querySelector("#ipb").value;
        temEntrada = document.querySelector("#idp").checked;   
        imprimir = document.querySelector("#ipr").checked;   

      
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


            togleVisibility(resultContainer,true);
         

            let tabelaPrice, valorCorrigido, coeficienteFinanciamento;


            if(valorFinal == 0){
                coeficienteFinanciamento = calcularCoeficienteFinanciamento(juros, numeroParcelas);
                valorFinal = calcularValorFuturo(coeficienteFinanciamento,juros,valorFinanciado,numeroParcelas,temEntrada);
            }

            tabelaPrice = getTabelaPrice(valorFinanciado,valorFinal,numeroParcelas,juros,temEntrada);

            printTabelaPrice(tabelaPrice, tableElement);
            valorCorrigido = getValorCorrigido(tabelaPrice,numeroParcelas,mesesAVoltar);

            printBox1(valorFinanciado,valorFinal,numeroParcelas,juros,temEntrada, mesesAVoltar,box1Element);
            printBox2(valorFinanciado,valorFinal,numeroParcelas,juros,temEntrada, valorCorrigido, box2Element);
            
            if(imprimir){
                imprimirResultado(resultContainer);
            }else{
                scrollTo("left-box");

            }
            

        }

            
    });
}

function imprimirResultado(element){
    // let openWindow = window.open("", "title", "attributes");
    // openWindow.document.write(element.innerHTML);
    // openWindow.document.close();
    // openWindow.focus();
    // openWindow.print();
    // openWindow.close();
    window.print();
}

function togleVisibility(container,bool){
    if(bool){
        container.style.visibility = "visible"; 
        

    }else{
        container.style.visibility = "hidden"; 
    }
}

function scrollTo(hash) {
    location.hash = "#" + hash;
}


function printTabelaPrice(tabelaPrice, tableDocumentElement){

    let table = "";
 
   for(let i = 0; i < tabelaPrice.length; i++){
       if(i == 0){
           table += "<thead><tr>";
           tabelaPrice[i].forEach(function(element){
               table += `<th> ${element} </th>`;
                });
           table += "</tr></thead>";
       }
       else{
           table += "<tr>";
           tabelaPrice[i].forEach(function (element){

            // Coloca Negrito se for último elemento (Totais)
            if(i == tabelaPrice.length - 1){
               table += `<td> <b> ${element}  <b> </td>`;
            }
            else{
                table += `<td>  ${element} </td>`;
            }

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

    let jurosReal = calcularTaxaDeJuros(precoAVista,precoAPrazo,numParcelas,temEntrada) * 100;
    let coeficienteFinanciamento = calcularCoeficienteFinanciamento(jurosReal,numParcelas);

    let pmt = calcularPMT(precoAVista,coeficienteFinanciamento).toFixed(2);

    
    divElement.innerHTML = `<p><b>Parcelamento:</b> ${numParcelas} </p>
    <p><b>Taxa:</b> ${taxaDeJuros}% Ao Mês (${converterJurosMensalParaAnual(taxaDeJuros)}% Ao Ano) </p>
    <p><b>Valor Financiado:</b> $ ${precoAVista} </p>
    <p><b>Valor Final:</b> $ ${precoAPrazo}</p>
    <p><b>Meses a Voltar(Adiantados):</b> ${mesesAVoltar} </p>
    <p><b>Valor a voltar(Adiantamento da dívida):</b> $ ${calcularValorAVoltar(pmt,numParcelas,mesesAVoltar).toFixed(2)} </p>
    <p><b>Entrada:</b> ${temEntrada ? "Sim" : "Não"} </p>`;

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
function printBox2(precoAVista,precoAPrazo,numParcelas,taxaDeJuros,temEntrada,valorCorrigido,divElement){

    let jurosReal = 0;


    jurosReal = calcularTaxaDeJuros(precoAVista,precoAPrazo,numParcelas,temEntrada) * 100;
    let coeficienteFinanciamento = calcularCoeficienteFinanciamento(jurosReal,numParcelas);

    jurosReal = jurosReal.toFixed(4);
 
    let pmt = calcularPMT(precoAVista,coeficienteFinanciamento).toFixed(2);
 
    let jurosEmbutido = ((precoAPrazo - precoAVista) / precoAVista) * 100;
    jurosEmbutido = jurosEmbutido.toFixed(2);
    let desconto = ((precoAPrazo - precoAVista) / precoAPrazo) * 100;
    let fatorAplicado = calcularFatorAplicado(temEntrada,numParcelas,coeficienteFinanciamento,taxaDeJuros);
    desconto = desconto.toFixed(2);

    divElement.innerHTML = `
    <p><b>Prestação:</b> $ ${pmt}</p>
    <p> <b>Taxa Real:</b>  ${jurosReal}%</p>
    <p> <b>Coeficiente de Financiamento:</b> ${coeficienteFinanciamento.toFixed(6)} </p>
    <p><b>Fator Aplicado:</b> ${fatorAplicado.toFixed(6)}</p>
    <p> <b>Valor Corrigido:</b> $ ${valorCorrigido} </p>
    <p> <b>Juros Embutido:</b> ${jurosEmbutido}% </p>
    <p> <b>Desconto:</b>  ${desconto}% </p>
    `;
}


handleButtonClick();