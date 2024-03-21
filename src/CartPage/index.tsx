import React, { useEffect, useRef, useState } from 'react';
import { Layout, Button, Typography } from 'antd';
import './CartPage.css';

const { Header, Content } = Layout;
const { Text } = Typography;

type CartState = {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
};


// Assuming CartItem structure matches the one you receive from the WebSocket
type CartItem = {
    name: string;
    upc: string;
    fact: string,
    matched_img: string;
    numUnits: number;
    perUnitCost: number;
};

const cartItemsMockData = [
    {
        upc: "1234567890",
        name: "Doritos Nacho Cheese",
        fact: "400g",
        perUnitCost: 3.99,
        numUnits: 1,
        matched_img: "https://testbucket1841.s3.ap-south-1.amazonaws.com/dump/dorito.png"
    },
    {
        upc: "028400329125",
        name: "Oreos",
        fact: "Party-Size",
        perUnitCost: 4.99,
        numUnits: 1,
        matched_img: "https://testbucket1841.s3.ap-south-1.amazonaws.com/dump/oreo.png"
    },
    {
        upc: "",
        name: "Peanut M&Ms",
        fact: "1.74oz",
        perUnitCost: 1.99,
        numUnits: 1,
        matched_img: "https://testbucket1841.s3.ap-south-1.amazonaws.com/dump/m&m.png"
    },
    {
        upc: "",
        name: "Lays - Hot and Sweet",
        fact: "500cal",
        perUnitCost: 5.99,
        numUnits: 1,
        matched_img: "https://purepng.com/public/uploads/thumbnail//purepng.com-lays-classic-potato-chips-packetfood-lays-potato-chips-941524637186i1maf.png"
    }

]

// Initialize with mock data for demonstration
const initialState: CartState = {
    items: cartItemsMockData,
    subtotal: 0,
    tax: 0,
    total: 0,
};

const calculateTotals = (items: CartItem[]): CartState => {
    const subtotal = items.reduce((acc, item) => acc + item.numUnits * item.perUnitCost, 0);
    const tax = subtotal * 0.1; // Assuming a 10% tax rate
    const total = subtotal + tax;
    return { items, subtotal, tax, total };
};

const CartPage: React.FC = () => {
    const [cartState, setCartState] = useState<CartState>(calculateTotals(initialState.items));
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [displayItems, setDisplayItems] = useState(false);

    const handleAddToCart = () => {
        // This function will be called when the "Add to Cart" button is clicked
        // Set displayItems to true and set cart items based on some condition or action, like a WebSocket message
        setCartState(calculateTotals(cartItemsMockData)); // Update this line as per your actual logic for adding items
        setDisplayItems(true); // This will allow the items to be displayed in the cart
    };

    useEffect(() => {
        // WebSocket for detected products
        const productStream = new WebSocket('ws://128.2.24.200:9001');
        productStream.onmessage = (event) => {
            const detectedItem: CartItem = JSON.parse(event.data);
            // Add the detected item to the cart (simplified logic)
            if (cartState.items.length < 3) {
                const newItems = [...cartState.items, detectedItem];
                setCartState(calculateTotals(newItems));
            }
        };

        // WebSocket for camera feed
        const videoStream = new WebSocket('ws://128.2.24.200:9000');
        videoStream.onmessage = async (event) => {
            const blob = new Blob([event.data], { type: "image/jpeg" });
            const image = new Image();
            image.src = URL.createObjectURL(blob);
            await image.decode(); // Wait for image to load

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    const image_ar = image.width / image.height;
                    canvas.width = canvas.clientWidth;
                    canvas.height = canvas.clientHeight;
                    const canvas_ar = canvas.width / canvas.height;

                    let draw_width = canvas.width;
                    let draw_height = canvas.height;
                    if (image_ar > canvas_ar) {
                        draw_height = draw_width / image_ar;
                    } else {
                        draw_width = draw_height * image_ar;
                    }

                    ctx.drawImage(image, 0, 0, draw_width, draw_height);
                    URL.revokeObjectURL(image.src); // Clean up
                }
            }
        };

        return () => {
            productStream.close();
            videoStream.close();
        };
    }, [cartState.items]);

    return (
        <div className="cart-page-container">
            <div className='cart-page-canvas'>
                <canvas
                    ref={canvasRef} style={{
                        position: 'relative', top: '5%', left: '5%',
                        width: '90%', height: '90%'
                    }}></canvas>

            </div>
            <Button type="primary" block onClick={handleAddToCart} style={{ margin: '10px 0', fontWeight: 'bold' }}>
                Add to Cart
            </Button>
            <div className='cart-page-details'>
                <div className='cart-page-cost'>
                    <div style={{ width: '100%' }}>

                        <h3 style={{ color: '##002F8E', margin: '0', marginBottom: '1.2rem' }}>CART</h3>
                        <div className='cart-items-list'>
                            {displayItems && cartState.items.map((item, index) => (
                                <div className='cart-item'>
                                    <div
                                        style={{ display: 'flex' }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                background: "#E8EFFA",
                                                padding: '0.5rem',
                                                marginRight: '0.5rem',
                                            }}
                                        >
                                            <img
                                                src={item.matched_img}
                                                alt="Product"
                                                style={{
                                                    width: '60px'
                                                }} />
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'flex-start',
                                                alignItems: 'flex-start'
                                            }}
                                        >
                                            <Text strong>{item.name} - {item.fact}</Text>
                                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                <Button
                                                    style={{
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: '#90A0B7',
                                                        color: 'white',
                                                        padding: '0.5rem'
                                                    }}
                                                    onClick={() => {
                                                        // Example function to handle decrementing item units
                                                        const updatedItems = cartState.items.map((cartItem) =>
                                                            cartItem.upc === item.upc ? { ...cartItem, numUnits: Math.max(cartItem.numUnits - 1, 0) } : cartItem
                                                        ).filter((cartItem) => cartItem.numUnits > 0);
                                                        setCartState(calculateTotals(updatedItems));
                                                    }}><svg xmlns="http://www.w3.org/2000/svg" width="11" height="3" viewBox="0 0 11 3" fill="none">
                                                        <path d="M9.81299 1.5H1.13007" stroke="white" stroke-width="2" stroke-linecap="round" />
                                                    </svg></Button>
                                                &nbsp;
                                                <Text>{item.numUnits}</Text>
                                                &nbsp;
                                                <Button
                                                    style={{
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: '#90A0B7',
                                                        color: 'white',
                                                        padding: '0.5rem'
                                                    }}
                                                    onClick={() => {
                                                        // Example function to handle incrementing item units
                                                        const updatedItems = cartState.items.map((cartItem) =>
                                                            cartItem.upc === item.upc ? { ...cartItem, numUnits: cartItem.numUnits + 1 } : cartItem
                                                        );
                                                        setCartState(calculateTotals(updatedItems));
                                                    }}><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                                        <path d="M9.95876 5.5377H1.17285" stroke="white" stroke-width="2" stroke-linecap="round" />
                                                        <path d="M5.56586 9.93939V1.1362" stroke="white" stroke-width="2" stroke-linecap="round" />
                                                    </svg></Button>

                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-end'
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="32" viewBox="0 0 31 32" fill="none">
                                            <path d="M23.249 23.7523L7.75367 8.25695" stroke="#4F4F4F" stroke-width="3" stroke-linecap="round" />
                                            <path d="M7.77145 23.7581L23.2642 8.26544" stroke="#4F4F4F" stroke-width="3" stroke-linecap="round" />
                                        </svg>
                                        <Text strong>${(item.numUnits * item.perUnitCost).toFixed(2)}</Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        justifySelf: 'flex-end',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1rem',
                    }}>
                        <p
                            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        ><span>Subtotal</span><span style={{ fontWeight: 'bold' }}>${cartState.subtotal.toFixed(2)} </span></p>
                        <p
                            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        ><span>Tax</span><span style={{ fontWeight: 'bold' }}>${cartState.tax.toFixed(2)} </span></p>
                        <div
                            style={{ width: '100%', height: '1px', background: '#E0E0E0' }}
                        ></div>
                        <p
                            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        ><span>Total</span><span style={{ fontWeight: 'bold' }}>${cartState.total.toFixed(2)} </span></p>
                    </div>
                </div>
                <Button type="primary" block style={{ width: '100%', fontWeight: 'bold' }}>Finish and Pay</Button>
            </div>
        </div>
    );
};

export default CartPage;
