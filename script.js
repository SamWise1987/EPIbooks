const container = document.querySelector('#cardContainer')
const input = document.querySelector('#inputId')
const button = document.querySelector('#searchBtn')
let cart = []
let books = []

function generateCard(book) {
    const cardContainer = document.createElement('div')
    cardContainer.setAttribute('class', 'col-12 col-md-4 col-lg-3')
    cardContainer.setAttribute('id', book.asin)
    cardContainer.innerHTML = /*html*/ `<div class="card" style="width: 18rem;">
    <img src="${book.img}" class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">${book.title}</h5>
        <p class="card-text">${book.price} € </p>
        <p class="card-text">${book.asin}</p>
        <a href="#" class="btn btn-primary" id="btn-${book.asin}}">Aggiungi al carrello</a>
    </div>
</div>`
    container.append(cardContainer)

    const addToCartButton = document.querySelector(`#btn-${book.asin}`)
    addToCartButton.addEventListener("click", function () {
        cardContainer.classList.add('added-to-cart')
        cart.push(book.asin)
    })
}


async function getBooks() {
    try {
        const response = await fetch("https://striveschool-api.herokuapp.com/books")
        const books = await response.json()
        return books

    } catch (error) {
        console.log('Failed to load content', error);
    }
}

getBooks().then(books => {
    books.map((book) => generateCard(book))
})

async function filterBooks(query) {
    const books = await getBooks()
    container.innerHTML = ""
    //return books.filter((book) => {
    //  const title = book.title.toLowerCase()
    //  const lowerQuery = query.toLowerCase()
    //  return title.includes(lowerQuery)
    //})
    books.filter(book => booktitle.toLowerCase().includes(query.toLwoerCase()))
        .forEach(generateCard)
}

function searchBooks() {
    const searchTerms = document.querySelector("#inputId").value

    container.innerHTML = ""
    for (let book of books) {
        if (book.title.toLowerCase().includes(searchTerms.toLowerCase())) {
            generateCard(book)
        }
    }
}



input.addEventListener("change", async () => {
    console.log("changed");
    if (input.value === "") {
        getBooks().then(books => {
            books.map((book) => generateCard(book))
        })
    }
})

button.addEventListener("click", async () => {
    container.innerHTML = ""
    const query = input.value
    filterBooks(input.value).then(books => {
        books.filter((book) => generateCard(book))

    })
})



// il rallentamento è perchPé uso una async all'interno di un eventlistner e
//creare delle funzioni dedicat agli eventlistner
// dovrei astrarre i then in altr funzioni fuori dagli eventlistner e lancerà roba sincrona 