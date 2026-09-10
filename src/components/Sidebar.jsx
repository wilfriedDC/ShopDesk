import { useLocation, Link } from 'react-router-dom';

import image from '../assets/Icon.png';

import {
  Settings,
  FileText,
  Package,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  LogIn
} from 'lucide-react';

import { useAuth } from '../context/useAuth';


export default function Sidebar() {

  const location = useLocation();

  const {
    user,
    logout
  } = useAuth();


  const menuItems = [

    {
      id: 1,
      name: 'Tableau de bord',
      path: '/',
      icon: LayoutDashboard
    },

    {
      id: 2,
      name: 'Caisse (POS)',
      path: '/caisse',
      icon: ShoppingCart
    },

    {
      id: 3,
      name: 'Produits et Stock',
      path: '/produit',
      icon: Package
    },

    {
      id: 4,
      name: 'Factures',
      path: '/facture',
      icon: FileText
    },

    {
      id: 5,
      name: 'Paramètres',
      path: '/settings',
      icon: Settings
    }

  ];


  return (

    <aside
      className="
        w-60
        bg-slate-900
        text-slate-100
        flex
        flex-col
        h-screen
        fixed
        left-0
        top-0
        border-r
        border-slate-700
        shadow-xl
        z-50
      "
    >

      {/* LOGO */}

      <div
        className="
          flex
          border-b
          border-slate-700
          items-center
          gap-3
          p-4
        "
      >

        <img
          src={image}
          alt="ShopDesk Logo"
          className="
            w-12
            h-12
            object-contain
          "
        />

        <span
          className="
            text-xl
            font-bold
            text-white
          "
        >
          ShopDesk
        </span>

      </div>


      {/* NAVIGATION */}

      <nav
        className="
          flex-1
          p-4
          py-6
          space-y-2
        "
      >

        {

          menuItems.map((item) => {

            const isActive =
              location.pathname === item.path;

            const Icon =
              item.icon;


            return (

              <Link

                key={item.id}

                to={item.path}

                className={`

                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-lg
                  transition-all
                  duration-200
                  group

                  ${
                    isActive

                      ? 'bg-blue-600 text-white shadow-lg'

                      : `
                        text-slate-400
                        hover:bg-slate-800
                        hover:text-white
                      `
                  }

                `}

              >

                <Icon

                  className={`

                    w-5
                    h-5

                    ${
                      isActive

                        ? 'text-white'

                        : `
                          text-slate-500
                          group-hover:text-white
                        `
                    }

                  `}

                />


                <span
                  className="
                    font-medium
                  "
                >

                  {item.name}

                </span>

              </Link>

            );

          })

        }

      </nav>


      {/* AUTHENTIFICATION */}

      <div
        className="
          border-t
          border-slate-700
          p-3
        "
      >

        {

          user

            ?

            (

              <button

                onClick={logout}

                className="
                  flex
                  items-center
                  gap-3
                  w-full
                  px-4
                  py-3
                  rounded-lg
                  text-slate-400
                  hover:bg-slate-800
                  hover:text-red-400
                  transition-colors
                "

              >

                <LogOut
                  className="
                    w-5
                    h-5
                  "
                />

                <span
                  className="
                    font-medium
                  "
                >

                  Déconnexion

                </span>

              </button>

            )

            :

            (

              <Link

                to="/login"

                className="
                  flex
                  items-center
                  gap-3
                  w-full
                  px-4
                  py-3
                  rounded-lg
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  transition-colors
                "

              >

                <LogIn
                  className="
                    w-5
                    h-5
                  "
                />

                <span
                  className="
                    font-medium
                  "
                >

                  Se connecter

                </span>

              </Link>

            )

        }

      </div>

    </aside>

  );

}