import React, { useState } from 'react';
import { useStore} from '../context/StoreContext';
import { Link } from 'react-router';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard,
  Banknote,
  QrCode
} from 'lucide-react';
import { toast } from 'sonner';

export default function Caisse() {
  const { products, addToCart, cart, removeFromCart, updateCartQuantity, clearCart, completeSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [lastInvoiceId, setLastInvoiceId] = useState(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (confirm(`Confirmer le paiement de ${cartTotal.toFixed(2)} € ?`)) {
      const invoiceId = completeSale();
      if (invoiceId) {
        setLastInvoiceId(invoiceId);
      }
    }
  };

  if (lastInvoiceId) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Vente Réussie !</h2>
          <p className="text-slate-500 mb-8">La transaction a été enregistrée et la facture générée.</p>
          
          <div className="flex flex-col gap-3">
            <Link 
              to={`/invoices?id=${lastInvoiceId}`}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Voir la Facture
            </Link>
            <button 
              onClick={() => setLastInvoiceId(null)}
              className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Nouvelle Vente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Side: Product Grid */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Scanner ou rechercher un produit..." 
              className="bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 flex-1 outline-none font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group h-40 ${
                product.stock === 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    product.stock <= product.minStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {product.stock} en stock
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </div>
              <div className="mt-3 font-bold text-lg text-slate-900">
                {product.price.toFixed(2)} €
              </div>
            </button>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-12">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Cart */}
      <div className="w-96 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-800">Panier Actuel</h2>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
            {cart.length} articles
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
              <ShoppingCart className="w-16 h-16 stroke-1" />
              <p className="text-sm font-medium">Votre panier est vide</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="font-medium text-slate-800 truncate">{item.name}</h4>
                  <p className="text-sm text-slate-500">{item.price.toFixed(2)} € / unité</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm h-8">
                    <button 
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="px-2 h-full hover:bg-slate-50 hover:text-red-500 transition-colors rounded-l-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-700">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="px-2 h-full hover:bg-slate-50 hover:text-green-500 transition-colors rounded-r-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600 text-sm">
              <span>Sous-total</span>
              <span>{cartTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-slate-600 text-sm">
              <span>TVA (20%)</span>
              <span>{(cartTotal * 0.2).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-slate-200">
              <span className="font-bold text-slate-800">Total à payer</span>
              <span className="text-2xl font-bold text-blue-600">{(cartTotal * 1.2).toFixed(2)} €</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                paymentMethod === 'cash' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Banknote className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Espèces</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                paymentMethod === 'card' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Carte</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('qr')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                paymentMethod === 'qr' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">QR Pay</span>
            </button>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <ShoppingCart className="w-5 h-5" />
            Encaisser {(cartTotal * 1.2).toFixed(2)} €
          </button>
        </div>
      </div>
    </div>
  );
}
