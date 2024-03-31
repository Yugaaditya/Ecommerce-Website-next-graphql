import React, { useContext } from "react";
import OrderCard from "../OrderCard/OrderCard";
import styles from "./orderNumber.module.css";
import { DarkModeContext } from "../../context/DarkModeContext";

export default function OrderNumber({ products, totalAmount, id }) {
    const theme = useContext(DarkModeContext);
    
    return (
        <div>
            <div className={styles["order-number"]}> {/* Use CSS module class */}
                <h2 className={styles["order-number-id"]}>{`Order - ${id}`}</h2>
            </div>
            <div className={styles["order-number-container"]}> {/* Use CSS module class */}
                {products.map((product, index) => (
                    <OrderCard
                        key={index}
                        props={product}
                    />
                ))}
                <div className={styles["total-amount-container"]}> {/* Use CSS module class */}
                    <h3 className={styles["total-amount"]}>Total Amount</h3>
                    <h3 className={styles["total-amount-sum"]}>${totalAmount}</h3>
                </div>
            </div>
        </div>
    );
}
