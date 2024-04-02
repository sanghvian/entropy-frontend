import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
    name: string;
    upc: string;
    fact: string;
    matched_img: string;
    numUnits: number;
    perUnitCost: number;
};

export type CartState = {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
};

type CartContextType = {
    cartState: CartState;
    setCartState: React.Dispatch<React.SetStateAction<CartState>>;
    addToCart: (detectedItem: CartItem) => void;
    removeFromCart: (itemUpc: string) => void;
    calculateTotals: (items: CartItem[]) => CartState;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartState, setCartState] = useState<CartState>({
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
    });

    const calculateTotals = (items: CartItem[]): CartState => {
        const subtotal = items.reduce((acc, item) => acc + item.numUnits * item.perUnitCost, 0);
        const tax = subtotal * 0.1; // Assuming a 10% tax rate
        const total = subtotal + tax;
        setCartState({ items, subtotal, tax, total });
        return { items, subtotal, tax, total };
    };

    const addToCart = (detectedItem: CartItem) => {
        const existingItemIndex = cartState.items.findIndex(item => item.upc === detectedItem.upc);

        if (existingItemIndex !== -1) {
            const updatedItems = cartState.items.map((item, index) => {
                if (index === existingItemIndex) {
                    return { ...item, numUnits: item.numUnits + detectedItem.numUnits };
                }
                return item;
            });
            setCartState(calculateTotals(updatedItems));
        } else {
            const newItem = {
                ...detectedItem,
                numUnits: detectedItem.numUnits,
            };
            setCartState(prevState => calculateTotals([...prevState.items, newItem]));
        }
    };

    const removeFromCart = (itemUpc: string) => {
        const updatedItems = cartState.items.filter(item => item.upc !== itemUpc);
        setCartState(calculateTotals(updatedItems));
    };

    return (
        <CartContext.Provider value={{ cartState, setCartState, addToCart, removeFromCart, calculateTotals }}>
            {children}
        </CartContext.Provider>
    );
};
