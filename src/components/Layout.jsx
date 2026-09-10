import React from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-60 flex-1 min-h-screen bg-slate-50">

        <Header />

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
}