import React, { useState, useEffect, useContext } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from "./Products.module.css"
import { useRouter } from 'next/router';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS } from '../../graphql/queries';
import client from '../../apollo'
import { GET_CART} from "@/graphql/queries";

const ProductsPage = ({ sortType, rating, category, search }) => {
    console.log(sortType)
    const theme = useContext(DarkModeContext);
    const router = useRouter();
    let token = "";
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }
    const [productItems, setProductItems] = useState(null);
    const [cartData, setCartData] = useState([]);
    const { loading, error, data, refetch  } = useQuery(GET_ALL_PRODUCTS, {
        variables: { sortOption: sortType, ratingOption: rating, categoryOption: category, searchWord: search },
      });
    useEffect(() => {
        token = localStorage.getItem('token');
        const fetchData = async () => {
            const { data } = await refetch({
                sortOption: sortType,
                ratingOption: rating,
                categoryOption: category,
                searchWord: search,
              });
            if (data) {
              setProductItems(data.Products);
            }
          };
      
        const fetchCartData = async () => {
            if (token) {
                try {
                    const { data } = await client.query({
                        query: GET_CART,
                        context: {
                            headers: {
                                authorization: token,
                            },
                        }
                      });
                    const response=data.Cart
                    if (response[0].status === 201) {
                        setCartData(response.map((product) => product._id))
                    }
                    else if (localStorage.getItem('token')) {
                        localStorage.removeItem('token');
                        router.push("/home")
                    }
                }
                catch (error) {
                    console.log('Error:', error);
                }
            }
        };

        const fetchDataAndCartData = async () => {
            await fetchCartData();
            await fetchData();
        };

        fetchDataAndCartData();
    }, [sortType, rating, category, search])
    

    const handleClick = (id) => {
        router.push(`/product/${id}`)
    }

    let mainColour, cardColour;
    if (theme === "Light") {
        mainColour = { backgroundColor: "black", color: "white", height: "100vh", overflow: "auto" }
        cardColour = { backgroundColor: " rgba(48, 45, 48, 0.938)", boxShadow: "0px 0px 4px 4px rgba(192, 192, 192, 0.3)" }
    }

    return (
        <div style={mainColour}>
            {(productItems) ?
                (
                    <div className={styles["products-page"]} >
                        {productItems.map((product, index) => (
                            <ProductCard
                                onClick={() => handleClick(product._id)}
                                key={index}
                                item={product}
                                cartData={cartData}
                            />
                        ))}
                    </div>
                ) :
                <div className={styles["products-fetch"]} style={mainColour}>
                    Fetching Products...
                </div>
            }
        </div>
    );
};

export default ProductsPage;
