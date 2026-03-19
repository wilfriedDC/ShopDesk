import React, { useState } from 'react';
import { useStore } from '../context/storeContext';
import { 
  Search, Plus, Edit2, Trash2, AlertCircle, X
} from 'lucide-react';

export default function Produit_stock() {
  const { produits, ajouterProduit, modifierProduit, supprimerProduit } = useStore();
  const [recherche, setRecherche] = useState('');
  const [modalOuverte, setModalOuverte] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState(null);

  const produitsFiltres = produits.filter(p => 
    p.name.toLowerCase().includes(recherche.toLowerCase()) ||
    p.category.toLowerCase().includes(recherche.toLowerCase())
  );

  const ouvrirEdition = (produit) => {
    setProduitEnEdition(produit);
    setModalOuverte(true);
  };

  const gererSuppression = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      supprimerProduit(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des Produits</h1>
          <p className="text-slate-500">{produits.length} produits dans l'inventaire</p>
        </div>
        <button 
          onClick={() => { setProduitEnEdition(null); setModalOuverte(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Ajouter Produit
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            className="bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 flex-1 outline-none"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Nom du Produit</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4 text-right">Prix</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {produitsFiltres.map((produit) => (
              <tr key={produit.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-800">{produit.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {produit.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-700">{produit.price.toFixed(2)} Ar</td>
                <td className="px-6 py-4 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${
                    produit.stock <= produit.minStock 
                      ? 'bg-red-50 text-red-700 border-red-100' 
                      : 'bg-green-50 text-green-700 border-green-100'
                  }`}>
                    {produit.stock <= produit.minStock && <AlertCircle className="w-3.5 h-3.5" />}
                    {produit.stock}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => ouvrirEdition(produit)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => gererSuppression(produit.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {produitsFiltres.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            Aucun produit trouvé.
          </div>
        )}
      </div>

      {modalOuverte && (
        <ModalProduit 
          produit={produitEnEdition} 
          onFermer={() => setModalOuverte(false)} 
          onSauvegarder={(donnees) => {
            if (produitEnEdition) {
              modifierProduit(produitEnEdition.id, donnees);
            } else {
              ajouterProduit(donnees);
            }
            setModalOuverte(false);
          }} 
        />
      )}
    </div>
  );
}

function ModalProduit({ produit, onFermer, onSauvegarder }) {
  const [formulaire, setFormulaire] = useState({
    name:     produit?.name     || '',
    category: produit?.category || '',
    price:    produit?.price    || 0,
    stock:    produit?.stock    || 0,
    minStock: produit?.minStock || 5,
  });

  const gererSoumission = (e) => {
    e.preventDefault();
    onSauvegarder({
      ...formulaire,
      price:    Number(formulaire.price),
      stock:    Number(formulaire.stock),
      minStock: Number(formulaire.minStock),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {produit ? 'Modifier Produit' : 'Nouveau Produit'}
          </h2>
          <button onClick={onFermer} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={gererSoumission} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom du Produit</label>
            <input 
              required type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formulaire.name}
              onChange={e => setFormulaire({...formulaire, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
            <select 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              value={formulaire.category}
              onChange={e => setFormulaire({...formulaire, category: e.target.value})}
            >
              <option value="">Sélectionner...</option>
              <option value="Alimentation">Alimentation</option>
              <option value="Boissons">Boissons</option>
              <option value="Hygiène">Hygiène</option>
              <option value="Électronique">Électronique</option>
              <option value="Vêtements">Vêtements</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prix (Ar)</label>
              <input 
                required type="number" step="0.01" min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formulaire.price}
                onChange={e => setFormulaire({...formulaire, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Actuel</label>
              <input 
                required type="number" min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formulaire.stock}
                onChange={e => setFormulaire({...formulaire, stock: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Seuil d'alerte (Stock min)</label>
            <input 
              required type="number" min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formulaire.minStock}
              onChange={e => setFormulaire({...formulaire, minStock: e.target.value})}
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              type="button" onClick={onFermer}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}