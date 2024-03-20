const container = document.querySelector('#cardContainer')
const input = document.querySelector('#inputId')
const button = document.querySelector('#searchBtn')
let cart = []
let books = []

function generateCard(book) {
    const cardContainer = document.createElement('div');
    cardContainer.setAttribute('class', 'col-12 col-md-4 col-lg-3');
    cardContainer.setAttribute('id', book.asin);
    cardContainer.innerHTML = /*html*/
        `<div class="card" style="width: 18rem;">
    <img src="${book.img}" class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">${book.title}</h5>
        <p class="card-text">${book.price} € </p>
        <p class="card-text">${book.asin}</p>
        <a href="#" class="btn btn-primary" id="btn-btn-btn">Aggiungi al carrello</a>
    </div>
    </div>`;

    container.append(cardContainer);

    //const addToCartButton = cardContainer.querySelector(`#btn-btn-btn`);
    //addToCartButton.addEventListener("click", function () {
    //    cardContainer.classList.add('added-to-cart');
    //    cart.push(book);

    // localStorage.setItem('cart', JSON.stringify(cart));

    const addToCartButton = cardContainer.querySelector('.btn-primary');
    addToCartButton.id = `add-to-cart-${book.asin}`;
    addToCartButton.addEventListener("click", function () {
        if (!cart.some(item => item.asin === book.asin)) {
            cart.push(book);
            
            addToCartButton.textContent = "Aggiunto";
            addToCartButton.disabled = true;
        }

        const card = cardContainer.querySelector('.card-body');
        card.classList.add('selected');
    });
}



async function getBooks() {
    try {
        const response = await fetch("https://striveschool-api.herokuapp.com/books");
        const books = await response.json();
        return books;
    } catch (error) {
        console.log('Failed to load content', error);
    }
}

getBooks().then(books => {
    books.map((book) => generateCard(book))
})

async function filterBooks(query) {
    const books = await getBooks();
    container.innerHTML = "";
    books.filter((book) => {
        const title = book.title.toLowerCase();
        const lowerQuery = query.toLowerCase();
        return title.includes(lowerQuery);
    }).forEach((book) => generateCard(book));
}

function searchBooks() {
    const searchTerms = document.querySelector("#inputId").value

    co