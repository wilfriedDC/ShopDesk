import React, { useState, useEffect } from 'react';
import { useStore } from '../context/storeContext';
import {
  DollarSign,
  Package,
  AlertTriangle,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ─── Mock data graphique (remplace par vraies données quand l'API est prête) ──
const mockChartData = [
  { name: 'Lun', sales: 4000 },
  { name: 'Mar', sales: 3000 },
  { name: 'Mer', sales: 2000 },
  { name: 'Jeu', sales: 2780 },
  { name: 'Ven', sales: 1890 },
  { name: 'Sam', sales: 2390 },
  { name: 'Dim', sales: 3490 },
];

// ════════════════════════════════════════════════════════════════════════════
// SKELETONS
// ════════════════════════════════════════════════════════════════════════════

const Pulse = ({ className }) => (
  <div className={`bg-slate-200 rounded animate-pulse ${className}`} />
);

const StatCardSkeleton = () => (
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

const ChartSkeleton = () => (
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

const RecentSalesSkeleton = () => (
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

// ════════════════════════════════════════════════════════════════════════════
// COMPOSANTS RÉELS
// ════════════════════════════════════════════════════════════════════════════

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm">
      {trend === 'up' ? (
        <span className="text-green-600 flex items-center font-medium bg-green-50 px-2 py-0.5 rounded-full">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {trendValue}
        </span>
      ) : (
        <span className="text-red-600 flex items-center font-medium bg-red-50 px-2 py-0.5 rounded-full">
          <ArrowDownRight className="w-4 h-4 mr-1" />
          {trendValue}
        </span>
      )}
      <span className="text-slate-400">vs hier</span>
    </div>
  </div>
);

const RecentSales = ({ invoices }) => {
  const recent = invoices.slice(0, 5);
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800">Ventes Récentes</h3>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
          Voir tout
        </button>
      </div>
      <div className="space-y-4">
        {recent.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Aucune vente récente</p>
        ) : (
          recent.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {inv.items.length}
                </div>
                <div>
                  <p className="font-medium text-slate-800">Facture #{inv.id.slice(-4)}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(inv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">{inv.total.toFixed(2)} €</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  inv.status === 'paid'
                    ? 'text-green-600 bg-green-50'
                    : 'text-orange-600 bg-orange-50'
                }`}>
                  {inv.status === 'paid' ? 'Payé' : 'En attente'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════

export default function Dashboard() {
  const { products, invoices } = useStore();

  // Les données viennent du localStorage (sync), mais on attend
  // le premier render pour éviter le flash de contenu vide.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // requestAnimationFrame garantit que le DOM est prêt avant d'afficher les données
    const raf = requestAnimationFrame(() => setIsLoading(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Calculs depuis le contexte ────────────────────────────────────────────
  const totalSales     = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const lowStockCount  = products.filter((p) => p.stock <= p.minStock).length;
  const totalProducts  = products.length;
  const averageCart    = invoices.length > 0 ? totalSales / invoices.length : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── En-tête ─────────────────────────────────────────────────────── */}
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

      {/* ── Cartes stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Ventes Totales"
              value={`${totalSales.toFixed(2)} €`}
              icon={DollarSign}
              trend="up"
              trendValue="+12.5%"
              color="bg-blue-500"
            />
            <StatCard
              title="Produits en Stock"
              value={totalProducts}
              icon={Package}
              trend="up"
              trendValue="+4"
              color="bg-purple-500"
            />
            <StatCard
              title="Alertes Stock Bas"
              value={lowStockCount}
              icon={AlertTriangle}
              trend={lowStockCount > 0 ? 'down' : 'up'}
              trendValue={lowStockCount > 0 ? `-${lowStockCount}` : '0'}
              color="bg-orange-500"
            />
            <StatCard
              title="Panier Moyen"
              value={`${averageCart.toFixed(2)} €`}
              icon={ShoppingBag}
              trend="up"
              trendValue="+3.2%"
              color="bg-emerald-500"
            />
          </>
        )}
      </div>

      {/* ── Graphique + Ventes récentes ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Graphique */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">Évolution des Ventes</h3>
                <select className="border border-slate-200 rounded-lg text-sm text-slate-600 px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option>7 derniers jours</option>
                  <option>30 derniers jours</option>
                  <option>Cette année</option>
                </select>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Ventes récentes */}
        <div className="lg:col-span-1">
          {isLoading ? (
            <RecentSalesSkeleton />
          ) : (
            <RecentSales invoices={invoices} />
          )}
        </div>

      </div>
    </div>
  );
}