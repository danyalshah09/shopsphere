import { cart, remove_cart, updateDeliveryOptions } from "../data/cart.js";
import { products } from '../data/products.js';
import { formatCurreny } from "./utils/money.js";
import { deliveryOptions } from "../data/delievryOptions.js";
import dayjs from 'dayjs';

// Function to generate order summary HTML
export function generateOrderSummaryHTML() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct = products.find(product => product.id === productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM DD');

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${productId}">
        <div class="delivery-date">
          Delivery Date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurreny(matchingProduct.priceCents)}</div>
            <div class="product-quantity">
              <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
              <span class="update-quantity-link link-primary">Update</span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
              ${deliveryOptionsHtml(matchingProduct, cartItem)}
            </div>
          </div>
        </div>
      </div>
    `;
  });

  return cartSummaryHTML;
}

// Function to render order summary in the DOM
export function renderOrderSummary() {
  document.querySelector('.js-order-summary').innerHTML = generateOrderSummaryHTML();

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      remove_cart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;

      // Update the delivery option in the cart
      updateDeliveryOptions(productId, deliveryOptionId);

      // Update the delivery date in the UI
      const selectedOption = deliveryOptions.find(option => option.id === deliveryOptionId);
      const today = dayjs();
      const deliveryDate = today.add(selectedOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM DD');

      const deliveryDateElement = document.querySelector(`.js-cart-item-container-${productId} .delivery-date`);
      deliveryDateElement.textContent = `Delivery Date: ${dateString}`;
    });
  });
}

// Function to generate delivery options HTML
function deliveryOptionsHtml(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM DD');
    const priceString = deliveryOption.priceCents === 0 ? 'Free' : `$${formatCurreny(deliveryOption.priceCents)}`;
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} - Shipping</div>
        </div>
      </div>
    `;
  });

  return html;
}
