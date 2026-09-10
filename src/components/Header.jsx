import React, { useEffect, useState } from "react";
import {
  Wifi,
  WifiOff,
  Bell,
  LogIn,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Header() {
  const { user, loading, logout } = useAuth();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">

      {/* DATE */}
      <div>
        <h2 className="text-base font-semibold text-slate-800 capitalize">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h2>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-5">

        {/* STATUT INTERNET */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            isOnline
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {isOnline ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}

          <span>
            {isOnline ? "En ligne" : "Hors ligne"}
          </span>
        </div>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* UTILISATEUR */}
        {loading ? (
          <div className="w-28 h-8 bg-slate-100 rounded animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3 border-l pl-5 border-slate-200">

            {/* INFORMATIONS */}
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-700">
                {user.name || "Utilisateur"}
              </p>

              <p className="text-xs text-green-600">
                Connecté
              </p>
            </div>

            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {initials}
            </div>

            {/* DECONNEXION */}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden lg:block text-sm font-medium">
                Déconnexion
              </span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Se connecter
          </Link>
        )}
      </div>
    </header>
  );
}