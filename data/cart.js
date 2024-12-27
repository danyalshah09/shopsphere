export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [
        {
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
            deliveryOptionId: '1',
        },
        {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1,
            deliveryOptionId: '2',
        },
        {
            productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
            quantity: 4,
            deliveryOptionId: '3',
        },
    ];
    saveLocal();
}

function saveLocal() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function add_to_cart(productId) {
    let matchingItem = cart.find(item => item.productId === productId);

    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cart.push({
            productId,
            quantity: 1,
            deliveryOptionId: '1',
        });
    }
    saveLocal();
}

export function updateDeliveryOptions(productId, deliveryOptionId) {
    const matchingItem = cart.find(item => item.productId === productId);

    if (matchingItem) {
        matchingItem.deliveryOptionId = deliveryOptionId;
    }
    saveLocal();
}

export function remove_cart(productId) {
    cart = cart.filter(cartItem => cartItem.productId !== productId);
    saveLocal();
}
