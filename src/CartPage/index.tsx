// App.tsx
import React, { useReducer } from 'react';
import { Layout, List, Button, Row, Col, Card, Typography, Image } from 'antd';
import './CartPage.css';

const Text = Typography.Text;

// Types for our cart items and cart state
type CartItem = {
    name: string;
    weight: string;
    numUnits: number;
    perUnitCost: number;
    imgSrc?: string;
};

type CartState = {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
};

const { Header, Content } = Layout;

// Action types for our reducer
type CartAction =
    | { type: 'ADD_ITEM'; item: CartItem }
    | { type: 'REMOVE_ITEM'; name: string }
    | { type: 'UPDATE_ITEM_UNITS'; name: string; numUnits: number };

// Reducer function to handle cart actions
const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM':
            // Check if item is already in cart
            const itemIndex = state.items.findIndex(item => item.name === action.item.name);
            if (itemIndex >= 0) {
                // Update item numUnits if it exists
                const updatedItems = state.items.map((item, index) =>
                    index === itemIndex ? { ...item, numUnits: item.numUnits + 1 } : item
                );
                return {
                    ...state,
                    items: updatedItems,
                };
            }
            // Add new item to cart
            return {
                ...state,
                items: [...state.items, action.item],
            };
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.name !== action.name),
            };
        case 'UPDATE_ITEM_UNITS':
            return {
                ...state,
                items: state.items.map(item =>
                    item.name === action.name ? { ...item, numUnits: action.numUnits } : item
                ),
            };
        default:
            return state;
    }
};

const initialState: CartState = {
    items: [{
        name: 'Doritos Nacho Cheese',
        weight: '400g',
        numUnits: 1,
        perUnitCost: 2.78,
        imgSrc: 'https://testbucket1841.s3.ap-south-1.amazonaws.com/dump/test-item.png'
    }],
    subtotal: 2.78,
    tax: 1,
    total: 3.78,
};



const CartPage: React.FC = () => {
    const [cartState, dispatch] = useReducer(cartReducer, initialState);
    // const calculateTotals = (items: CartItem[]) => {
    //     const subtotal = items.reduce((acc, item) => acc + item.numUnits * item.perUnitCost, 0);
    //     const tax = subtotal * 0.07; // Assuming a 7% tax rate for example
    //     const total = subtotal + tax;

    //     return { subtotal, tax, total };
    // };
    // Function to handle incrementing the number of units for an item
    const handleIncrement = (name: string) => {
        dispatch({
            type: 'UPDATE_ITEM_UNITS',
            name: name,
            numUnits: cartState.items.find(item => item.name === name)!.numUnits + 1,
        });
    };

    // Function to handle decrementing the number of units for an item
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

    // Function to calculate the totals
    const calculateTotals = (items: CartItem[]) => {
        const subtotal = items.reduce((acc, item) => acc + item.numUnits * item.perUnitCost, 0);
        const tax = subtotal * 0.02; // 2% tax rate
        const total = subtotal + tax;

        return { subtotal, tax, total };
    };

    const totals = calculateTotals(cartState.items);


    return (
        <Layout className="layout">
            <Header>
                <div className="header">Scan Items</div>
            </Header>
            <Content style={{ padding: '50px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card
                            hoverable
                            style={{ width: 750 }}
                            cover={<img alt="example" src="https://testbucket1841.s3.ap-south-1.amazonaws.com/dump/test-item.png" />}
                        >
                            <Card.Meta title="Doritos Nacho Cheese" description="Scanning..." />
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
                                                avatar={
                                                    <img
                                                        width={64}
                                                        src={'https://testbucket1841.s3.ap-south-1.amazonaws.com/dump/test-item.png'}
                                                        alt={item.name} />
                                                }
                                                description={
                                                    <div className="cart-item-control">
                                                        <Text strong>{item.name} - {item.weight}</Text>
                                                        <Button
                                                            type="text"
                                                            onClick={() => dispatch({ type: 'REMOVE_ITEM', name: item.name })}
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end'
                                                            }}
                                                        // icon={<CloseOutlined />}
                                                        >x</Button>
                                                        <div>
                                                            <Button onClick={() => handleDecrement(item.name)}>-</Button> &nbsp; &nbsp; &nbsp;
                                                            <Text className="item-count">{item.numUnits}</Text> &nbsp; &nbsp; &nbsp;
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

                                    <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
                                    <p>Tax: ${totals.tax.toFixed(2)}</p>
                                    <p>Total: ${totals.total.toFixed(2)}</p>
                                    <Button type="primary" block>
                                        Finish and Pay
                                    </Button>
                                </Card>
                            </div>
                        </div>
                        {/* <div className="cart-summary">
                            <p>Subtotal: $0</p>
                            <p>Tax: $0</p>
                            <p>Total: $0</p>
                            <p>Amount Paid: $0</p>
                            <Button type="primary" block>
                                Checkout
                            </Button>
                        </div> */}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default CartPage;
