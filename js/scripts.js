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
    refrescar.setAttribute("href",`./index.html`)
    refrescar.innerHTML= "go back"
}