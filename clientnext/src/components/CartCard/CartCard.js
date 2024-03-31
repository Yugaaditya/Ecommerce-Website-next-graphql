import React, { useContext, useEffect } from "react";
import { FaTrash } from 'react-icons/fa';
import styles from './cartCard.module.css'; 
import { useRouter } from 'next/router';
import { DarkModeContext } from "../../context/DarkModeContext";
import client from '../../apollo'
import {REMOVE_FROM_CART} from "@/graphql/queries";

export default function CartCard({ props, productItems, setProductItems }) {
  const theme = useContext(DarkModeContext);
  let token = "";
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  const router = useRouter();

  useEffect(()=>{
    token=localStorage.getItem('token');
  },[])
  async function removeFromCart() {
    try {
      const { data } = await client.mutate({
        mutation: REMOVE_FROM_CART,
        variables:{productId:props._id},
        context: {
            headers: {
                authorization: token,
            },
        }
      });
      const response=data.removeItemFromCart
      setProductItems(
        productItems.filter(product => product._id !== props._id)
      )
      if (response.status === 200) {
        alert(response.message);
      }
      else if (response.status === 404) {
        alert(response.message);
      }
      else if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        alert("Invalid token");
        router.push("/login");
      }
    }
    catch (error) {
      console.log('Error:', error);
    }
  }

  return (
    <div className={styles["cart-container"]}> {/* Use CSS module class */}
      <img className={styles["cart-product-image"]} src={props.image} alt={`${props.name} image`} />
      <div className={styles["cart-item-details"]}>
        <h2>{props.name}</h2>
        <p>Category: <i>{props.category}</i></p>
        <p>Price: <i>${props.price}</i></p>
      </div>
      <p className={styles["remove-from-cart"]} onClick={removeFromCart}><FaTrash /></p>
    </div>
  )
}
