import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useStore } from '../context/storeContext';
import { Search, FileText, Printer, Eye, Download, Calendar, X, ChevronDown } from 'lucide-react';

export default function Factures() {
  const { factures } = useStore();
  const [parametresRecherche, setParametresRecherche] = useSearchParams();
  const [termeRecherche, setTermeRecherche] = useState('');
  const [factureSelectionnee, setFactureSelectionnee] = useState(null);

  useEffect(() => {
    const id = parametresRecherche.get('id');
    if (id) {
      const facture = factures.find(f => f.id === id);
      if (facture) setFactureSelectionnee(facture);
    }
  }, [parametresRecherche, factures]);

  const fermerModal = () => {
    setFactureSelectionnee(null);
    setParametresRecherche({});
  };

  const facturesFiltrees = factures.filter(f =>
    f.id.includes(termeRecherche) ||
    f.date.includes(termeRecherche) ||
    (f.nomCaissier && f.nomCaissier.toLowerCase().includes(termeRecherche.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historique des Factures</h1>
          <p className="text-slate-500">Consultez et gérez vos transactions passées</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium transition-colors">
            <Download className="w-5 h-5" />
            Exporter CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
            <Calendar className="w-5 h-5" />
            Filtrer par date
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par numéro, date ou caissier..."
            className="bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 flex-1 outline-none"
            value={termeRecherche}
            onChange={(e) => setTermeRecherche(e.target.value)}
          />
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 text-sm">
            <tr>
              <th className="px-6 py-4">N° Facture</th>
              <th className="px-6 py-4">Date & Heure</th>
              <th className="px-6 py-4">Caissier</th>
              <th className="px-6 py-4 text-center">Articles</th>
              <th className="px-6 py-4 text-right">Total TTC</th>
              <th className="px-6 py-4 text-center">Statut</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {facturesFiltrees.map((facture) => (
              <tr key={facture.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-mono text-sm font-bold text-slate-700">
                  FAC-{String(facture.numeroSequentiel || facture.id.slice(-4)).padStart(4, '0')}
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {new Date(facture.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      {(facture.nomCaissier || 'IN').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-slate-700 font-medium text-sm">
                      {facture.nomCaissier || 'Inconnu'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-bold border border-slate-200">
                    {facture.articles ? facture.articles.length : (facture.items ? facture.items.length : 0)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-800">
                  {(facture.total * 1.2).toFixed(2)} €
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    facture.statut === 'payee' || facture.status === 'paid'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {facture.statut === 'payee' || facture.status === 'paid' ? 'Payée' : 'En attente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setFactureSelectionnee(facture)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Imprimer"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {facturesFiltrees.length === 0 && (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <FileText className="w-12 h-12 opacity-20" />
            <p>Aucune facture trouvée.</p>
          </div>
        )}
      </div>

      {/* Modal détail */}
      {factureSelectionnee && (
        <ModalDetailFacture
          facture={factureSelectionnee}
          onFermer={fermerModal}
        />
      )}
    </div>
  );
}

function ModalDetailFacture({ facture, onFermer }) {
  const numeroAffiche = `FAC-${String(facture.numeroSequentiel || facture.id.slice(-4)).padStart(4, '0')}`;
  const articles = facture.articles || facture.items || [];
  const sousTotal = facture.total;
  const tva = sousTotal * 0.2;
  const totalTTC = sousTotal * 1.2;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

        {/* En-tête modal */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{numeroAffiche}</h2>
            <p className="text-sm text-slate-500">
              {new Date(facture.date).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
              {facture.nomCaissier && (
                <span className="ml-3 font-medium text-blue-600">· {facture.nomCaissier}</span>
              )}
            </p>
          </div>
          <button onClick={onFermer} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Corps facture */}
        <div className="p-8 overflow-y-auto bg-slate-50/50 flex-1">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">

            {/* Info boutique / client */}
            <div className="flex justify-between mb-8 border-b border-slate-100 pb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">ShopDesk</h3>
                <p className="text-slate-500 text-sm">Votre Boutique Moderne</p>
                <p className="text-slate-500 text-sm">123 Rue du Commerce</p>
                <p className="text-slate-500 text-sm">75001 Paris, France</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 uppercase tracking-wide font-medium mb-1">Caissier</p>
                <p className="font-bold text-slate-800">{facture.nomCaissier || 'Non renseigné'}</p>
                <p className="text-slate-500 text-sm mt-3 uppercase tracking-wide font-medium">Facturé à</p>
                <p className="font-bold text-slate-800">Client Comptoir</p>
                <p className="text-slate-500 text-sm">Vente directe</p>
              </div>
            </div>

            {/* Tableau articles */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="text-left py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Description</th>
                  <th className="text-center py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Qté</th>
                  <th className="text-right py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Prix Unitaire</th>
                  <th className="text-right py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {articles.map((article, i) => (
                  <tr key={i}>
                    <td className="py-4 text-slate-800 font-medium">{article.name || article.nom}</td>
                    <td className="py-4 text-center text-slate-600">{article.quantity || article.quantite}</td>
                    <td className="py-4 text-right text-slate-600">{(article.price || article.prix).toFixed(2)} €</td>
                    <td className="py-4 text-right font-bold text-slate-800">{(article.total).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totaux */}
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Sous-total HT</span>
                  <span>{sousTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm pb-3 border-b border-slate-100">
                  <span>TVA (20%)</span>
                  <span>{tva.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total TTC</span>
                  <span className="text-blue-600">{totalTTC.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pied modal */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button
            onClick={onFermer}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            Fermer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-colors">
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
}