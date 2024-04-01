import React, { useEffect, useRef, useState } from 'react';
import { Layout, Button, Typography } from 'antd';
import './CartPage.css';
import Navbar from '../Navbar';
import { CartItem, useCart } from '../CartContex';

const { Text } = Typography;

const CartPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { cartState, addToCart, calculateTotals } = useCart();
    const [stagedItems, setStagedItems] = useState<CartItem[]>([]);

    useEffect(() => {
        // Example WebSocket connection for detected products
        const productStream = new WebSocket(process.env.REACT_APP_PRODUCTS_STREAM!);

        productStream.onmessage = async (event) => {
            const prodMessages: CartItem[] = JSON.parse(event.data);
            await prodMessages.forEach((prodMessage) => {
                if (prodMessage.upc) {
                    setStagedItems((currentStagedItems) => {
                        const itemExistsIndex = currentStagedItems.findIndex((item) => item.upc === prodMessage.upc);
                        if (itemExistsIndex > -1) {
                            // If item already exists in staged items, update the numUnits count
                            const updatedItems = [...currentStagedItems];
                            updatedItems[itemExistsIndex].numUnits += 1;
                            return updatedItems;
                        } else {
                            // Add new item to staged items
                            return [...currentStagedItems, { ...prodMessage, numUnits: 1, perUnitCost: Math.floor(Math.random() * 10) }];
                        }
                    });
                }
            });
        };


        // WebSocket for camera feed
        const videoStream = new WebSocket(process.env.REACT_APP_VIDEO_STREAM!);
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

    });

    const handleAddToCart = () => {
        stagedItems.forEach((item) => {
            addToCart(item);
        });
        // Clear staged items after adding to cart
        setStagedItems([]);
    };

    return (
        <>
            <Navbar />
            <div className="cart-page-container">
                <div className='cart-page-canvas'>
                    <canvas
                        ref={canvasRef} style={{
                            position: 'relative', top: '5%', left: '5%',
                            width: '90%', height: '90%'
                        }}></canvas>
                    {cartState.items.length > 0 && <Text>Items scanned</Text>}

                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'stretch',
                    width: '100%',
                    gap: '1rem',
                }}>
                    <Button type="primary" block onClick={handleAddToCart} style={{
                        margin:
                            '10px 0',
                        height: '5rem',
                        fontWeight: 'bold'
                    }}>
                        Add to Cart
                    </Button>
                    <Button type="primary" block onClick={() => {
                        // Clear cart function
                        calculateTotals([]);
                    }} style={{
                        margin:
                            '10px 0',
                        height: '5rem',
                        fontWeight: 'bold'
                    }}>
                        Clear Cart
                    </Button>
                </div>
                <div className='cart-page-details' style={{
                    height: '80vh'
                }}>
                    <div className='cart-page-cost'>
                        <div style={{ width: '100%' }}>

                            <h3 style={{ color: '##002F8E', margin: '0', marginBottom: '1.2rem' }}>CART</h3>
                            <div className='cart-items-list'>
                                {cartState.items.length > 0 && cartState.items.map((item, index) => (
                                    <div key={index} className='cart-item'>
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
                                                        width: '85px'
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
                                                <Text strong style={{ fontSize: '1.5rem' }}>{item.upc}
                                                    {/* - {item.fact} */}
                                                </Text>
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
                                                            (calculateTotals(updatedItems));
                                                        }}><svg xmlns="http://www.w3.org/2000/svg" width="11" height="3" viewBox="0 0 11 3" fill="none">
                                                            <path d="M9.81299 1.5H1.13007" stroke="white" stroke-width="2" stroke-linecap="round" />
                                                        </svg></Button>
                                                    &nbsp; &nbsp;
                                                    <Text style={{ fontSize: '2rem' }}>{item.numUnits}</Text>
                                                    &nbsp; &nbsp;
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
                                                            (calculateTotals(updatedItems));
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
                                            <div
                                                onClick={() => {
                                                    // Flow to remove the current detected item from the cart list
                                                    const updatedItems = cartState.items.filter((cartItem) => cartItem.upc !== item.upc);
                                                    (calculateTotals(updatedItems));

                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="64" viewBox="0 0 31 64" fill="none">
                                                    <path d="M23.249 23.7523L7.75367 8.25695" stroke="#4F4F4F" stroke-width="3" stroke-linecap="round" />
                                                    <path d="M7.77145 23.7581L23.2642 8.26544" stroke="#4F4F4F" stroke-width="3" stroke-linecap="round" />
                                                </svg>
                                            </div>
                                            <Text style={{ fontSize: '1.5rem' }} strong>${(item.numUnits * item.perUnitCost).toFixed(2)}</Text>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {cartState.items.length > 0 && <div style={{
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
                        </div>}
                    </div>
                    {/* <Button type="primary" block style={{ width: '100%', fontWeight: 'bold', height: '3rem' }}>Finish and Pay</Button> */}
                </div>
            </div>
        </>
    );
};

export default CartPage;
