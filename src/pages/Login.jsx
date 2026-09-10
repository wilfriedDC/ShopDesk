import {
  useState
} from 'react';

import {
  useNavigate
} from 'react-router-dom';

import {

  Mail,
  Lock,
  LogIn

} from 'lucide-react';

import {
  useAuth
} from '../context/useAuth';


export default function Login() {

  const navigate =
    useNavigate();


  const {

    login

  } = useAuth();


  const [

    email,

    setEmail

  ] = useState('');


  const [

    password,

    setPassword

  ] = useState('');


  const [

    loading,

    setLoading

  ] = useState(false);


  const handleSubmit =
    async (event) => {

      event.preventDefault();


      if (!navigator.onLine) {

        alert(
          'Une connexion Internet est nécessaire pour se connecter.'
        );

        return;

      }


      if (!email || !password) {

        alert(
          'Veuillez remplir tous les champs.'
        );

        return;

      }


      try {

        setLoading(true);


        /*
          PLUS TARD :

          ici nous allons appeler :

          login.php

          avec :

          email
          password

        */


        // TEMPORAIRE

        const userData = {

          id: 1,

          name: 'Utilisateur ShopDesk',

          email

        };


        login(
          userData
        );


        navigate(
          '/'
        );

      }

      catch (error) {

        console.error(
          error
        );

        alert(
          'Erreur de connexion.'
        );

      }

      finally {

        setLoading(false);

      }

    };


  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-100
        p-6
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-xl
          p-8
          border
          border-slate-200
        "
      >


        {/* TITLE */}

        <div
          className="
            text-center
            mb-8
          "
        >

          <h1
            className="
              text-3xl
              font-bold
              text-slate-800
            "
          >

            ShopDesk

          </h1>


          <p
            className="
              text-slate-500
              mt-2
            "
          >

            Connectez-vous à votre compte

          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="
            space-y-5
          "
        >


          {/* EMAIL */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              "
            >

              Email

            </label>


            <div
              className="
                flex
                items-center
                border
                border-slate-200
                rounded-xl
                px-3
                focus-within:ring-2
                focus-within:ring-blue-500
              "
            >

              <Mail
                className="
                  w-5
                  h-5
                  text-slate-400
                "
              />


              <input

                type="email"

                value={email}

                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }

                placeholder="exemple@email.com"

                className="
                  w-full
                  p-3
                  outline-none
                "

              />

            </div>

          </div>


          {/* PASSWORD */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                mb-2
              "
            >

              Mot de passe

            </label>


            <div
              className="
                flex
                items-center
                border
                border-slate-200
                rounded-xl
                px-3
                focus-within:ring-2
                focus-within:ring-blue-500
              "
            >

              <Lock
                className="
                  w-5
                  h-5
                  text-slate-400
                "
              />


              <input

                type="password"

                value={password}

                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }

                placeholder="••••••••"

                className="
                  w-full
                  p-3
                  outline-none
                "

              />

            </div>

          </div>


          {/* BUTTON */}

          <button

            type="submit"

            disabled={loading}

            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-xl
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              transition-colors
              disabled:opacity-50
            "

          >

            <LogIn
              className="
                w-5
                h-5
              "
            />


            {

              loading

                ?

                'Connexion...'

                :

                'Se connecter'

            }

          </button>


        </form>


      </div>

    </div>

  );

}