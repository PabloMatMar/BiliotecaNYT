async function llamarApi() {
    const listas = await fetch("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=bUjiwYFELhnv9KfzeDbAk9eFwINQyKqT")
    const listasParseadas = await listas.json()
    const listaDeListas = listasParseadas.results
    const union = document.getElementById("collections")
    union.innerHTML = ""
    for (let i = 0; i < listaDeListas.length; i++) {
        const articulo = document.createElement("article")
        union.appendChild(articulo)
        articulo.innerHTML = `<h3>${listaDeListas[i].display_name}</h3><p>Oldest book: ${listaDeListas[i].oldest_published_date}</p><p>Newest book: ${listaDeListas[i].newest_published_date}</p>
        <p>Updated: ${listaDeListas[i].updated}</p><button id="button${i}"type="button">Click for look books!</button>`
        const boton = document.getElementById(`button${i}`)
        boton.addEventListener('click', function () {
            llamarApiLibros(listaDeListas[i].list_name_encoded)        
        })
    }
}
llamarApi()

async function llamarApiLibros(name) {
    const libros = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${name}.json?api-key=bUjiwYFELhnv9KfzeDbAk9eFwINQyKqT`)
    const librosParseados = await libros.json()
    const arrayLibros = librosParseados.results
    const pintandoLibros = arrayLibros.books
    const union = document.getElementById("collections")
    union.innerHTML = ""
    for (let i = 0; i < pintandoLibros.length; i++) {
        const articulo = document.createElement("article")
        union.appendChild(articulo)
        articulo.innerHTML = `<h3>${pintandoLibros[i].title}</h3><img src="${pintandoLibros[i].book_image}"><h4>Synopsis</h4><p>${pintandoLibros[i].description}</p>
        <h4>Position ${pintandoLibros[i].rank} of the best sellers</h4><h4>This book has been on the list for ${pintandoLibros[i].weeks_on_list} weeks</h4><a href="${pintandoLibros[i].buy_links[0].url}" target="_blank">Link to buy in amazon</a>`
    }
    const backBoton = document.createElement("button")
    union.appendChild(backBoton)
    const refrescar = document.createElement("a")
    backBoton.appendChild(refrescar)
    refrescar.setAttribute("href",`./index.html`)
    refrescar.innerHTML= "go back"
}