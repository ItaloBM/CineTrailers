import React, { useState, useEffect } from "react";
import { Film, LogOut, Loader2, User } from "lucide-react";

// Imports de Lógica
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { MovieService } from "./services/api";

// Imports de Componentes/Páginas
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";

// Importação das páginas de suporte
import SupportPages from "./pages/SupportPages";

import AuthForm from "./components/AuthForm";
import TrailerModal from "./components/TrailerModal";
import Footer from "./components/Footer";

export default function App() {
  // --- ESTADOS GLOBAIS ---
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // view pode ser: landing, home, favorites, login, profile, help, terms, privacy, contact
  const [view, setView] = useState("landing");

  const [apiKey, setApiKey] = useState(
    () =>
      import.meta.env.VITE_TMDB_API_KEY ||
      localStorage.getItem("tmdb_key") ||
      ""
  );

  const [favorites, setFavorites] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [authType, setAuthType] = useState("login");
  const [authError, setAuthError] = useState("");

  // --- EFEITOS (Side Effects) ---

  // 1. Monitora se o usuário está logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      // CORREÇÃO AQUI: Removemos o bloqueio da "landing".
      // Agora ele só redireciona para a home se o usuário estiver na tela de LOGIN.
      // Isso permite que usuários logados visitem a Landing Page tranquilamente.
      if (currentUser && view === "login") {
        setView("home");
      }
    });
    return () => unsubscribe();
  }, [view]);

  // 2. Monitora os Favoritos em TEMPO REAL (Snapshot)
  useEffect(() => {
    if (user) {
      const favRef = collection(db, "users", user.uid, "favorites");

      const unsubscribe = onSnapshot(
        favRef,
        (snapshot) => {
          const favs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFavorites(favs);
        },
        (err) => console.error("Erro ao carregar favoritos:", err)
      );
      return () => unsubscribe();
    } else {
      setFavorites([]);
    }
  }, [user]);

  // --- ACTIONS ---

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    const key = e.target.elements.key.value;
    setApiKey(key);
    localStorage.setItem("tmdb_key", key);
  };

  const handlePlayTrailer = async (movieId) => {
    try {
      const data = await MovieService.getVideos(movieId, apiKey);
      const trailer = data.results.find(
        (vid) =>
          vid.site === "YouTube" &&
          (vid.type === "Trailer" || vid.type === "Teaser")
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        alert("Trailer não encontrado para este filme.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar trailer.");
    }
  };

  const toggleFavorite = async (movie) => {
    if (!user) {
      setView("login");
      return;
    }

    const targetId = movie.movieId || movie.id;
    const targetIdString = targetId.toString();

    const isFav = favorites.some(
      (f) =>
        f.movieId === targetId ||
        f.id === targetIdString ||
        f.movieId.toString() === targetIdString
    );

    const docRef = doc(db, "users", user.uid, "favorites", targetIdString);

    try {
      if (isFav) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          movieId: targetId,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          genre_ids: movie.genre_ids || [],
        });
      }
    } catch (err) {
      console.error("Erro ao salvar favorito:", err);
      alert("Erro de conexão ao salvar favorito.");
    }
  };

  const handleAuth = async (email, password, name) => {
    setAuthError("");
    try {
      if (authType === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: name });
        setUser({ ...userCredential.user, displayName: name });
      }
      setView("home");
    } catch (err) {
      console.error(err);
      setAuthError("Falha na autenticação. Verifique suas credenciais.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView("landing");
  };

  // --- RENDER ---

  if (authLoading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" /> Carregando...
      </div>
    );

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-800 text-center">
          <Film className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            CineTrailers
          </h1>
          <p className="text-gray-400 mb-6">
            Insira sua chave TMDB para continuar.
          </p>
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <input
              name="key"
              placeholder="TMDB API Key"
              className="w-full bg-black border border-gray-700 text-white rounded p-3"
              required
            />
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded">
              Acessar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-red-500 selection:text-white flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* CORREÇÃO AQUI: O Logo agora sempre vai para 'landing', mesmo logado */}
          <div
            className="flex items-center gap-2 text-2xl font-bold text-red-600 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setView("landing")}
          >
            <Film /> <span className="hidden sm:inline">CineTrailers</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setView("home")}
              className={`text-sm font-medium transition-colors ${
                view === "home"
                  ? "text-red-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Lançamentos
            </button>

            <button
              onClick={() => (user ? setView("favorites") : setView("login"))}
              className={`text-sm font-medium transition-colors ${
                view === "favorites"
                  ? "text-red-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Meus Filmes
            </button>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-800">
                <button
                  onClick={() => setView("profile")}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    view === "profile"
                      ? "text-red-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <User size={18} />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user.displayName || "Minha Conta"}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setView("login")}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto w-full flex-grow">
        {/* --- TELAS PRINCIPAIS --- */}
        {view === "landing" && <LandingPage onJoin={() => setView("login")} />}

        {view === "login" && (
          <AuthForm
            type={authType}
            onSubmit={handleAuth}
            onToggle={() =>
              setAuthType(authType === "login" ? "register" : "login")
            }
            error={authError}
          />
        )}

        {view === "profile" && user && (
          <Profile
            user={user}
            onViewHome={() => setView("home")}
            onLogout={handleLogout}
          />
        )}

        {view === "favorites" && (
          <Favorites
            favorites={favorites}
            onPlay={handlePlayTrailer}
            onToggleFavorite={toggleFavorite}
            onViewHome={() => setView("home")}
          />
        )}

        {view === "home" && (
          <Home
            apiKey={apiKey}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onPlay={handlePlayTrailer}
          />
        )}

        {/* --- TELAS DE SUPORTE --- */}
        {["help", "terms", "privacy", "contact"].includes(view) && (
          <SupportPages
            defaultTab={view}
            onViewHome={() => setView("home")}
            user={user} // 👈 PASSAMOS O USUÁRIO AQUI
            onLogin={() => setView("login")} // 👈 E A FUNÇÃO DE LOGIN
          />
        )}
      </main>

      <Footer onNavigate={setView} />

      <TrailerModal videoKey={trailerKey} onClose={() => setTrailerKey(null)} />
    </div>
  );
}
