// App.tsx
import React, { useReducer, useEffect, useState } from 'react';
import { Layout, List, Button, Row, Col, Card, Typography } from 'antd';
import './CartPage.css';

const { Header, Content } = Layout;
const { Text } = Typography;

// Types for our cart items and cart state
type CartItem = {
    name: string;
    weight?: string;
    numUnits: number;
    perUnitCost: number;
    imgSrc: string;
};

type CartState = {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
};

// Action types for our reducer
type CartAction =
    | { type: 'ADD_ITEM'; item: CartItem }
    | { type: 'REMOVE_ITEM'; name: string }
    | { type: 'UPDATE_ITEM_UNITS'; name: string; numUnits: number }
    | { type: 'SET_ITEMS'; items: CartItem[] };

// Reducer function to handle cart actions
const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM':
            const itemIndex = state.items.findIndex(item => item.name === action.item.name);
            if (itemIndex >= 0) {
                const updatedItems = state.items.map((item, index) =>
                    index === itemIndex ? { ...item, numUnits: item.numUnits + 1 } : item
                );
                return calculateTotals({ ...state, items: updatedItems });
            }
            return calculateTotals({ ...state, items: [...state.items, action.item] });
        case 'REMOVE_ITEM':
            return calculateTotals({ ...state, items: state.items.filter(item => item.name !== action.name) });
        case 'UPDATE_ITEM_UNITS':
            const itemsUpdated = state.items.map(item =>
                item.name === action.name ? { ...item, numUnits: action.numUnits } : item
            );
            return calculateTotals({ ...state, items: itemsUpdated });
        case 'SET_ITEMS':
            return calculateTotals({ ...state, items: action.items });
        default:
            return state;
    }
};

const calculateTotals = (state: CartState): CartState => {
    const subtotal = state.items.reduce((acc, item) => acc + item.numUnits * item.perUnitCost, 0);
    const tax = subtotal * 0.02; // Example tax rate
    const total = subtotal + tax;
    return { ...state, subtotal, tax, total };
};

const initialState: CartState = {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
};

const CartPage: React.FC = () => {
    const [cartState, dispatch] = useReducer(cartReducer, initialState);
    const [videoStreamUrl, setVideoStreamUrl] = useState<string | null>(null);

    // WebSocket setup for live video and detected products
    useEffect(() => {
        // Example WebSocket setup for detected items
        const productStream = new WebSocket('ws://example.com/products');
        productStream.onmessage = (event) => {
            const detectedItems: CartItem[] = JSON.parse(event.data); // Assuming the server sends the correct format
            dispatch({ type: 'SET_ITEMS', items: detectedItems });
        };

        // Cleanup on component unmount
        return () => {
            productStream.close();
        };
    }, []);

    const handleIncrement = (name: string) => {
        dispatch({
            type: 'UPDATE_ITEM_UNITS',
            name: name,
            numUnits: cartState.items.find(item => item.name === name)!.numUnits + 1,
        });
    };

    const handleDecrement = (name: string) => {
        const currentUnits = cartState.items.find(item => item.name === name)!.numUnits;
        if (currentUnits > 1) {
            dispatch({
                type: 'UPDATE_ITEM_UNITS',
                name: name,
                numUnits: currentUnits - 1,
            });
        } else {
            dispatch({ type: 'REMOVE_ITEM', name: name });
        }
    };

    return (
        <Layout className="layout">
            <Header>
                <div className="header">Scan Items</div>
            </Header>
            <Content style={{ padding: '50px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        {/* Placeholder for video feed */}
                        <Card
                            hoverable
                            style={{ width: '100%', height: 'auto' }}
                            cover={<img alt="Video Feed" src={videoStreamUrl || 'https://via.placeholder.com/750'} />}
                        >
                            <Card.Meta title="Live Video Feed" description="Scanning..." />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <div className='left-part'>
                            <Card>
                                <List
                                    header={<div>{cartState.items.length} items</div>}
                                    bordered
                                    dataSource={cartState.items}
                                    renderItem={(item: CartItem) => (
                                        <List.Item className="cart-item">
                                            <List.Item.Meta
                                                avatar={<img width={64} src={item.imgSrc} alt={item.name} />}
                                                description={
                                                    <div className="cart-item-control">
                                                        <Text strong>{item.name}</Text>
                                                        <Button
                                                            type="text"
                                                            onClick={() => dispatch({ type: 'REMOVE_ITEM', name: item.name })}
                                                        >x</Button>
                                                        <div>
                                                            <Button onClick={() => handleDecrement(item.name)}>-</Button>
                                                            <Text className="item-count">{item.numUnits}</Text>
                                                            <Button onClick={() => handleIncrement(item.name)}>+</Button>
                                                        </div>
                                                        <Text className="item-price">${(item.perUnitCost * item.numUnits).toFixed(2)}</Text>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                            <div className="cart-summary">
                                <Card>
                                    <p>Subtotal: ${cartState.subtotal.toFixed(2)}</p>
                                    <p>Tax: ${cartState.tax.toFixed(2)}</p>
                                    <p>Total: ${cartState.total.toFixed(2)}</p>
                                    <Button type="primary" block>
                                        Finish and Pay
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default CartPage;
