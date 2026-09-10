import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Caisse from "./pages/Caisse";
import Produit_stock from "./pages/Produit_stock";
import Facture from "./pages/Factures";
import Settings from "./pages/Parametre";

import { StoreProvider } from "./context/storeContext";

const App = () => {
  return (
    <StoreProvider>
      <Routes>

        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />

        {/* Tableau de bord */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Caisse */}
        <Route
          path="/caisse"
          element={
            <Layout>
              <Caisse />
            </Layout>
          }
        />

        {/* Factures */}
        <Route
          path="/facture"
          element={
            <Layout>
              <Facture />
            </Layout>
          }
        />

        {/* Produits */}
        <Route
          path="/produit"
          element={
            <Layout>
              <Produit_stock />
            </Layout>
          }
        />

        {/* Paramètres */}
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />

        {/* Route inconnue */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </StoreProvider>
  );
};

export default App;