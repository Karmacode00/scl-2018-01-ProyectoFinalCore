// Función para colocar  el cargador en la pagina y pueda mostrar el contenido de la pagina cuando se completa la carga
let myVar;

function myFunction() {
  myVar = setTimeout(showPage, 3000);
}
function showPage() {
  document.getElementById("title").style.display="none";
  document.getElementById("loader").style.display="none";
  document.getElementById("myDiv").style.display="block";
  {window.location="prueba.html"}
}
// fin de la función


//  ++++++++++++++++++++++ 







