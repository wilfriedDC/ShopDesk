import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const StoreContext = createContext(undefined);

const INITIAL_PRODUCTS = [
  { id: '1', name: 'Riz Basmati (5kg)',    category: 'Alimentation', price: 12.50, stock: 45,  minStock: 10 },
  { id: '2', name: "Huile d'Olive (1L)",   category: 'Alimentation', price: 8.90,  stock: 12,  minStock: 15 },
  { id: '3', name: 'Café Moulu (250g)',     category: 'Boissons',     price: 3.45,  stock: 8,   minStock: 10 },
  { id: '4', name: 'Savon de Marseille',    category: 'Hygiène',      price: 2.10,  stock: 30,  minStock: 5  },
  { id: '5', name: 'Pâtes Penne (500g)',    category: 'Alimentation', price: 1.20,  stock: 100, minStock: 20 },
];

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('shopdesk_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('shopdesk_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    localStorage.setItem('shopdesk_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shopdesk_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addProduct = (product) => {
    const newProduct = { ...product, id: Math.random().toString(36).substring(2, 9) };
    setProducts([...products, newProduct]);
    toast.success('Produit ajouté avec succès');
  };

  const updateProduct = (id, updates) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Produit mis à jour');
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Produit supprimé');
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error('Stock insuffisant');
          return prev;
        }
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name:      product.name,
        price:     product.price,
        quantity:  1,
        total:     product.price,
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      toast.error(`Stock insuffisant (Max: ${product.stock})`);
      return;
    }
    setCart(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const completeSale = () => {
    if (cart.length === 0) return null;

    const total = cart.reduce((sum, item) => sum + item.total, 0);
    const newInvoice = {
      id:     Date.now().toString(),
      date:   new Date().toISOString(),
      items:  cart,
      total,
      status: 'paid',
    };

    const newProducts = products.map(p => {
      const cartItem = cart.find(c => c.productId === p.id);
      return cartItem ? { ...p, stock: p.stock - cartItem.quantity } : p;
    });

    setProducts(newProducts);
    setInvoices([newInvoice, ...invoices]);
    setCart([]);
    toast.success('Vente terminée et facture générée !');
    return newInvoice.id;
  };

  return (
    <StoreContext.Provider value={{
      products, invoices, cart,
      addProduct, updateProduct, deleteProduct,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      completeSale, isOnline,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};