const container = document.querySelector('#cardContainer');
const input = document.querySelector('#inputId');
const button = document.querySelector('#searchBtn');

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

        localStorage.setItem('cart', JSON.stringify(cart));

        // Qui aggiorno il modale
        //updateCart(book);
    });
}

// popolo il modale
//function updateCart(book) {
//    const cartList = document.querySelector('#cartList');
//    const listItems = document.createElement('li');
//    listItems.textContent = `${book.title} - ${book.price} €`;

//    cartList.appendChild(listItems);
//}

const cartModal = document.querySelector('.btn-modal');
const updateCartMarco = () => {
    if (savedCart) {
        savedCart.forEach((cartItem) => {
            const div = document.createElement('div');
            div.innerHTML = `${cartItem.title} - ${cartItem.price} €`;
            cartModal.appendChild(div);
        });
    } else {
        const paragraph = document.createElement('p');
        paragraph.innerText = "Non ci sono elementi nel carrello";
        cartModal.appendChild(paragraph);
    }
};

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
