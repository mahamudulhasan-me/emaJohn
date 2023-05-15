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
  const [currentPage, setCurrentPage] = useState(0);
  const [productPerPage, setProductPerPage] = useState(9);

  const { totalProducts } = useLoaderData();

  const totalPages = Math.ceil(totalProducts / productPerPage);
  const pageNumbers = [...Array(totalPages).keys()];

  const options = [6, 12, 24];
  const handleSelectChange = (e) => {
    setProductPerPage(parseInt(e.target.value));
    setCurrentPage(0);
  };
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

  // useEffect(() => {
  //   fetch(
  //     `http://localhost:4040/products?page=${currentPage}&limit=${productPerPage}`
  //   )
  //     .then((response) => response.json())
  //     .then((products) => setProducts(products));
  // }, [currentPage, productPerPage]);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `http://localhost:4040/products?page=${currentPage}&limit=${productPerPage}`
      );
      const data = await response.json();
      setProducts(data);
    };
    fetchProduct();
  }, [currentPage, productPerPage]);

  useEffect(() => {
    const storedCart = getProductFromDB();
    const ids = Object.keys(storedCart);

    fetch(`http://localhost:4040/productByIds`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(ids),
    })
      .then((response) => response.json())
      .then((cartProducts) => {
        const saveCart = [];
        for (const id in storedCart) {
          const addedProduct = cartProducts.find((pd) => pd._id == id);
          if (addedProduct) {
            const quantity = storedCart[id];
            addedProduct.quantity = quantity;
            saveCart.push(addedProduct);
          }
        }
        setCart(saveCart);
      });
  }, []);
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
        <p>
          current Page: {currentPage} Product Per Page: {productPerPage}
        </p>
        {pageNumbers.map((number) => (
          <button
            onClick={() => setCurrentPage(number)}
            className={`btn ml-2 ${
              currentPage === number ? "btn-warning" : "btn-outline"
            }  `}
            key={number}
          >
            {number}
          </button>
        ))}
        <select
          name=""
          id=""
          onChange={handleSelectChange}
          className="select select-warning ml-5"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default ProductContainer;
