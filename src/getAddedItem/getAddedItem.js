import { getProductFromDB } from "../components/Utilities/AddReturnFromDB";

const getAddedItems = async () => {
  const loadProducts = await fetch(`http://localhost:4040/products`);
  const products = await loadProducts.json();

  const storedCart = getProductFromDB();
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
