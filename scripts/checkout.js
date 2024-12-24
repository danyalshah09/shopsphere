import { cart, remove_cart } from "../data/cart.js";
import { products } from '../data/products.js';
import { formatCurreny } from "./utils/money.js";
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.10.4/dayjs.min.js';
import { delieveryOptions } from "../data/delievryOptions.js";


let cartSummaryHTML = ``;

cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  let matchingProduct;


  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product
    }
  });

  cartSummaryHTML +=
    `
<div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
           ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurreny(matchingProduct.priceCents)}
        
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
           <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
  Delete
</span>

          </div>
        </div>

        <div sclass="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
            ${delieveryOptionsHtml(matchingProduct)}
          </div>
        </div>
      </div>
    </div>

`
});


function delieveryOptionsHtml(matchingProduct) {
  let html = '';
  delieveryOptions.forEach((deleiveryOption)=>{
    const today = dayjs();
    const delieveryDate = today.add(deleiveryOption.delieveryDays, 'days');    const dateString = delieveryDate.format(
      'dddd, MMMM DD'
    );
    const priceString = deleiveryOption.priceCents === 0 ? 'Free': `$${formatCurreny(deleiveryOption.priceCents)}`;
    html += `
           <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} - Shipping
              </div>
            </div>
          </div>`
  })
return html;
}
// console.log(cartSummaryHTML)
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;


document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId
    remove_cart(productId);
    const container = document.querySelector(`.js-cart-item-container-${productId}`)
    container.remove()
  })

})