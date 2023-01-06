async function llamarApi() {
    const listas = await fetch("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=bUjiwYFELhnv9KfzeDbAk9eFwINQyKqT");
    const listasParseadas = await listas.json();
    const listaDeListas = listasParseadas.results;
    return listaDeListas;
}

async function pintarListas() {
    const listaDeListas = await llamarApi();
    const union = document.getElementById("collections");
    union.innerHTML = "";
    for (let i = 0; i < listaDeListas.length; i++) {
        const article = document.createElement("article");
        union.appendChild(article)
        article.innerHTML = `<h3>${listaDeListas[i].display_name}</h3>
        <p>Oldest book: ${listaDeListas[i].oldest_published_date}</p>
        <p>Newest book: ${listaDeListas[i].newest_published_date}</p>
        <p>Updated: ${listaDeListas[i].updated}</p>
        <button id="button${i}"type="button">Click for look books!</button>`

    }
}

pintarListas()