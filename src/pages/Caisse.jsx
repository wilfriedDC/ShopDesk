import React, { useState } from 'react';
import { useStore } from '../context/storeContext';
import { Link } from 'react-router-dom';
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
  const { 
    produits, 
    ajouterAuPanier, 
    panier, 
    retirerDuPanier, 
    modifierQuantitePanier, 
    viderPanier, 
    finaliserVente 
  } = useStore();

  const [termeRecherche, setTermeRecherche]       = useState('');
  const [categorieSelectionnee, setCategorieSelectionnee] = useState('All');
  const [methodePaiement, setMethodePaiement]     = useState('especes');
  const [derniereFactureId, setDerniereFactureId] = useState(null);

  const categories = ['All', ...Array.from(new Set((produits || []).map(p => p.category)))];

  const produitsFiltres = (produits || []).filter(p => {
    const correspondRecherche = p.name.toLowerCase().includes(termeRecherche.toLowerCase());
    const correspondCategorie = categorieSelectionnee === 'All' || p.category === categorieSelectionnee;
    return correspondRecherche && correspondCategorie;
  });

  const totalPanier = (panier || []).reduce((somme, item) => somme + item.total, 0);

  const gererEncaissement = () => {
    if (panier.length === 0) return;
    if (confirm(`Confirmer le paiement de ${(totalPanier * 1.2).toFixed(2)} Ar ?`)) {
      const factureId = finaliserVente();
      if (factureId) {
        setDerniereFactureId(factureId);
      }
    }
  };

  if (derniereFactureId) {
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
              to={`/facture?id=${derniereFactureId}`}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Voir la Facture
            </Link>
            <button 
              onClick={() => setDerniereFactureId(null)}
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

      {/* Grille des produits */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">

          {/* Barre de recherche */}
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Scanner ou rechercher un produit..." 
              className="bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 flex-1 outline-none font-medium"
              value={termeRecherche}
              onChange={(e) => setTermeRecherche(e.target.value)}
              autoFocus
            />
          </div>
          
          {/* Filtres catégories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategorieSelectionnee(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  categorieSelectionnee === cat 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Produits */}
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
          {produitsFiltres.map(produit => (
            <button
              key={produit.id}
              onClick={() => ajouterAuPanier(produit)}
              disabled={produit.stock === 0}
              className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group h-40 ${
                produit.stock === 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {produit.category}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    produit.stock <= produit.minStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {produit.stock} en stock
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {produit.name}
                </h3>
              </div>
              <div className="mt-3 font-bold text-lg text-slate-900">
                {produit.price.toFixed(2)} Ar
              </div>
            </button>
          ))}

          {produitsFiltres.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-12">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Panier */}
      <div className="w-96 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-800">Panier Actuel</h2>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
            {panier.length} articles
          </span>
        </div>

        {/* Articles du panier */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {panier.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
              <ShoppingCart className="w-16 h-16 stroke-1" />
              <p className="text-sm font-medium">Votre panier est vide</p>
            </div>
          ) : (
            panier.map(article => (
              <div key={article.produitId} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="font-medium text-slate-800 truncate">{article.nom}</h4>
                  <p className="text-sm text-slate-500">{article.prix.toFixed(2)} Ar / unité</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm h-8">
                    <button 
                      onClick={() => modifierQuantitePanier(article.produitId, article.quantite - 1)}
                      className="px-2 h-full hover:bg-slate-50 hover:text-red-500 transition-colors rounded-l-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-700">{article.quantite}</span>
                    <button 
                      onClick={() => modifierQuantitePanier(article.produitId, article.quantite + 1)}
                      className="px-2 h-full hover:bg-slate-50 hover:text-green-500 transition-colors rounded-r-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button 
                    onClick={() => retirerDuPanier(article.produitId)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totaux et paiement */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600 text-sm">
              <span>Sous-total HT</span>
              <span>{totalPanier.toFixed(2)} Ar</span>
            </div>
            <div className="flex justify-between text-slate-600 text-sm">
              <span>TVA (20%)</span>
              <span>{(totalPanier * 0.2).toFixed(2)} Ar</span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-slate-200">
              <span className="font-bold text-slate-800">Total TTC</span>
              <span className="text-2xl font-bold text-blue-600">{(totalPanier * 1.2).toFixed(2)} Ar</span>
            </div>
          </div>

          {/* Méthode de paiement */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setMethodePaiement('especes')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                methodePaiement === 'especes' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Banknote className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Espèces</span>
            </button>
            <button 
              onClick={() => setMethodePaiement('carte')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                methodePaiement === 'carte' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Carte</span>
            </button>
            <button 
              onClick={() => setMethodePaiement('qr')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                methodePaiement === 'qr' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">QR Pay</span>
            </button>
          </div>

          {/* Bouton encaisser */}
          <button 
            disabled={panier.length === 0}
            onClick={gererEncaissement}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <ShoppingCart className="w-5 h-5" />
            Encaisser {(totalPanier * 1.2).toFixed(2)} Ar
          </button>
        </div>
      </div>
    </div>
  );
}