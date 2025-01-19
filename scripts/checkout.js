import { cart, remove_cart, updateDeliveryOptions } from "../data/cart.js";
import { products } from '../data/products.js';
import { formatCurreny } from "./utils/money.js";
import { deliveryOptions } from "../data/delievryOptions.js";

// Function to calculate totals for payment summary
function calculateTotals() {
  let itemsTotal = 0;
  let shippingTotal = 0;

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct = products.find(product => product.id === productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);

    // Calculate item total (price * quantity)
    itemsTotal += matchingProduct.priceCents * cartItem.quantity;

    // Add shipping cost based on selected delivery option
    shippingTotal += deliveryOption.priceCents * cartItem.quantity;
  });

  // Calculate tax (10%)
  const tax = (itemsTotal + shippingTotal) * 0.10;

  // Calculate the order total
  const orderTotal = itemsTotal + shippingTotal + tax;

  return {
    itemsTotal: formatCurreny(itemsTotal),
    shippingTotal: formatCurreny(shippingTotal),
    subtotal: formatCurreny(itemsTotal + shippingTotal),
    tax: formatCurreny(tax),
    orderTotal: formatCurreny(orderTotal)
  };
}

// Function to generate order summary HTML
function generateOrderSummaryHTML() {
  let cartSummaryHTML = ``;

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
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              <span class="update-quantity-link link-primary">Update</span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHtml(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  return cartSummaryHTML;
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

// Function to generate payment summary HTML
function generatePaymentSummaryHTML() {
  const totals = calculateTotals();

  return `
    <div class="payment-summary-title">Order Summary</div>
    <div class="payment-summary-row">
      <div>Items (3):</div>
      <div class="payment-summary-money">${totals.itemsTotal}</div>
    </div>
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">${totals.shippingTotal}</div>
    </div>
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">${totals.subtotal}</div>
    </div>
    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">${totals.tax}</div>
    </div>
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">${totals.orderTotal}</div>
    </div>
    <button class="place-order-button button-primary">Place your order</button>
  `;
}

// Render both order summary and payment summary when the page loads
document.querySelector('.js-order-summary').innerHTML = generateOrderSummaryHTML();
document.querySelector('.payment-summary').innerHTML = generatePaymentSummaryHTML();

// Re-render payment summary if delivery option is changed
document.querySelectorAll('.js-delivery-option').forEach((element) => {
  element.addEventListener('click', () => {
    const { productId, deliveryOptionId } = element.dataset;

    // Update the delivery option in the cart
    updateDeliveryOptions(productId, deliveryOptionId);

    // Recalculate and update the payment summary
    document.querySelector('.payment-summary').innerHTML = generatePaymentSummaryHTML();

    // Update the delivery date in the UI
    const selectedOption = deliveryOptions.find(option => option.id === deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(selectedOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM DD');
    
    const deliveryDateElement = document.querySelector(`.js-cart-item-container-${productId} .delivery-date`);
    deliveryDateElement.textContent = `Delivery Date: ${dateString}`;
  });
});

// Remove product from cart on delete
document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    remove_cart(productId);
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
    
    // Recalculate and update the payment summary after removal
    document.querySelector('.payment-summary').innerHTML = generatePaymentSummaryHTML();
  });
});


// import { renderOrderSummary } from "./checkout/orderSummary.js";
// import { renderPaymentSummary } from "./checkout/paymentSummary.js";

// // Call the functions to render order and payment summaries
// renderOrderSummary();
// renderPaymentSummary();
