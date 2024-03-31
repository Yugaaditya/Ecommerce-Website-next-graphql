import React, { useContext } from "react";
import styles from "./orderCard.module.css";
import { DarkModeContext } from "../../context/DarkModeContext";

export default function OrderCard({ props }) {
    const theme = useContext(DarkModeContext);
    
    return (
        <div className={styles["order-container"]}> {/* Use CSS module class */}
            <img className={styles["order-product-image"]} src={props.image} alt={`${props.name} image`} />
            <h2>{props.name}</h2>
            <p className={styles["order-price"]}><b>Price: </b><i>${props.price}</i></p>
        </div>
    );
}