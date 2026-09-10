import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Save,
  RefreshCw,
  Trash2,
  Globe,
  Database,
  CheckCircle2,
} from 'lucide-react';

export default function Parametre() {

  const API_URL =
    "http://localhost/shopdesk-api/api/settings";

  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');

  // Notification locale (en plus du toast) affichée après un enregistrement réussi
  const [showSavedNotice, setShowSavedNotice] = useState(false);

  // =========================
  // RÉCUPÉRER LES PARAMÈTRES
  // =========================

  useEffect(() => {

    const loadSettings = async () => {

      try {

        const response = await fetch(
          `${API_URL}/get.php`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
            "Impossible de récupérer les paramètres"
          );
        }

        setStoreName(data.data.store_name);
        setAddress(data.data.address);

      } catch (error) {

        console.error("Erreur :", error);

        toast.error(
          "Impossible de charger les paramètres"
        );
      }
    };

    loadSettings();

  }, []);


  // =========================
  // ENREGISTRER
  // =========================

  const handleSave = async () => {

    try {

      const response = await fetch(
        `${API_URL}/update.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeName,
            address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "Impossible d'enregistrer les paramètres"
        );
      }

      toast.success(
        "Paramètres enregistrés"
      );

      // Affiche la notification locale pendant 3 secondes
      setShowSavedNotice(true);
      setTimeout(() => setShowSavedNotice(false), 3000);

    } catch (error) {

      console.error("Erreur :", error);

      toast.error(
        error.message ||
        "Erreur lors de l'enregistrement"
      );
    }
  };


  // =========================
  // RENDER
  // =========================

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

      {/* NOTIFICATION D'ENREGISTREMENT */}
      {showSavedNotice && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">
            Paramètres enregistrés avec succès
          </span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Paramètres
        </h1>

        <p className="text-slate-500">
          Gérez les préférences de votre application
        </p>
      </div>


      {/* INFORMATIONS BOUTIQUE */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-6 border-b border-slate-100">

          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">

            <Globe className="w-5 h-5 text-blue-500" />

            Informations de la Boutique

          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Ces informations apparaîtront sur vos factures.
          </p>

        </div>


        <div className="p-6 space-y-4 max-w-lg">

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom de la boutique
            </label>

            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={storeName}
              onChange={(e) =>
                setStoreName(e.target.value)
              }
            />

          </div>


          <div>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Adresse
            </label>

            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
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


      {/* GESTION DES DONNÉES */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-6 border-b border-slate-100">

          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">

            <Database className="w-5 h-5 text-amber-500" />

            Gestion des Données

          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Options de sauvegarde et de réinitialisation.
          </p>

        </div>


        <div className="p-6 space-y-4">

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">

            <div>

              <h3 className="font-medium text-slate-800">
                Synchronisation
              </h3>

              <p className="text-sm text-slate-500">
                Dernière synchro: Jamais
              </p>

            </div>


            <button
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >

              <RefreshCw className="w-4 h-4" />

              Synchroniser maintenant

            </button>

          </div>


          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">

            <div>

              <h3 className="font-medium text-red-800">
                Zone de danger
              </h3>

              <p className="text-sm text-red-600/80">
                Supprimer toutes les données locales
              </p>

            </div>


            <button
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