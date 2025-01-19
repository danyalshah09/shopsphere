import { cart } from "../data/cart.js";
import { products } from '../data/products.js';
import { formatCurreny } from "./utils/money.js";
import { deliveryOptions } from "../data/delievryOptions.js";

// Function to calculate totals
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

// Function to generate payment-summary HTML
export function generatePaymentSummaryHTML() {
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
    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;
}

// Function to render the payment summary in the DOM
export function renderPaymentSummary() {
  document.querySelector('.payment-summary').innerHTML = generatePaymentSummaryHTML();

  // Re-render payment summary if delivery option is changed
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;

      // Update the delivery option in the cart
      updateDeliveryOptions(productId, deliveryOptionId);

      // Recalculate and update the payment summary
      document.querySelector('.payment-summary').innerHTML = generatePaymentSummaryHTML();
    });
  });
}
