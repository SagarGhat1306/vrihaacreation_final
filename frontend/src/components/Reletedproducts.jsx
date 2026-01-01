import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Reletedproducts = ({ subcatagory, catagory }) => {
  const { products } = useContext(ShopContext);

  const [releted, setReleted] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

        if (catagory) {
        productsCopy = productsCopy.filter(
            (item) => item.category == catagory
        );
        }

        if (subcatagory) {
        productsCopy = productsCopy.filter(
            (item) => item.subCategory == subcatagory
        );
        }


      setReleted(productsCopy.slice(0, 5)); // save first 5 items
    }
  }, [products, catagory, subcatagory]);

  return (
    <div className="my-24">
        <div className="text-center py-2 text-3xl">
            <Title text1={'RELETED'} text2={'PRODUCTS'}/>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 ms:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
             {releted.map((item ,index) => (
            <ProductItem key = {index} id = {item._id} image={item.image} name = {item.name} price= {item.price} />

      ))}
        </div>
    </div>
  );
};

export default Reletedproducts;
