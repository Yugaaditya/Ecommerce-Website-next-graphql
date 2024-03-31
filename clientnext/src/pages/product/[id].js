import React from "react";
import ProductItem from "@/components/ProductItem/productItem";
import client from '../../apollo'
import { GET_PRODUCT_IDS,GET_PRODUCT_ITEMS } from "@/graphql/queries";

export default function Item(props){
    return <ProductItem {...props}/>;
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: GET_PRODUCT_IDS,
  });
    //const res = await fetch('https://ecommerce-website-next-js-theta.vercel.app/api/product/ids')
    const posts = data.ProductIds
    const paths = posts.map((id) => ({
      params: { id },
    }))
   
    return { paths, fallback: false }
  }

  export async function getStaticProps({ params }) {
    let post="";
    try{
      const { data } = await client.query({
        query: GET_PRODUCT_ITEMS,
        variables: {id:params.id}
      });
      // console.log(data)
    //const res = await fetch(`https://ecommerce-website-next-js-theta.vercel.app/api/product/${params.id}`)
    post=data.Product
    // if (res.ok) {
    //     post = await res.json()
    //   } else if (response.status === 404) {
    //     const errorData = await res.json();
    //     alert(errorData.error);
    //   }
    }
    catch(error){
        console.log('Error:', error);
    }
    return { props: { post } }
  }