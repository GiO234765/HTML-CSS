let cartCount = 0;
const countElement = document.getElementById("cart-count");
const addButton = document.querySelector(".add-to-cart");
const doubleButton = document.querySelector(".double-add");
function updateUI() {
    countElement.textContent = cartCount;
}
function addToCart() {
    cartCount += 1;
    updateUI();
}
function doubleAdd() {
    cartCount += 2;
    updateUI();
}
addButton.addEventListener("click", addToCart);
doubleButton.addEventListener("click", doubleAdd);

const a = prompt("Enter a value:");
alert(a);
console.log(a);