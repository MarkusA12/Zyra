// Add a game item to the cart
function addToCart(item) {
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    if (!userData) {
        alert("Please log in to add items to your cart.");
        return;
    }

    const userIndex = userData.index;
    const cartKey = `cartItems_${userIndex}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

    cartItems.push(item);
    localStorage.setItem(cartKey, JSON.stringify(cartItems));

    updateCartCount();
    alert(`${item.name} added to cart!`);
}

// Load and display cart items on the checkout page
function loadCartItems() {
    const cartItemsContainer = document.getElementById("checkoutItemsContainer");
    const cartTotalEl = document.getElementById("checkoutTotal");
    const checkoutButton = document.getElementById("checkoutButton");

    const userData = JSON.parse(localStorage.getItem("currentUser"));
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!userData || !isLoggedIn) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = "<p>Please log in to view your cart.</p>";
        if (cartTotalEl) cartTotalEl.textContent = "Total: $0.00";
        if (checkoutButton) checkoutButton.disabled = true;
        return;
    }

    const userIndex = userData.index;
    const cartKey = `cartItems_${userIndex}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (cartItemsContainer) cartItemsContainer.innerHTML = "";

    let total = 0;
    if (cartItems.length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = "<p>No items in cart.</p>";
        if (checkoutButton) checkoutButton.disabled = true;
    } else {
        cartItems.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "w3-panel w3-card-4 w3-margin-bottom";
            itemDiv.innerHTML = `
                <h4>${item.name}</h4>
                <p>Price: $${item.price.toFixed(2)}</p>
                <button class="w3-button w3-red" onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(itemDiv);
            total += item.price;
        });

        if (checkoutButton) checkoutButton.disabled = false;
    }

    if (cartTotalEl) cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
    updateCartCount();
}

// Remove an item from the cart
function removeFromCart(index) {
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    if (!userData) return;

    const userIndex = userData.index;
    const cartKey = `cartItems_${userIndex}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

    cartItems.splice(index, 1);
    localStorage.setItem(cartKey, JSON.stringify(cartItems));

    loadCartItems(); // refresh UI
}

// Update the cart count in the nav bar
function updateCartCount() {
    const cartCountEl = document.getElementById("cartCount");
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    if (!userData || !cartCountEl) {
        if (cartCountEl) cartCountEl.textContent = "0";
        return;
    }

    const userIndex = userData.index;
    const cartKey = `cartItems_${userIndex}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

    cartCountEl.textContent = cartItems.length;
}

// Handle checkout (placeholder)
function checkout() {
    alert("Proceeding to checkout...");
    // Implement actual logic here
}

// Init on DOM load
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("checkoutItemsContainer")) {
        loadCartItems();
        const checkoutBtn = document.getElementById("checkoutButton");
        if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
    }

    updateCartCount();
});
