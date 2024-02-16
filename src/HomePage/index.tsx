import { Button } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100%",
                backgroundColor: "#fff",
                color: "#000",
            }}
        >
            <img src="https://testbucket1841.s3.ap-south-1.amazonaws.com/dump/entropy-logo.png" alt="Entropy Logo" />
            <h1>Welcome to Entropy</h1>
            <h3>Place an item on shelf to get started</h3>
            <Button
                onClick={() => {
                    navigate("/cart");
                }}
            >
                Checkout
            </Button>

        </div>
    )
}

export default HomePage
