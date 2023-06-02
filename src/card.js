import { initializeApp } from 'firebase/app';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAietoSc1PlakDz2o7qFAQx3dxxCTWDBng",
    authDomain: "delivery-app-f27e0.firebaseapp.com",
    projectId: "delivery-app-f27e0",
    storageBucket: "delivery-app-f27e0.appspot.com",
    messagingSenderId: "725180529509",
    appId: "1:725180529509:web:172101c50e00bc65a1ff8c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, 'orders');

const selectedProductJSON = localStorage.getItem('selectedProducts');
const selectedProducts = JSON.parse(selectedProductJSON);

const emptyCard = document.querySelector('.empty-block');
const productContainer = document.querySelector('.goods-card-section');
const total = document.getElementById('total');
const submitBtn = document.getElementById('submitBtn');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');
const userAddress = document.getElementById('userAddress');

const cart = {};

let totalAmount = 0;

const nameRegex = /^[a-zA-Z]{2,}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneRegex = /^\+?[0-9]+$/;
const addressRegex = /.{5,}/;

function validateInput(inputField, regex) {
    if (!regex.test(inputField.value) && inputField.value === "") {
        inputField.style.border = '1px solid red';
        inputField.style.background = '#ff7b7b63';
    } else {
        inputField.style.border = '2px solid green';
        inputField.style.background = '#fff';
    }
};

userName.addEventListener('change', () => {
    validateInput(userName, nameRegex);
});

userEmail.addEventListener('change', () => {
    validateInput(userEmail, emailRegex);
});

userPhone.addEventListener('change', () => {
    validateInput(userPhone, phoneRegex);
});

userAddress.addEventListener('change', () => {
    validateInput(userAddress, addressRegex);
});


if (selectedProducts && selectedProducts.length > 0) {
    emptyCard.style.display = 'none';
    renderCards();
};


function renderCards() {

    selectedProducts.forEach(item => {
        const key = JSON.stringify(item);
        cart[key] = (cart[key] || 0) + 1;

        totalAmount += item.price * cart[key];
    });

    const blocksToRemove = document.querySelectorAll('.goods-item-card');
    blocksToRemove.forEach(block => {
        block.parentNode.removeChild(block);
    });

    for (const key in cart) {
        const item = JSON.parse(key);
        const quantity = cart[key];

        const card = createShoppingCard(item, quantity);
        productContainer.appendChild(card);
    }

    total.textContent = totalAmount.toFixed(2);
}

function createShoppingCard(product, quantity) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('goods-item-card', 'card');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('goods-item_img', 'card');

    const image = document.createElement('img');
    image.src = product.imgUrl;
    image.alt = product.foodName;

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('goods-item-card-info');

    const title = document.createElement('h4');
    title.id = 'good-name';
    title.textContent = product.foodName;

    const price = document.createElement('p');
    price.innerHTML = `Price: $<span id="good-price">${product.price}</span>`;

    let countInput = document.createElement('input');
    countInput.type = 'number';
    countInput.id = 'good-count';
    countInput.value = quantity;

    countInput.addEventListener('input', updateTotal);

    imageContainer.appendChild(image);
    infoContainer.appendChild(title);
    infoContainer.appendChild(price);
    infoContainer.appendChild(countInput);
    cardContainer.appendChild(imageContainer);
    cardContainer.appendChild(infoContainer);

    return cardContainer;
};

function updateTotal(event) {
    const countInput = event.target;
    const cardContainer = countInput.parentNode.parentNode;
    const product = getProductFromCard(cardContainer);
    const newCount = parseInt(countInput.value);

    updateProductCount(product, newCount);

    if (newCount === 0) {
        removeProduct(product);
        cardContainer.remove();
    }

    totalAmount = 0;

    calculateTotal();
};

function getProductFromCard(cardContainer) {
    const titleElement = cardContainer.querySelector('#good-name');
    const priceElement = cardContainer.querySelector('#good-price');
    const imageElement = cardContainer.querySelector('img');

    const product = {
        foodName: titleElement.textContent,
        price: parseFloat(priceElement.textContent),
        imgUrl: imageElement.src
    };

    return product;
};

function updateProductCount(product, newCount) {
    const selectedProductJSON = localStorage.getItem('selectedProducts');
    const selectedProducts = JSON.parse(selectedProductJSON);

    const index = selectedProducts.findIndex(item => item.foodName === product.foodName);

    if (index !== -1) {
        selectedProducts[index].count = newCount;
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }
};


function removeProduct(product) {
    const selectedProductJSON = localStorage.getItem('selectedProducts');
    const selectedProducts = JSON.parse(selectedProductJSON);

    const index = selectedProducts.findIndex(item => item.foodName === product.foodName);

    if (index !== -1) {
        selectedProducts.splice(index, 1);
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }
};


function calculateTotal() {
    const cards = productContainer.querySelectorAll('.goods-item-card');

    cards.forEach(card => {
        const product = getProductFromCard(card);
        const countInput = card.querySelector('#good-count');
        const quantity = parseInt(countInput.value);

        totalAmount += product.price * quantity;
    });

    total.textContent = totalAmount.toFixed(2);
};

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (nameRegex.test(userName.value) && emailRegex.test(userEmail.value) && phoneRegex.test(userPhone.value) && addressRegex.test(userAddress.value)) {
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const phone = document.getElementById('userPhone').value;
        const address = document.getElementById('userAddress').value;

        const selectedProductJSON = localStorage.getItem('selectedProducts');
        const selectedProducts = JSON.parse(selectedProductJSON);

        const order = {
            name,
            email,
            phone,
            address,
            products: selectedProducts,
            total: totalAmount
        };

        addDoc(colRef, order)
            .then(() => {
                document.getElementById('userName').value = '';
                document.getElementById('userEmail').value = '';
                document.getElementById('userPhone').value = '';
                document.getElementById('userAddress').value = '';

                localStorage.removeItem('selectedProducts');

                console.log('Order submitted successfully!');
                const modal = document.querySelector('.modal-content');
                modal.style.display = 'block';

                setInterval(() => {
                    modal.style.display = 'none';
                }, 3000);

                total.textContent = 0;

                userName.style.border = '1px solid lightgray';
                userEmail.style.border = '1px solid lightgray';
                userPhone.style.border = '1px solid lightgray';
                userAddress.style.border = '1px solid lightgray';

                const blocksToRemove = document.querySelectorAll('.goods-item-card');

                blocksToRemove.forEach(block => {
                    block.parentNode.removeChild(block);
                });

                emptyCard.style.display = 'flex';
            })
            .catch(error => {
                console.error('Error submitting order:', error);
            });
    } else {
        validateInput(userName, nameRegex);
        validateInput(userEmail, emailRegex);
        validateInput(userPhone, phoneRegex);
        validateInput(userAddress, addressRegex);
    }
});