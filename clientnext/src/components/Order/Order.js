import React, { useContext, useEffect, useState } from "react";
import styles from "./order.module.css";
import OrderNumber from "../OrderNumber/OrderNumber";
import { useRouter } from 'next/router';
import { DarkModeContext } from "../../context/DarkModeContext";
import client from '../../apollo'
import { GET_ORDERS} from "@/graphql/queries";

export default function Order() {
    const theme = useContext(DarkModeContext);
    const router = useRouter();
    let token = "";
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }
    const [productItems, setProductItems] = useState([]);

    useEffect(() => {
        token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const { data } = await client.query({
                    query: GET_ORDERS,
                    context: {
                        headers: {
                            authorization: token,
                        },
                    }
                  });   
                const response=data.Order
                // const response = await fetch(`https://ecommerce-website-next-js-theta.vercel.app/api/orders`, {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': token
                //     }
                // });
                if (response[0].status===201) {
                    setProductItems(response);
                } else if (localStorage.getItem('token')) {
                    localStorage.removeItem('token');
                    alert("Invalid token");
                    router.push("/login");
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchData();
    }, []);

    let mainColour;
    if (theme === "Light") {
        mainColour = { backgroundColor: "black", color: "white", height: "100vh", overflow: "auto" };
    }

    return (
        <div style={mainColour}>
            {(productItems.length !== 0) ? (
                <div className={styles["order-page"]} style={mainColour}>
                    {productItems.map((product, index) => (
                        <OrderNumber
                            key={index}
                            products={product.products}
                            totalAmount={product.totalAmount}
                            id={index + 1}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles["order-items"]}>No Orders</div>
            )}
        </div>
    );
}
