"use client";

import React, { useReducer, createContext, useContext } from "react";

type CartAction =
    | { type: "RESET_CART"; }
    | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } };

// Create a reducer to manage cart state
function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
        switch (action.type) {
            case "UPDATE_QUANTITY":
                const { productId, quantity } = action.payload;

                // Remove item if quantity is 0
                if (quantity === 0) {
                    return state.filter(item => item.productId !== productId);
                }

                // Update existing item or add new item
                const existingItem = state.find(item => item.productId === productId);
                if (existingItem) {
                    return state.map(item =>
                        item.productId === productId ? { ...item, quantity } : item
                    );
                } else {
                    return [...state, { productId, quantity }];
                }
            case "RESET_CART":
                return [];
            default:
                return state;
    }
}

const CartContext = createContext<{
    cart: CartItem[];
    dispatch: React.Dispatch<CartAction>;
} | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, []);

    return (
        <CartContext.Provider value={{ cart, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};
