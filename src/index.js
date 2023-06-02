import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

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
const storage = getStorage();
const colRef = collection(db, 'goods');

async function getImageUrl(imagePath) {
    const imageRef = ref(storage, imagePath);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
};

getDocs(colRef)
    .then(async (snapshot) => {
        const productContainer = document.getElementById('goodsContainer');
        for (const doc of snapshot.docs) {
            const data = doc.data();
            try {
                const imageUrl = await getImageUrl(data.imgUrl);
                const productCard = { ...data, imgUrl: imageUrl };
                createProductCard(productCard, productContainer);
            } catch (error) {
                console.log("Error retrieving image URL:", error);
            }
        }
    })
    .catch((error) => {
        console.log("Error retrieving data from Firestore:", error);
    });

function createProductCard(productCard, container) {
    const card = document.createElement('li');
    card.classList.add('goods-item', 'card');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('goods-item_img', 'card');

    const image = document.createElement('img');
    image.src = productCard.imgUrl;
    image.alt = productCard.foodName;
    image.loading = 'lazy';

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('goods-list_title');

    const title = document.createElement('h4');
    title.textContent = productCard.foodName;

    const price = document.createElement('p');
    price.innerHTML = `Price: $<span>${productCard.price}</span>`;

    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('orange-btn');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.addEventListener('click', () => {
        const item = {
            imgUrl: productCard.imgUrl,
            foodName: productCard.foodName,
            price: productCard.price,
            count: 1
        };
        const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
        selectedProducts.push(item);
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));

        const modal = document.querySelector('.modal-content');
        modal.style.display = 'block';

        setInterval(() => {
            modal.style.display = 'none';
        }, 2000);
    });

    imageContainer.appendChild(image);
    titleContainer.appendChild(title);
    titleContainer.appendChild(price);
    card.appendChild(imageContainer);
    card.appendChild(titleContainer);
    card.appendChild(addToCartButton);

    container.appendChild(card);
};

const sidebarButtons = document.querySelectorAll('.sidebar-btn');
sidebarButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const shopName = button.textContent;
        filterProductsByShop(shopName);
    });
});

function filterProductsByShop(shopName) {
    const productContainer = document.getElementById('goodsContainer');
    productContainer.innerHTML = '';

    getDocs(colRef)
        .then(async (snapshot) => {
            for (const doc of snapshot.docs) {
                const data = doc.data();
                if (data.shop === shopName) {
                    try {
                        const imageUrl = await getImageUrl(data.imgUrl);
                        const productCard = { ...data, imgUrl: imageUrl };
                        createProductCard(productCard, productContainer);
                    } catch (error) {
                        console.log("Error retrieving image URL:", error);
                    }
                }
            }
        })
        .catch((error) => {
            console.log("Error retrieving data from Firestore:", error);
        });
};

