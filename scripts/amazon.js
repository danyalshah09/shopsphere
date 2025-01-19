import { cart, add_to_cart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurreny } from "./utils/money.js";

let productsHTML = ``
products.forEach((products) => {
    productsHTML += `<div class="product-container">
            <div class="product-image-container">
                <img class="product-image"
                src=${products.image}>
            </div>

            <div class="product-name limit-text-to-2-lines">
            ${products.name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars"
                src="images/ratings/rating-${products.rating.stars * 10}.png">
                <div class="product-rating-count link-primary">
                ${products.rating.count}
                </div>
            </div>

            <div class="product-price">
              $${formatCurreny(products.priceCents)}
    
            </div>

            <div class="product-quantity-container">
                <select class = "selectQuantity ${products.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                </select>
            </div>

            <div class="product-spacer"></div>

            <div class="added-to-cart">
                <img src="images/icons/checkmark.png">
                Added
            </div>

            <button class="add-to-cart-button button-primary add_cart" data-product-id ="${products.id}">
                Add to Cart
            </button>
            </div>
    `;

})

document.querySelector('.p_grid').innerHTML = productsHTML;
function update_cart_quantity() {
    const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    console.log("Cart quantity updated:", cartQuantity);
    document.querySelector('.cart-quantity').innerHTML = cartQuantity;
}

document.querySelectorAll('.add_cart').forEach((button) => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        console.log("Button clicked for product:", productId);
        add_to_cart(productId);
        update_cart_quantity();
    });
});


const slides = document.querySelectorAll('.slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let currentIndex = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
}

next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

// Auto-slide every 5 seconds
setInterval(nextSlide, 5000);
