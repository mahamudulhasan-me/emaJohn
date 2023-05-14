import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import {
  addLocalStorage,
  clearLocalStorage,
  getProductFromDB,
} from "../Utilities/AddReturnFromDB";

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const { totalProducts } = useLoaderData();
  const productPerPage = 10;
  const totalPages = Math.ceil(totalProducts / productPerPage);
  const pageNumbers = [...Array(totalPages).keys()];

  const addToCart = (product) => {
    // const newCart = [...cart, product];
    // setCart(newCart);
    let newCart = [];
    const isExistProduct = cart.find((pd) => pd._id === product._id);
    if (isExistProduct) {
      isExistProduct.quantity = isExistProduct.quantity + 1;
      const restProduct = cart.filter((pd) => pd._id !== product._id);
      newCart = [...restProduct, isExistProduct];
    } else {
      product.quantity = 1;
      newCart = [...cart, product];
    }
    setCart(newCart);
    addLocalStorage(product._id);
  };

  useEffect(() => {
    fetch("http://localhost:4040/products")
      .then((response) => response.json())
      .then((products) => setProducts(products));
  }, []);

  useEffect(() => {
    const storedCart = getProductFromDB();
    const saveCart = [];
    for (const id in storedCart) {
      const addedProduct = products.find((pd) => pd._id == id);
      if (addedProduct) {
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        saveCart.push(addedProduct);
      }
    }
    setCart(saveCart);
  }, [products]);
  const clearCart = () => {
    setCart([]);
    clearLocalStorage();
  };
  return (
    <>
      <div className="grid grid-cols-12 pl-[5%] gap-8 relative">
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-5 mt-28">
            {products.map((product) => (
              <Product
                product={product}
                key={product?._id}
                addToCart={addToCart}
              ></Product>
            ))}
          </div>
        </div>

        <Cart clearCart={clearCart} cart={cart} />
      </div>
      <div className="text-center my-4">
        {pageNumbers.map((number, index) => (
          <button className="btn btn-outline ml-2" key={index}>
            {number}
          </button>
        ))}
      </div>
    </>
  );
};

export default ProductContainer;
