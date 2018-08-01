// Función para colocar  el cargador en la pagina y pueda mostrar el contenido de la pagina cuando se completa la carga
let myVar;

function myFunction() {
  myVar = setTimeout(showPage, 3000);
}
function showPage() {
  document.getElementById("title").style.display="none";
  document.getElementById("loader").style.display="none";
  document.getElementById("myDiv").style.display="block";
  document.getElementById("formulario").style.display="block";
  // {window.location="prueba.html"}
}
// fin de la función


//  ++++++++++++++++++++++ 
// Obtenemos todos los elementos que necesitaremos
var video = document.querySelector('#camera-stream'),
  image = document.querySelector('#snap'),
  start_camera = document.querySelector('#start-camera'),
  controls = document.querySelector('.controls'),
  take_photo_btn = document.querySelector('#take-photo'),
  delete_photo_btn = document.querySelector('#delete-photo'),
  download_photo_btn = document.querySelector('#download-photo'),
  error_message = document.querySelector('#error-message');


// Utilizamos la funcion getUserMedia para obtener la salida de la webcam
navigator.getMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);


if (!navigator.getMedia) {
  displayErrorMessage("Tu navegador no soporta la funcion getMedia.");
}
else {

  // Solicitamos la camara
  navigator.getMedia(
    {
      video: true
    },
    function (stream) {

      // A nuestro componente video le establecemos el src al stream de la webcam
      video.srcObject = stream

      // Reproducimos
      video.play();
      video.onplay = function () {
        showVideo();
      };

    },
    function (err) {
      displayErrorMessage("Ocurrio un error al obtener el stream de la webcam: " + err.name, err);
    }
  );

}



// En los moviles no se puede reproducir el video automaticamente, programamos funcionamiento del boton inicar camara
start_camera.addEventListener("click", function (e) {

  e.preventDefault();

  // Reproducimos manualmente
  video.play();
  showVideo();

});


take_photo_btn.addEventListener("click", function (e) {

  e.preventDefault();

  var snap = takeSnapshot();

  // Mostramos la imagen
  image.setAttribute('src', snap);
  image.classList.add("visible");

  // Activamos los botones de eliminar foto y descargar foto
  delete_photo_btn.classList.remove("disabled");
  download_photo_btn.classList.remove("disabled");

  // Establecemos el atributo href para el boton de descargar imagen
  download_photo_btn.href = snap;

  // Pausamos el stream de video de la webcam
  video.pause();

});


delete_photo_btn.addEventListener("click", function (e) {

  e.preventDefault();

  // Ocultamos la imagen
  image.setAttribute('src', "");
  image.classList.remove("visible");

  // Deshabilitamos botones de descargar y eliminar foto
  delete_photo_btn.classList.add("disabled");
  download_photo_btn.classList.add("disabled");

  // Reanudamos la reproduccion de la webcam
  video.play();

});



function showVideo() {
  // Mostramos el stream de la webcam y los controles

  hideUI();
  video.classList.add("visible");
  controls.classList.add("visible");
}


function takeSnapshot() {

  var hidden_canvas = document.querySelector('canvas'),
    context = hidden_canvas.getContext('2d');

  var width = video.videoWidth,
    height = video.videoHeight;

  if (width && height) {

    // Configuramos el canvas con las mismas dimensiones que el video
    hidden_canvas.width = width;
    hidden_canvas.height = height;

    // Hacemos una copia
    context.drawImage(video, 0, 0, width, height);

    // Convertimos la imagen del canvas en datarurl
    return hidden_canvas.toDataURL('image/png');
  }
}


function displayErrorMessage(error_msg, error) {
  error = error || "";
  if (error) {
    console.log(error);
  }

  error_message.innerText = error_msg;

  hideUI();
  error_message.classList.add("visible");
}


function hideUI() {
  // Limpiamos

  controls.classList.remove("visible");
  start_camera.classList.remove("visible");
  video.classList.remove("visible");
  snap.classList.remove("visible");
  error_message.classList.remove("visible");
}

function guardar(){
  const custom = customFile.files[0];
  const fileName = custom.name;
  const metadata = {
    contentType: custom.type
  };
  const task = firebase.storage().ref('images') 
    .child(fileName)
    .put(custom, metadata);
  task.then(snapshot => snapshot.ref.getDownloadURL())  //obtenemos la url de descarga (de la imagen)
  .then(url => {
    console.log("URL del archivo > "+url);
    const nombre = document.getElementById('nombre').value;
    document.getElementById('nombre').value = '';
    const apellido = document.getElementById('apellido').value;
    document.getElementById('apellido').value = '';
    const telefono = document.getElementById('telefono').value;
    document.getElementById('telefono').value = '';
    const correo = document.getElementById('correo').value;
    document.getElementById('correo').value = '';

    db.collection("publicacion").add({  
      name: nombre,
      lastName: apellido,
      phone: telefono,
      email: correo,
      img: url,

    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  });
};





