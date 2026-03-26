import React, { useState } from 'react';
import { toast } from 'sonner';
import { Save, RefreshCw, Trash2, Globe, Database, Moon } from 'lucide-react';

export default function Parametre() {
  const [storeName, setStoreName] = useState('Ma Boutique');
  const [address, setAddress] = useState('123 Rue du Commerce');

  const handleSave = () => {
    localStorage.setItem('shopdesk_settings', JSON.stringify({ storeName, address }));
    toast.success('Paramètres enregistrés');
  };

  const handleClearData = () => {
    if (confirm('ATTENTION: Cela effacera toutes les données (produits, factures). Continuer ?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Paramètres</h1>
        <p className="text-slate-500">Gérez les préférences de votre application</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Informations de la Boutique
          </h2>
          <p className="text-slate-500 text-sm mt-1">Ces informations apparaîtront sur vos factures.</p>
        </div>
        
        <div className="p-6 space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la boutique</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            Gestion des Données
          </h2>
          <p className="text-slate-500 text-sm mt-1">Options de sauvegarde et de réinitialisation.</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <h3 className="font-medium text-slate-800">Synchronisation</h3>
              <p className="text-sm text-slate-500">Dernière synchro: Jamais</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium transition-colors">
              <RefreshCw className="w-4 h-4" />
              Synchroniser maintenant
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div>
              <h3 className="font-medium text-red-800">Zone de danger</h3>
              <p className="text-sm text-red-600/80">Supprimer toutes les données locales</p>
            </div>
            <button 
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
