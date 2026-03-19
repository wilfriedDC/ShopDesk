import React, { useState, useEffect } from 'react';
import { useStore } from '../context/storeContext';
import {
  DollarSign, Package, AlertTriangle, ShoppingBag,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const donnéesGraphique = [
  { nom: 'Lun', ventes: 4000 },
  { nom: 'Mar', ventes: 3000 },
  { nom: 'Mer', ventes: 2000 },
  { nom: 'Jeu', ventes: 2780 },
  { nom: 'Ven', ventes: 1890 },
  { nom: 'Sam', ventes: 2390 },
  { nom: 'Dim', ventes: 3490 },
];

// ── Skeletons ────────────────────────────────────────────────────────────────

const Pulse = ({ className }) => (
  <div className={`bg-slate-200 rounded animate-pulse ${className}`} />
);

const SkeletonCarte = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Pulse className="h-3 w-24" />
        <Pulse className="h-7 w-32" />
      </div>
      <Pulse className="h-12 w-12 rounded-xl" />
    </div>
    <div className="mt-4">
      <Pulse className="h-5 w-20 rounded-full" />
    </div>
  </div>
);

const SkeletonGraphique = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-center mb-6">
      <Pulse className="h-5 w-44" />
      <Pulse className="h-8 w-32 rounded-lg" />
    </div>
    <div className="h-80 w-full flex items-end gap-3 px-2">
      {[55, 38, 72, 50, 28, 63, 78].map((h, i) => (
        <Pulse key={i} className="flex-1 rounded-t rounded-b-none" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

const SkeletonVentesRecentes = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
    <div className="flex justify-between items-center mb-6">
      <Pulse className="h-5 w-36" />
      <Pulse className="h-4 w-16" />
    </div>
    <div className="space-y-4">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3">
          <div className="flex items-center gap-4">
            <Pulse className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5">
              <Pulse className="h-3.5 w-28" />
              <Pulse className="h-3 w-16" />
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1.5">
            <Pulse className="h-3.5 w-16" />
            <Pulse className="h-4 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Composants réels ─────────────────────────────────────────────────────────

const CarteStat = ({ titre, valeur, icone: Icone, tendance, valeurTendance, couleur }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{titre}</p>
        <h3 className="text-2xl font-bold text-slate-800">{valeur}</h3>
      </div>
      <div className={`p-3 rounded-xl ${couleur}`}>
        <Icone className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm">
      {tendance === 'hausse' ? (
        <span className="text-green-600 flex items-center font-medium bg-green-50 px-2 py-0.5 rounded-full">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {valeurTendance}
        </span>
      ) : (
        <span className="text-red-600 flex items-center font-medium bg-red-50 px-2 py-0.5 rounded-full">
          <ArrowDownRight className="w-4 h-4 mr-1" />
          {valeurTendance}
        </span>
      )}
      <span className="text-slate-400">vs hier</span>
    </div>
  </div>
);

const VentesRecentes = ({ factures }) => {
  const recentes = factures.slice(0, 5);
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800">Ventes Récentes</h3>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
          Voir tout
        </button>
      </div>
      <div className="space-y-4">
        {recentes.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Aucune vente récente</p>
        ) : (
          recentes.map((facture) => (
            <div
              key={facture.id}
              className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {facture.items.length}
                </div>
                <div>
                  <p className="font-medium text-slate-800">Facture #{facture.id.slice(-4)}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(facture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">{facture.total.toFixed(2)} Ar</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  facture.statut === 'payée'
                    ? 'text-green-600 bg-green-50'
                    : 'text-orange-600 bg-orange-50'
                }`}>
                  {facture.statut === 'payée' ? 'Payée' : 'En attente'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ── Dashboard principal ───────────────────────────────────────────────────────

export default function Dashboard() {
  const { produits, factures } = useStore();
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setChargement(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  const totalVentes    = factures.reduce((acc, f) => acc + f.total, 0);
  const stockBas       = produits.filter((p) => p.stock <= p.minStock).length;
  const totalProduits  = produits.length;
  const panierMoyen    = factures.length > 0 ? totalVentes / factures.length : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tableau de Bord</h1>
          <p className="text-slate-500">Aperçu de votre activité aujourd'hui</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors">
            Exporter Rapport
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
            Nouvelle Vente
          </button>
        </div>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {chargement ? (
          Array(4).fill(0).map((_, i) => <SkeletonCarte key={i} />)
        ) : (
          <>
            <CarteStat titre="Ventes Totales"    valeur={`Ar ${totalVentes.toFixed(2)}`}   icone={DollarSign}    tendance="hausse" valeurTendance="+12.5%" couleur="bg-blue-500" />
            <CarteStat titre="Produits en Stock" valeur={totalProduits}                     icone={Package}       tendance="hausse" valeurTendance="+4"     couleur="bg-purple-500" />
            <CarteStat titre="Alertes Stock Bas" valeur={stockBas}                          icone={AlertTriangle} tendance={stockBas > 0 ? 'baisse' : 'hausse'} valeurTendance={stockBas > 0 ? `-${stockBas}` : '0'} couleur="bg-orange-500" />
            <CarteStat titre="Panier Moyen"      valeur={`Ar ${panierMoyen.toFixed(2)}`}   icone={ShoppingBag}   tendance="hausse" valeurTendance="+3.2%"  couleur="bg-emerald-500" />
          </>
        )}
      </div>

      {/* Graphique + Ventes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {chargement ? <SkeletonGraphique /> : (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">Évolution des Ventes</h3>
                <select className="border border-slate-200 rounded-lg text-sm text-slate-600 px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>7 derniers jours</option>
                  <option>30 derniers jours</option>
                  <option>Cette année</option>
                </select>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={donnéesGraphique}>
                    <defs>
                      <linearGradient id="couleurVentes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="nom"    axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis                  axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="ventes" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#couleurVentes)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {chargement ? <SkeletonVentesRecentes /> : <VentesRecentes factures={factures} />}
        </div>
      </div>
    </div>
  );
}