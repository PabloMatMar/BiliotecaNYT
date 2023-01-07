//LLamamos a la api para obtener el array con la lista de listas. Despues llamamos a pintarListas() con el array como parametro:
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
}
//Esta funcion llama a la api para pedir la lista de libros que el cliente a seleccionado. Una vez tiene los libros lama a pintarLibros() pasanadole como parametro el array de libros.
async function llamarApiLibros(name) {
  const libros = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${name}.json?api-key=bUjiwYFELhnv9KfzeDbAk9eFwINQyKqT`)
  const librosParseados = await libros.json()
  const arrayLibros = librosParseados.results
  pintarLibros(arrayLibros)
}
//Toma el array con los datos de la lista de libros como parametro y usando un for pinta los libros.
function pintarLibros(arrayLibros) {
  const pintandoLibros = arrayLibros.books
  const union = document.getElementById("collections")
  union.innerHTML = ""
  for (let i = 0; i < pintandoLibros.length; i++) {
    const articulo = document.createElement("article")
    union.appendChild(articulo)
    articulo.innerHTML = `<h3>${pintandoLibros[i].title}</h3>
        <img src="${pintandoLibros[i].book_image}">
        <h4>Synopsis</h4>
        <p>${pintandoLibros[i].description}</p>
        <h4>Position ${pintandoLibros[i].rank} of the best sellers</h4>
        <h4>This book has been on the list for ${pintandoLibros[i].weeks_on_list} weeks</h4>
        <a href="${pintandoLibros[i].buy_links[0].url}" target="_blank">Link to buy in amazon</a>`
  }
  const backBoton = document.createElement("button")
  union.appendChild(backBoton)
  const refrescar = document.createElement("a")
  backBoton.appendChild(refrescar)
  refrescar.setAttribute("href", `./index.html`)
  refrescar.innerHTML = "go back"
}

if (document.title === "LogIn" || document.title === "SingUp" || document.title === "Library") {
  const firebaseConfig = {
    apiKey: "AIzaSyC3sHZYxlku8SXnGSSCL_wnH6LNoLS2v2I",
    authDomain: "bibliotecanyt-c2ed1.firebaseapp.com",
    projectId: "bibliotecanyt-c2ed1",
    storageBucket: "bibliotecanyt-c2ed1.appspot.com",
    messagingSenderId: "326067608596",
    appId: "1:326067608596:web:b63a139d0a5f4970479b01"
  };

  firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase
  const db = firebase.firestore();
  const createUser = (user) => {
    db.collection("users")
      .add(user)
      .then((docRef) => console.log("Document written with ID: ", docRef.id))
      .catch((error) => console.error("Error adding document: ", error));
  };
  const readAllUsers = (born) => {
    db.collection("users")
      .where("first", "==", born)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
        });
      });
  };
  function readOne(id) {
    db.collection("users")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
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
          favoritos: []
        }
        const contenedor = data.favoritos
        createUser(data);
        guardarFavorito(contenedor)
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
      pass === pass2 ? signUpUser(email, pass) : alert("error password");
    })
  }
  if (document.title === "LogIn") {
    const signInUser = (email, password) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          let user = userCredential.user;
          console.log(`se ha logado ${user.email} ID:${user.uid}`)
          alert(`se ha logado ${user.email} ID:${user.uid}`)
          if (document.title === "LogIn"||document.title === "Library") {
            console.log("USER", user);
          }
        })
        .catch((error) => {
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log(errorCode)
          console.log(errorMessage)
        });
    }

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
    // Listener de usuario en el sistema
    // Controlar usuario logado
  }
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(`Está en el sistema:${user.email} ${user.uid}`);
    } else {
      console.log("no hay usuarios en el sistema");
    }
  });
}
function guardarFavorito(contenedor){
  console.log(contenedor)
}