import React, { useEffect } from "react";
import Order from "@/components/Order/Order";
import { useRouter } from "next/router";

export default function Orders(props){
    const router=useRouter();
    useEffect(()=>{
        let token=localStorage.getItem("token")
        if (!token){
            router.push('/login')
        }
    })
    return <Order {...props}/>;
}