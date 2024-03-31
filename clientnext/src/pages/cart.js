import React, { useEffect } from "react";
import Cart from "@/components/Cart/Cart";
import { useRouter } from "next/router";

export default function Cartpage(props){
    const router=useRouter();
    useEffect(()=>{
        let token=localStorage.getItem("token")
        if (!token){
            router.push('/login')
        }
    })
    return <Cart {...props}/>;
}