const container = document.querySelector('#cardContainer');
const input = document.querySelector('#inputId');
const button = document.querySelector('#searchBtn');
const cartContent = document.querySelector('#cartContent');
const buttonClearCart = document.querySelector('.btn-clear-cart');

let books = [];
const savedCart = JSON.parse(localStorage.getItem("cart"));
let cart = savedCart ? savedCart : [];

async function getBooks() {
    try {
        const response = await fetch("https://striveschool-api.herokuapp.com/books");
        const books = await response.json();
        return books;
    } catch (error) {
        console.log('Failed to load content', error);
    }
}

function generateCard(book) {
    const cardContainer = document.createElement('div');
    cardContainer.setAttribute('class', 'col-12 col-md-4 col-lg-3 pb-2');
    cardContainer.setAttribute('id', book.asin);
    cardContainer.innerHTML = /*html*/
        `    <div class="card" style="width: 18rem;">
            <img src="${book.img}" class="card-img-top book-cover" alt="...">
            <div class="card-body">
                <h5 class="card-title text-truncate">${book.title}</h5>
                <p class="card-text">${book.price} € </p>
                <p class="card-text">${book.asin}</p>
                
                <button type="button" class="btn btn-primary" id="btn-${book.asin}">Aggiungi al carrello</button>
            </div>
        </div>`;
    container.append(cardContainer);

    const addToCartButton = cardContainer.querySelector(`#btn-${book.asin}`);
    addToCartButton.addEventListener("click", function () {
        cardContainer.classList.add('added-to-cart');
        cart.push(book);

        writeToLocalStograge("cart", cart);
        updateCartMarco();
    });
}
// salvare il carrelo in un array fittizio e se l'array è vuoto guardare il local storage

const updateCartMarco = () => {
    const savedCart = readFromLocalStorage("cart");
    cartContent.innerHTML = "";
    if (savedCart) {
        savedCart.forEach((cartItem, index) => {
            console.log(index);
            createCartItem(cartItem, cartContent, index);
        });
    } else {
        const paragraph = document.createElement('p');
        paragraph.innerText = "Non ci sono elementi nel carrello";
        cartContent.appendChild(paragraph);
    }

};

function createCartItem(cartItem, containerToAppend, index) {
    const div = document.createElement('div');
    div.setAttribute('class', 'col-12');
    div.innerHTML = `${cartItem.title} - ${cartItem.price}€`;
    const button = document.createElement('button');
    button.innerText = "Cancella elemento";
    div.appendChild(button);
    containerToAppend.appendChild(div);

    button.addEventListener("click", () => {
        removeItemFromCart(index)
    })

}

function readFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
function writeToLocalStograge(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
}


function removeItemFromCart(index) {
    const savedCart = readFromLocalStorage("cart");
    if (savedCart) {
        savedCart.splice(index, 1)
        writeToLocalStograge("cart", savedCart)
        updateCartMarco();
    }
}

updateCartMarco();


buttonClearCart.addEventListener("click", () => {
    localStorage.removeItem("cart");
    updateCartMarco();
})

getBooks().then(books => {
    books.map((book) => generateCard(book));
});

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
    const searchTerms = document.querySelector("#inputId").value;

    container.innerHTML = "";
    for (let book of books) {
        if (book.title.toLowerCase().includes(searchTerms.toLowerCase())) {
            generateCard(book);
        }
    }
}

input.addEventListener("change", async () => {
    console.log("changed");
    if (input.value === "") {
        getBooks().then(books => {
            books.map((book) => generateCard(book));
        });
    }
});

button.addEventListener("click", async () => {
    container.innerHTML = "";
    const searchTerms = input.value;
    filterBooks(searchTerms).then(filteredBooks => {
        filteredBooks.forEach(book => generateCard(book));
    });
});
