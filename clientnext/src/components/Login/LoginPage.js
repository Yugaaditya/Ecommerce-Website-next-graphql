import React, { useContext, useState } from "react";
import styles from './LoginPage.module.css';
import { useRouter } from 'next/router';
import { DarkModeContext } from "../../context/DarkModeContext";
import Image from "next/image";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@/graphql/queries";

export default function LoginPage({ setLoginStatus }) {
    const theme = useContext(DarkModeContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [loginMutation] = useMutation(LOGIN);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginMutation({
                variables: { email, password },
            });
            // const response = await fetch('https://ecommerce-website-next-js-theta.vercel.app/auth/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ email, password }),
            // });
            const {status,message,token} = data.login
            if (status == 200) {
                
                localStorage.setItem('token', token);
                alert(message);
                router.push("/home");
                setLoginStatus("Logout");
            } else if (status == 401) {
                alert(message);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    let mainColour, cardColour;
    if (theme === "Light") {
        mainColour = { backgroundColor: "black", color: "white" };
        cardColour = { backgroundColor: "rgba(48, 45, 48, 0.938)", boxShadow: "0px 0px 4px 4px rgba(192, 192, 192, 0.3)" };
    }

    return (
        <div className={styles["login-container"]} style={mainColour}>
            <div className={styles["login-form"]} style={cardColour}>
                <img className={styles["login-form-image"]} src="/Logo.png" />
                <div className={styles["login-text"]}>
                    <h3>Enter your login details</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className={styles["input-email"]}
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    <input
                        type="password"
                        className={styles["input-password"]}
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <button type="submit" className={styles["submit-button"]}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
