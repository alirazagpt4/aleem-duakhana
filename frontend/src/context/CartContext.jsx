import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'cart';
const MAX_QTY = 20;

const load = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!Array.isArray(saved)) return [];
        return saved.filter(
            (i) =>
                Number.isInteger(i.product_id) &&
                Number.isInteger(i.quantity) &&
                i.quantity > 0 &&
                i.quantity <= MAX_QTY
        );
    } catch {
        return [];
    }
};

export function CartProvider({ children }) {
    const [items, setItems] = useState(load);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            /* save na ho to koi masla nahi */
        }
    }, [items]);

    const addItem = (product, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.product_id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.product_id === product.id
                        ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QTY) }
                        : i
                );
            }
            return [
                ...prev,
                {
                    product_id: product.id,
                    name: product.name,
                    price: product.price_after_discount,
                    image: product.image,
                    quantity: Math.min(quantity, MAX_QTY),
                },
            ];
        });
    };

    const removeItem = (productId) =>
        setItems((prev) => prev.filter((i) => i.product_id !== productId));

    const setQuantity = (productId, quantity) => {
        if (quantity < 1) return removeItem(productId);
        setItems((prev) =>
            prev.map((i) =>
                i.product_id === productId ? { ...i, quantity: Math.min(quantity, MAX_QTY) } : i
            )
        );
    };

    const clear = () => setItems([]);

    const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        [items]
    );

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, setQuantity, clear, totalItems, subtotal }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);