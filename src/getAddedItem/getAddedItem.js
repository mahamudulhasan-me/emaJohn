import { getProductFromDB } from "../components/Utilities/AddReturnFromDB";

const getAddedItems = async () => {
  const storedCart = getProductFromDB();
  console.log(storedCart);
  const ids = Object.keys(storedCart);
  console.log(ids);
  const loadProducts = await fetch(`http://localhost:4040/productByIds`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(ids),
  });
  const products = await loadProducts.json();

  let saveCart = [];
  for (let id in storedCart) {
    const findProduct = products.find((product) => product._id === id);
    if (findProduct) {
      const quantity = storedCart[id];
      products.quantity = quantity;
      saveCart.push(findProduct);
    }
  }
  return saveCart;
};

export { getAddedItems };
