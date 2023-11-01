import { getTabelaPrice,
    calcularCoeficienteFinanciamento,
     calcularTaxaDeJuros,
     calcularFatorAplicado,
     calcularValorPresente,
     calcularPrecoAPrazo } from "./main.js"; 

//export { printTabelaPrice };


let tableElement = document.getElementById("table-content");

$("#submitButton").click(function (event) {

    console.log("asdfsadfasdf");

    printTabelaPrice(450,500,10,0,false, tableElement);
    
    //     event.preventDefault();
    
    var errorMessage = "";
    if ($("#itax").val() == 0 && $("#ipp").val() == 0) {
        errorMessage +=
        "<p>Taxa de juros e valor final não podem ser ambos nulos.</p>";
    }
    if ($("#itax").val() == 0 && $("#ipv").val() == 0) {
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
        event.preventDefault();
    } else {
        $("#successMessage").show();
        $("#errorMessage").hide();

    //        printTabelaPrice(450,500,10,0,false, tableDocumentElement);
    }
        
        
});



   // dragAndSave("#cdcfieldset"); // $("#cdcfieldset").draggable()


function printTabelaPrice(precoAVista,precoAPrazo,numParcelas,taxaDeJuros,temEntrada, tableDocumentElement){

   
   //console.log("Imprimeindo...")
   let valorParcelas = 0; 
   let jurosReal = 0;

   let quantidadeParcelas = (temEntrada) ? (numParcelas - 1) : numParcelas;

//    jurosReal = calcularTaxaDeJuros(precoAVista,precoAPrazo,numParcelas,temEntrada) * 100;
//    jurosReal = jurosReal.toFixed(4);


   let coeficienteFinanciamento = calcularCoeficienteFinanciamento(jurosReal,numParcelas);
   let pmt = (coeficienteFinanciamento * precoAVista).toFixed(2);


    valorParcelas = (precoAPrazo / numParcelas).toFixed(2);




   let jurosUsado = taxaDeJuros > 0? taxaDeJuros : jurosReal;
   jurosUsado = jurosUsado;
  


   let tabelaPrice = getTabelaPrice(precoAVista,precoAPrazo,numParcelas,taxaDeJuros,temEntrada);

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