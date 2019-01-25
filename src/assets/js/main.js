window.onload = function() {
  setTimeout(showPage, 3000)
}

function showPage() {
  document.getElementById("title").style.display="none";
  document.getElementById("loader").style.display="none";
  document.getElementById("myDiv").style.display="block";
  document.getElementById("formulario").style.display="block";
  document.getElementById("empresas").style.display="block";
  // {window.location="prueba.html"}
}
// fin de la función


//  ++++++++++++++++++++++ 
// Obtenemos todos los elementos que necesitaremos
let video = document.querySelector('#camera-stream'),
  image = document.querySelector('#snap'),
  startCamera = document.querySelector('#start-camera'),
  controls = document.querySelector('.controls'),
  takePhotoBtn = document.querySelector('#take-photo'),
  deletePhotoBtn = document.querySelector('#delete-photo'),
  downloadPhotoBtn = document.querySelector('#download-photo'),
  errorMessage = document.querySelector('#error-message');


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
startCamera.addEventListener("click", function (e) {

  e.preventDefault();

  // Reproducimos manualmente
  video.play();
  showVideo();

});


takePhotoBtn.addEventListener("click", function (e) {

  e.preventDefault();

  let snap = takeSnapshot();

  // Mostramos la imagen
  image.setAttribute('src', snap);
  image.classList.add("visible");

  // Activamos los botones de eliminar foto y descargar foto
  deletePhotoBtn.classList.remove("disabled");
  downloadPhotoBtn.classList.remove("disabled");

  // Establecemos el atributo href para el boton de descargar imagen
  downloadPhotoBtn.href = snap;

  // Pausamos el stream de video de la webcam
  video.pause();

});


deletePhotoBtn.addEventListener("click", function (e) {

  e.preventDefault();

  // Ocultamos la imagen
  image.setAttribute('src', "");
  image.classList.remove("visible");

  // Deshabilitamos botones de descargar y eliminar foto
  deletePhotoBtn.classList.add("disabled");
  downloadPhotoBtn.classList.add("disabled");

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

  let hiddenCanvas = document.querySelector('canvas'),
    context = hiddenCanvas.getContext('2d');

  let width = video.videoWidth,
    height = video.videoHeight;

  if (width && height) {

    // Configuramos el canvas con las mismas dimensiones que el video
    hiddenCanvas.width = width;
    hiddenCanvas.height = height;

    // Hacemos una copia
    context.drawImage(video, 0, 0, width, height);

    // Convertimos la imagen del canvas en datarurl
    return hiddenCanvas.toDataURL('image/png');
  }
}


function displayErrorMessage(errorMsg, error) {
  error = error || "";
  if (error) {
    console.log(error);
  }

  errorMessage.innerText = errorMsg;

  hideUI();
  errorMessage.classList.add("visible");
}


function hideUI() {
  // Limpiamos

  controls.classList.remove("visible");
  startCamera.classList.remove("visible");
  video.classList.remove("visible");
  snap.classList.remove("visible");
  errorMessage.classList.remove("visible");
}

function save() {
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
    const rut = document.getElementById('rut').value;
    document.getElementById('rut').value = '';
    const telefono = document.getElementById('telefono').value;
    document.getElementById('telefono').value = '';
    const correo = document.getElementById('correo').value;
    document.getElementById('correo').value = '';

    db.collection("publicacion").add({  
      name: nombre,
      lastName: apellido,
      rut: rut,
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





