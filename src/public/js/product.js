const addButton = document.getElementById("addToCart");
const decreaseButton = document.getElementById("decreaseButton");
const increaseButton = document.getElementById("increaseButton");
const counterElement = document.getElementById("counter");

let quantity = 1;

addButton.addEventListener("click", () => {
  addProductToCart(product._id, quantity);
  console.log("Adding to cart:", product.title);
  quantity = 1;
  const counterElement = document.getElementById(`counter`);
  counterElement.innerText = quantity;
});
decreaseButton.addEventListener("click", () => {
    console.log("asd")
  if (quantity > 1) {
    quantity--;
    const counterElement = document.getElementById(`counter`);
    counterElement.innerText = quantity;
  }
  console.log("Decreasing quantity for:", product.title);
});
increaseButton.addEventListener("click", () => {
  quantity++;
  const counterElement = document.getElementById(`counter`);
  counterElement.innerText = quantity;
});

function addProductToCart(prodId, quantity) {
    var url = `http://localhost:8080/api/cart/${user.cart}/product/${prodId}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({quantity: quantity}),
    })
      .then((response) => {
        if (!response.ok) {
          // Add a snackbar of product added!
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  
