export let cart = JSON.parse(localStorage.getItem('cart')) || [];
if (!cart.length) {
    cart = [
        {
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
        },
        {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1,
            delieveryOptionId: '2',
        },
        {
            productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
            quantity: 4,
            delieveryOptionId: '3',
        },
    ];
    saveLocal(); // Ensure this saves the initial cart state.
}


function saveLocal() {
    console.log("Saving to localStorage:", cart);
    localStorage.setItem('cart', JSON.stringify(cart));
}
export function add_to_cart(productId) {
    console.log("Adding product to cart:", productId);
    let matchingItem = cart.find(cartItem => cartItem.productId === productId);
    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            delieveryOptionId: '1',
        });
    }
    saveLocal();
}



export function remove_cart(productId){
    const newCart = [];
    cart.forEach((cartItem)=>{
        if(cartItem.productId != productId)
        {
            newCart.push(cartItem)
        }
        
         
    })
    cart = newCart;
    saveLocal();
}

export function updateDeliveryOption(productId, deleiveryOptionId) {
    let matchingItem;
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
           
})
matchingItem.deleiveryOptionId = deleiveryOptionId;
saveLocal();
    
}