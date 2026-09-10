import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import { toast } from "sonner";


/*
=========================================
CONFIGURATION API
=========================================
*/

const API_URL = "http://localhost/shopdesk-api/api";


/*
=========================================
CREATION CONTEXT
=========================================
*/

const StoreContext = createContext(undefined);


/*
=========================================
STORE PROVIDER
=========================================
*/

export function StoreProvider({ children }) {


  /*
  =========================================
  STATES
  =========================================
  */

  const [produits, setProduits] = useState([]);

  const [factures, setFactures] = useState([]);

  const [panier, setPanier] = useState([]);

  const [chargementProduits, setChargementProduits] =
    useState(true);

  const [chargementFactures, setChargementFactures] =
    useState(true);

  const [estEnLigne, setEstEnLigne] =
    useState(navigator.onLine);


  /*
  =========================================
  CHARGER LES PRODUITS
  =========================================
  */

  const chargerProduits = async () => {

    try {

      setChargementProduits(true);


      const response = await fetch(
        `${API_URL}/products.php`
      );


      const result = await response.json();


      console.log(
        "Produits API :",
        result
      );


      if (result.success) {

        const produitsFormates =
          result.data.map((produit) => ({

            id:
              produit.id,

            name:
              produit.name,

            category:
              produit.category,

            price:
              Number(produit.price),

            stock:
              Number(produit.stock),

            minStock:
              Number(produit.min_stock)

          }));


        setProduits(
          produitsFormates
        );


      } else {

        toast.error(
          result.message ||
          "Impossible de charger les produits"
        );

      }


    } catch (error) {

      console.error(
        "Erreur chargement produits :",
        error
      );


      toast.error(
        "Impossible de se connecter au serveur"
      );


    } finally {

      setChargementProduits(false);

    }

  };


  /*
  =========================================
  CHARGER LES VENTES
  =========================================
  */

  const chargerFactures = async () => {

    try {

      setChargementFactures(true);


      const response = await fetch(
        `${API_URL}/sales.php`
      );


      const result = await response.json();


      console.log(
        "Ventes API :",
        result
      );


      if (result.success) {


        const facturesFormatees =
          result.data.map((vente) => ({

            /*
            ----------------------
            ID
            ----------------------
            */

            id:
              vente.id,


            /*
            ----------------------
            DATE
            ----------------------
            */

            date:
              vente.created_at ||
              vente.date,


            /*
            ----------------------
            ARTICLES
            ----------------------
            */

            items:
              vente.items || [],


            /*
            ----------------------
            TOTAUX
            ----------------------
            */

            subtotal:
              Number(
                vente.subtotal || 0
              ),

            tax:
              Number(
                vente.tax || 0
              ),

            total:
              Number(
                vente.total || 0
              ),


            /*
            ----------------------
            PAIEMENT
            ----------------------
            */

            paymentMethod:
              vente.payment_method ||
              vente.paymentMethod,


            /*
            ----------------------
            STATUT
            ----------------------
            */

            statut:
              vente.status ||
              vente.statut ||
              "payée"

          }));


        setFactures(
          facturesFormatees
        );


      } else {

        console.error(
          result.message
        );

      }


    } catch (error) {

      console.error(
        "Erreur chargement ventes :",
        error
      );


    } finally {

      setChargementFactures(
        false
      );

    }

  };


  /*
  =========================================
  CHARGER DONNEES AU DEMARRAGE
  =========================================
  */

  useEffect(() => {

    chargerProduits();

    chargerFactures();

  }, []);


  /*
  =========================================
  DETECTER INTERNET
  =========================================
  */

  useEffect(() => {


    const gererEnLigne = () => {

      setEstEnLigne(true);

      toast.success(
        "Connexion Internet rétablie"
      );

    };


    const gererHorsLigne = () => {

      setEstEnLigne(false);

      toast.error(
        "Vous êtes hors ligne"
      );

    };


    window.addEventListener(
      "online",
      gererEnLigne
    );


    window.addEventListener(
      "offline",
      gererHorsLigne
    );


    return () => {

      window.removeEventListener(
        "online",
        gererEnLigne
      );


      window.removeEventListener(
        "offline",
        gererHorsLigne
      );

    };


  }, []);



  /*
  =========================================
  AJOUTER PRODUIT
  =========================================
  */

  const ajouterProduit =
    async (produit) => {

      try {


        const response =
          await fetch(

            `${API_URL}/products.php`,

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body:
                JSON.stringify({

                  name:
                    produit.name,

                  category:
                    produit.category,

                  price:
                    Number(produit.price),

                  stock:
                    Number(produit.stock),

                  minStock:
                    Number(produit.minStock)

                })

            }

          );


        const result =
          await response.json();


        if (!result.success) {

          toast.error(
            result.message ||
            "Erreur ajout produit"
          );

          return false;

        }


        await chargerProduits();


        toast.success(
          "Produit ajouté avec succès"
        );


        return true;


      } catch (error) {

        console.error(
          "Erreur ajout produit :",
          error
        );


        toast.error(
          "Impossible d'ajouter le produit"
        );


        return false;

      }

    };



  /*
  =========================================
  MODIFIER PRODUIT
  =========================================
  */

  const modifierProduit =
    async (id, modifications) => {

      try {


        const response =
          await fetch(

            `${API_URL}/products.php?id=${id}`,

            {

              method: "PUT",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body:
                JSON.stringify({

                  name:
                    modifications.name,

                  category:
                    modifications.category,

                  price:
                    Number(
                      modifications.price
                    ),

                  stock:
                    Number(
                      modifications.stock
                    ),

                  minStock:
                    Number(
                      modifications.minStock
                    )

                })

            }

          );


        const result =
          await response.json();


        if (!result.success) {

          toast.error(
            result.message ||
            "Erreur modification"
          );

          return false;

        }


        await chargerProduits();


        toast.success(
          "Produit mis à jour"
        );


        return true;


      } catch (error) {

        console.error(
          "Erreur modification produit :",
          error
        );


        toast.error(
          "Impossible de modifier le produit"
        );


        return false;

      }

    };



  /*
  =========================================
  SUPPRIMER PRODUIT
  =========================================
  */

  const supprimerProduit =
    async (id) => {

      try {


        const response =
          await fetch(

            `${API_URL}/products.php?id=${id}`,

            {

              method:
                "DELETE"

            }

          );


        const result =
          await response.json();


        if (!result.success) {

          toast.error(
            result.message ||
            "Erreur suppression"
          );

          return false;

        }


        await chargerProduits();


        toast.success(
          "Produit supprimé"
        );


        return true;


      } catch (error) {

        console.error(
          "Erreur suppression produit :",
          error
        );


        toast.error(
          "Impossible de supprimer le produit"
        );


        return false;

      }

    };



  /*
  =========================================
  AJOUTER AU PANIER
  =========================================
  */

  const ajouterAuPanier =
    (produit) => {


      setPanier(
        (ancienPanier) => {


          /*
          ==============================
          VERIFIER STOCK
          ==============================
          */

          if (
            produit.stock <= 0
          ) {

            toast.error(
              "Produit en rupture de stock"
            );

            return ancienPanier;

          }


          /*
          ==============================
          PRODUIT DEJA DANS PANIER
          ==============================
          */

          const existant =
            ancienPanier.find(
              (item) =>
                String(
                  item.produitId
                ) ===
                String(
                  produit.id
                )
            );


          if (existant) {


            if (
              existant.quantite >=
              produit.stock
            ) {

              toast.error(
                "Stock insuffisant"
              );

              return ancienPanier;

            }


            return ancienPanier.map(
              (item) =>

                String(
                  item.produitId
                ) ===
                String(
                  produit.id
                )

                  ? {

                      ...item,

                      quantite:
                        item.quantite + 1,

                      total:
                        (
                          item.quantite + 1
                        ) *
                        item.prix

                    }

                  : item

            );

          }


          /*
          ==============================
          AJOUTER NOUVEL ARTICLE
          ==============================
          */

          return [

            ...ancienPanier,

            {

              produitId:
                produit.id,

              nom:
                produit.name,

              prix:
                Number(
                  produit.price
                ),

              quantite:
                1,

              total:
                Number(
                  produit.price
                )

            }

          ];

        }

      );

    };



  /*
  =========================================
  RETIRER PANIER
  =========================================
  */

  const retirerDuPanier =
    (produitId) => {

      setPanier(
        (ancienPanier) =>

          ancienPanier.filter(

            (item) =>

              String(
                item.produitId
              ) !==
              String(
                produitId
              )

          )

      );

    };



  /*
  =========================================
  MODIFIER QUANTITE PANIER
  =========================================
  */

  const modifierQuantitePanier =
    (
      produitId,
      quantite
    ) => {


      /*
      ==============================
      QUANTITE ZERO
      ==============================
      */

      if (
        quantite <= 0
      ) {

        retirerDuPanier(
          produitId
        );

        return;

      }


      /*
      ==============================
      VERIFIER PRODUIT
      ==============================
      */

      const produit =
        produits.find(

          (p) =>

            String(
              p.id
            ) ===
            String(
              produitId
            )

        );


      /*
      ==============================
      VERIFIER STOCK
      ==============================
      */

      if (

        produit &&

        Number(
          quantite
        ) >

        Number(
          produit.stock
        )

      ) {

        toast.error(

          `Stock insuffisant (Maximum : ${produit.stock})`

        );

        return;

      }


      /*
      ==============================
      MODIFIER PANIER
      ==============================
      */

      setPanier(

        (ancienPanier) =>

          ancienPanier.map(

            (item) =>

              String(
                item.produitId
              ) ===
              String(
                produitId
              )

                ? {

                    ...item,

                    quantite:
                      Number(
                        quantite
                      ),

                    total:

                      Number(
                        quantite
                      )

                      *

                      Number(
                        item.prix
                      )

                  }

                : item

          )

      );

    };



  /*
  =========================================
  VIDER PANIER
  =========================================
  */

  const viderPanier =
    () => {

      setPanier([]);

    };



  /*
  =========================================
  FINALISER VENTE
  =========================================
  */

  const finaliserVente =
    async (
      methodePaiement =
        "especes"
    ) => {


      /*
      ==============================
      VERIFIER PANIER
      ==============================
      */

      if (
        panier.length === 0
      ) {

        toast.error(
          "Le panier est vide"
        );

        return null;

      }


      try {


        /*
        ==============================
        ENVOYER VENTE AU BACKEND
        ==============================
        */

        const response =
          await fetch(

            `${API_URL}/sales.php`,

            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body:

                JSON.stringify({

                  items:
                    panier,

                  paymentMethod:
                    methodePaiement

                })

            }

          );


        /*
        ==============================
        LIRE REPONSE
        ==============================
        */

        const result =
          await response.json();


        console.log(
          "Réponse vente :",
          result
        );


        /*
        ==============================
        VERIFIER ERREUR
        ==============================
        */

        if (
          !result.success
        ) {

          toast.error(

            result.message ||

            "Erreur lors de la vente"

          );

          return null;

        }


        /*
        ==============================
        RECUPERER ID FACTURE
        ==============================
        */

        const factureId =
          result.sale.id;


        /*
        ==============================
        CREER FACTURE FRONTEND
        ==============================
        */

        const nouvelleFacture = {

          id:
            factureId,

          date:
            new Date().toISOString(),

          items:
            [...panier],

          subtotal:
            Number(
              result.sale.subtotal
            ),

          tax:
            Number(
              result.sale.tax
            ),

          total:
            Number(
              result.sale.total
            ),

          paymentMethod:
            result.sale.paymentMethod,

          statut:
            result.sale.status

        };


        /*
        ==============================
        AJOUTER FACTURE LOCAL
        ==============================
        */

        setFactures(

          (anciennesFactures) => [

            nouvelleFacture,

            ...anciennesFactures

          ]

        );


        /*
        ==============================
        VIDER PANIER
        ==============================
        */

        setPanier([]);


        /*
        ==============================
        RECHARGER PRODUITS
        STOCK MIS A JOUR
        ==============================
        */

        await chargerProduits();


        /*
        ==============================
        MESSAGE
        ==============================
        */

        toast.success(

          "Vente terminée avec succès !"

        );


        /*
        ==============================
        RETOURNER ID
        ==============================
        */

        return factureId;


      } catch (
        error
      ) {


        console.error(

          "Erreur finalisation vente :",

          error

        );


        toast.error(

          "Impossible de finaliser la vente"

        );


        return null;

      }

    };



  /*
  =========================================
  PROVIDER
  =========================================
  */

  return (

    <StoreContext.Provider

      value={{

        /*
        -------------------------
        DONNEES
        -------------------------
        */

        produits,

        factures,

        panier,

        estEnLigne,

        chargementProduits,

        chargementFactures,


        /*
        -------------------------
        PRODUITS
        -------------------------
        */

        chargerProduits,

        ajouterProduit,

        modifierProduit,

        supprimerProduit,


        /*
        -------------------------
        PANIER
        -------------------------
        */

        ajouterAuPanier,

        retirerDuPanier,

        modifierQuantitePanier,

        viderPanier,


        /*
        -------------------------
        VENTES
        -------------------------
        */

        chargerFactures,

        finaliserVente

      }}

    >

      {children}

    </StoreContext.Provider>

  );

}



/*
=========================================
CUSTOM HOOK
=========================================
*/

export const useStore =
  () => {


    const contexte =

      useContext(
        StoreContext
      );


    if (
      !contexte
    ) {

      throw new Error(

        "useStore doit être utilisé dans un StoreProvider"

      );

    }


    return contexte;

  };