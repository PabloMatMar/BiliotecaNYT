
//LLamamos a la api para obtener el array con la lista de listas. Despues llamamos a pintarListas() con el array como parametro:
if (document.title === "Library") {
  async function llamarApi() {
    const listas = await fetch("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=bUjiwYFELhnv9KfzeDbAk9eFwINQyKqT")
    const listasParseadas = await listas.json()
    const listaDeListas = listasParseadas.results
    pintarListas(listaDeListas)
  }
  llamarApi()
  //Toma el array con los datos de la lista de listas como parametro y usando un for pinta las listas. Al terminar tiene un evento que en caso de hacer click en uno de los botones llama a la funcion llamarApiLibros() y le pasa como parametro el list_encoded de la lista que el cliente a clicado:
  function pintarListas(listaDeListas) {
    const union = document.getElementById("collections")
    union.innerHTML = ""
    for (let i = 0; i < listaDeListas.length; i++) {
      const articulo = document.createElement("article")
      union.appendChild(articulo)
      articulo.innerHTML = `<h3>${listaDeListas[i].display_name}</h3>
        <p>Oldest book: ${listaDeListas[i].oldest_published_date}</p>
        <p>Newest book: ${listaDeListas[i].newest_published_date}</p>
        <p>Updated: ${listaDeListas[i].updated}</p>
        <button id="button${i}"type="button">Click for look books!</button>`
      const boton = document.getElementById(`button${i}`)
      boton.addEventListener('click', function () {
        llamarApiLibros(listaDeListas[i].list_name_encoded)
      })

    }
    const botonListaFav = document.getElementById("favList")
    botonListaFav.style.display = "none"
  }
  //Esta funcion llama a la api para pedir la lista de libros que el cliente a seleccionado. Una vez tiene los libros lama a pintarLibros() pasanadole como parametro el array de libros.
  async function llamarApiLibros(name) {
    const libros = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${name}.json?api-key=bUjiwYFELhnv9KfzeDbAk9eFwINQyKqT`)
    const librosParseados = await libros.json()
    const arrayLibros = librosParseados.results
    const pintandoLibros = arrayLibros.books
    pintarLibros(pintandoLibros)
    botonFavoritos(pintandoLibros)
  }
  //Toma el array con los datos de la lista de libros como parametro y usando un for pinta los libros.
  function pintarLibros(pintandoLibros) {
    const union = document.getElementById("collections")
    union.innerHTML = ""
    for (let i = 0; i < pintandoLibros.length; i++) {
      const libroFavorito = {
        caratula: pintandoLibros[i].book_image,
        descripcion: pintandoLibros[i].description,
        ranking: pintandoLibros[i].rank,
        semanas: pintandoLibros[i].weeks_on_list,
        link: pintandoLibros[i].buy_links[0].url
      }
      const articulo = document.createElement("article")
      union.appendChild(articulo)
      articulo.innerHTML = `<h3>${pintandoLibros[i].title}</h3>
        <img src="${pintandoLibros[i].book_image}">
        <h4>Synopsis</h4>
        <p>${pintandoLibros[i].description}</p>
        <h4>Position ${pintandoLibros[i].rank} of the best sellers</h4>
        <h4>This book has been on the list for ${pintandoLibros[i].weeks_on_list} weeks</h4>
        <button><a href="${pintandoLibros[i].buy_links[0].url}" target="_blank">Link to buy in amazon</a></button>
        <button id="fav${i}"type="button">Save to favorites</button>`
      const boton = document.getElementById(`fav${i}`)
      boton.addEventListener('click', function () {
        const arrayFavoritos = []
        arrayFavoritos.push(libroFavorito)
        addFav(firebase.auth().currentUser.uid, arrayFavoritos)
      })
    }
    const backBoton = document.createElement("button")
    union.appendChild(backBoton)
    const refrescar = document.createElement("a")
    backBoton.appendChild(refrescar)
    refrescar.setAttribute("href", `./index.html`)
    refrescar.innerHTML = "go back"
    const botonListaFav = document.getElementById("favList")
    botonListaFav.style.display = "block"
  }

}

const firebaseConfig = {
  apiKey: "AIzaSyC3sHZYxlku8SXnGSSCL_wnH6LNoLS2v2I",
  authDomain: "bibliotecanyt-c2ed1.firebaseapp.com",
  projectId: "bibliotecanyt-c2ed1",
  storageBucket: "bibliotecanyt-c2ed1.appspot.com",
  messagingSenderId: "326067608596",
  appId: "1:326067608596:web:b63a139d0a5f4970479b01"
};

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

// // SUBIR UNA IMAGEN AL CLOUD
// // Create a root reference
// var storageRef = firebase.storage().ref();

// // Create a reference to 'mountains.jpg'
// var mountainsRef = storageRef.child('styles\descarga.jpg');

// // Create a reference to 'images/mountains.jpg'
// var mountainImagesRef = storageRef.child('styles\descarga.jpg');

// // While the file names are the same, the references point to different files
// mountainsRef.name === mountainImagesRef.name;           // true
// mountainsRef.fullPath === mountainImagesRef.fullPath;   // false






const db = firebase.firestore();
const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};
// const readAllUsers = (born) => {
//   db.collection("users")
//     .where("first", "==", born)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         console.log(doc.data());
//       });
//     });
// };
// function readOne(id) {
//   db.collection("users")
//     .doc(id)
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         console.log("Document data:", doc.data());
//       } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//       }
//     })
//     .catch((error) => {
//       console.log("Error getting document:", error);
//     });
// }
const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      alert(`se ha registrado ${user.email} ID:${user.uid}`)
      // ...
      // Guarda El usuario en Firestore
      let data = {
        id: user.uid,
        email: user.email,
      }
      const contenedor = data.favoritos
      createUser(data);
      // guardarFavorito(contenedor)
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("Error en el sistema" + errorMessage);
      console.log("Error en el sistema" + errorCode);
    });
};
//"alex@demo.com","123456"
if (document.title === "SingUp") {
  document.getElementById("form1").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    let pass2 = event.target.elements.pass2.value;
    // let url = event.target.elements.text.value;
    if (pass === pass2) {
      signUpUser(email, pass);
      enviarVerificacion(email);
      confirmarEmail(email);
    } else {
      alert("error password");
    }
  })

  function confirmarEmail(email) {

    const user = firebase.auth().currentUser;
    console.log(user)

    user.updateEmail(email).then(() => {
      console.log("Se ha confirmado el email")
    }).catch((error) => {

      console.log("fallo!")
    });
  }

  function enviarVerificacion(email) {

    firebase.auth().currentUser.sendEmailVerification(email)
      .then(() => {
        console.log("Se ha enviado el email de verificacion")

      });
  }
}
// if (document.title === "LogIn") {
const signInUser = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha logado ${user.email} ID:${user.uid}`)
      alert(`se ha logado ${user.email} ID:${user.uid}`)
      console.log("USER", user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });
}
if (document.title === "LogIn") {
  //recuperar contraseña
  document.getElementById("form3").addEventListener("submit", function (event) {
    event.preventDefault();
    let resetEmail = event.target.elements.email3.value;
    let email2 = event.target.elements.email4.value;
    email2 === resetEmail ? recuperarContrasenya(resetEmail) : alert("error verificacion email");

  })

  function recuperarContrasenya(resetEmail) {
    firebase.auth().sendPasswordResetEmail(resetEmail)
      .then(() => {
        console.log("Se ha enviado un correo para recuperar la contraseña")

      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
        console.log("Error Recuperacion Email")

      });
  }
  //deslogearse
  const signOut = () => {
    let user = firebase.auth().currentUser;
    firebase.auth().signOut().then(() => {
      console.log("Sale del sistema: " + user.email)
    }).catch((error) => {
      console.log("hubo un error: " + error);
    });
  }
  document.getElementById("form2").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email2.value;
    let pass = event.target.elements.pass3.value;
    signInUser(email, pass)
  })
  document.getElementById("salir").addEventListener("click", signOut);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const displayName = user.displayName;
      // console.log(displayName)
      const email = user.email;
      // console.log(email)
      const photoURL = user.photoURL;
      // mostrarUserFoto(user)
      // console.log(photoURL)
      const emailVerified = user.emailVerified;

      var uid = user.uid;
      // ...
    }
  });
}
function botonFavoritos(pintandoLibros) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const userID = firebase.auth().currentUser.uid
      console.log(`Está en el sistema:${user.email} ${user.uid}`);
      const boton = document.getElementById("favList")
      boton.addEventListener('click', function () {

        traerFavoritos(firebase.auth().currentUser.uid)
      })
    } else {
      console.log("no hay usuarios en el sistema");

      const botonListaFav = document.getElementById("favList")
      botonListaFav.style.display = "none"

      for (let i = 0; i < pintandoLibros.length; i++) {
        const botonFav = document.getElementById(`fav${i}`)
        botonFav.style.display = "none"

      }

      // for (let i = 0; i < pintandoLibros.length; i++) {
      //   const botonFav = document.getElementById(`fav${i}`)
      //   botonFav.style.display = "none"

      // }
    }
  });
}
//Subiendo favoritos a firebase
function addFav(userID, arrayFavoritos) {
  db.collection('users')
    .where('id', '==', userID)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (!doc.data().hasOwnProperty('favs')) {
          doc.ref.update({ favoritos: arrayFavoritos });
          console.log(arrayFavoritos)
          console.log("coleccion subida a fireBase")
        } else {
          console.log("Fallo display none boton añadir favoritos")
          // doc.ref.update({ favoritos: doc.data().favs.concat(arrayFavoritos) });
        }
      });
    });
}

// function traerFavoritos(userID) {
//   db.collection('users')
//     .where('id', '==', userID)
//     .get()
//     .then((snapshot) => {

//       console.log(snapshot)
//       // document.getElementById('backf-button').onclick = createMainList;
//     })
// }