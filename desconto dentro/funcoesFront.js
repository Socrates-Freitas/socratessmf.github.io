import { getTabelaPrice } from "./main.js"; 

function printTabelaPrice(precoAVista,precoAPrazo,numParcelas,taxaDeJuros,temEntrada, tableDocumentElement){

    console.log("Imprimeindo...")
    let valorParcelas = 0; 
    let jurosReal = 0;

    let quantidadeParcelas = (temEntrada) ? (numParcelas - 1) : numParcelas;

    jurosReal = calcularTaxaDeJuros(precoAVista,precoAPrazo,numParcelas,temEntrada) * 100;
    jurosReal = jurosReal.toFixed(4);

    let jurosTotal = 0, totalPago = 0, amortizacaoTotal = 0, saldoDevedorTotal = precoAVista;
 
    let coeficienteFinanciamento = calcularCoeficienteFinanciamento(jurosReal,numParcelas);
    let pmt = (coeficienteFinanciamento * precoAVista).toFixed(2);

 
     valorParcelas = (precoAPrazo / numParcelas).toFixed(2);
 
 
 
    let fatorAplicado = calcularFatorAplicado(temEntrada,numParcelas,coeficienteFinanciamento, jurosReal);

    let jurosUsado = taxaDeJuros > 0? taxaDeJuros : jurosReal;
    jurosUsado = jurosUsado;
   

    let juros = jurosUsado, amortizacao = 0, saldo = 0, saldoDevedor = precoAVista;

    let tabelaPrice = getTabelaPrice(precoAVista,precoAPrazo,numParcelas,taxaDeJuros,temEntrada);

    let table = "";
    
    // tabelaPrice[0].forEach(function(element){
    //     tableHead += `<th> ${element} </th>`;
    // });

    // Adaptação para colocar a tabela price dentro de uma <table> </table>  

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