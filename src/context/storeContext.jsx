import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const StoreContext = createContext(undefined);

const PRODUITS_INITIAUX = [
  { id: '1', name: 'Riz (1kg)',             category: 'Alimentation', price: 3000, stock: 45,  minStock: 10 },
  { id: '2', name: "Huile d'Olive (1L)",    category: 'Alimentation', price: 10000,  stock: 12,  minStock: 15 },
  { id: '3', name: 'Café Moulu (250g)',      category: 'Boissons',     price: 1000,  stock: 8,   minStock: 10 },
  { id: '4', name: 'Savon Nosy',     category: 'Hygiène',      price: 2000,  stock: 30,  minStock: 5  },
  { id: '5', name: 'Pâtes Penne (500g)',     category: 'Alimentation', price: 4920,  stock: 100, minStock: 20 },
];

export function StoreProvider({ children }) {
  const [produits, setProduits] = useState(() => {
    const sauvegarde = localStorage.getItem('shopdesk_produits');
    return sauvegarde ? JSON.parse(sauvegarde) : PRODUITS_INITIAUX;
  });

  const [factures, setFactures] = useState(() => {
    const sauvegarde = localStorage.getItem('shopdesk_factures');
    return sauvegarde ? JSON.parse(sauvegarde) : [];
  });

  const [panier, setPanier] = useState([]);
  const [estEnLigne, setEstEnLigne] = useState(navigator.onLine);

  useEffect(() => {
    localStorage.setItem('shopdesk_produits', JSON.stringify(produits));
  }, [produits]);

  useEffect(() => {
    localStorage.setItem('shopdesk_factures', JSON.stringify(factures));
  }, [factures]);

  useEffect(() => {
    const gererEnLigne  = () => setEstEnLigne(true);
    const gererHorsLigne = () => setEstEnLigne(false);
    window.addEventListener('online',  gererEnLigne);
    window.addEventListener('offline', gererHorsLigne);
    return () => {
      window.removeEventListener('online',  gererEnLigne);
      window.removeEventListener('offline', gererHorsLigne);
    };
  }, []);

  const ajouterProduit = (produit) => {
    const nouveauProduit = { ...produit, id: Math.random().toString(36).substring(2, 9) };
    setProduits([...produits, nouveauProduit]);
    toast.success('Produit ajouté avec succès');
  };

  const modifierProduit = (id, modifications) => {
    setProduits(produits.map(p => p.id === id ? { ...p, ...modifications } : p));
    toast.success('Produit mis à jour');
  };

  const supprimerProduit = (id) => {
    setProduits(produits.filter(p => p.id !== id));
    toast.success('Produit supprimé');
  };

  const ajouterAuPanier = (produit) => {
    setPanier(prev => {
      const existant = prev.find(item => item.produitId === produit.id);
      if (existant) {
        if (existant.quantite >= produit.stock) {
          toast.error('Stock insuffisant');
          return prev;
        }
        return prev.map(item =>
          item.produitId === produit.id
            ? { ...item, quantite: item.quantite + 1, total: (item.quantite + 1) * item.prix }
            : item
        );
      }
      return [...prev, {
        produitId: produit.id,
        nom:       produit.name,
        prix:      produit.price,
        quantite:  1,
        total:     produit.price,
      }];
    });
  };

  const retirerDuPanier = (produitId) => {
    setPanier(prev => prev.filter(item => item.produitId !== produitId));
  };

  const modifierQuantitePanier = (produitId, quantite) => {
    if (quantite <= 0) {
      retirerDuPanier(produitId);
      return;
    }
    const produit = produits.find(p => p.id === produitId);
    if (produit && quantite > produit.stock) {
      toast.error(`Stock insuffisant (Max: ${produit.stock})`);
      return;
    }
    setPanier(prev => prev.map(item =>
      item.produitId === produitId
        ? { ...item, quantite, total: quantite * item.prix }
        : item
    ));
  };

  const viderPanier = () => setPanier([]);

  const finaliserVente = () => {
    if (panier.length === 0) return null;

    const total = panier.reduce((somme, item) => somme + item.total, 0);
    const nouvelleFacture = {
      id:     Date.now().toString(),
      date:   new Date().toISOString(),
      items:  panier,
      total,
      statut: 'payée',
    };

    const nouveauxProduits = produits.map(p => {
      const itemPanier = panier.find(c => c.produitId === p.id);
      return itemPanier ? { ...p, stock: p.stock - itemPanier.quantite } : p;
    });

    setProduits(nouveauxProduits);
    setFactures([nouvelleFacture, ...factures]);
    setPanier([]);
    toast.success('Vente terminée et facture générée !');
    return nouvelleFacture.id;
  };

  return (
    <StoreContext.Provider value={{
      produits, factures, panier,
      ajouterProduit, modifierProduit, supprimerProduit,
      ajouterAuPanier, retirerDuPanier, modifierQuantitePanier, viderPanier,
      finaliserVente, estEnLigne,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const contexte = useContext(StoreContext);
  if (!contexte) throw new Error('useStore doit être utilisé dans un StoreProvider');
  return contexte;
};