import React from "react";
import { Film, Github, Twitter, Instagram, Mail, Heart } from "lucide-react";

export default function Footer({ onNavigate }) {
  // Função auxiliar para criar links clicáveis
  const FooterLink = ({ label, view }) => (
    <li>
      <button
        onClick={() => onNavigate(view)}
        className="hover:text-red-500 transition-colors text-left"
      >
        {label}
      </button>
    </li>
  );

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Coluna 1: Marca e Sobre */}
          <div className="space-y-4">
            <div
              className="flex items-center gap-2 text-xl font-bold text-white cursor-pointer"
              onClick={() => setView("landing")}
            >
              <Film className="text-red-600" />
              <span className="text-red-600">
                CineTrailers
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
             Sua plataforma definitiva para as próximas grandes estreias. Acompanhe o hype, assista aos trailers mais aguardados e organize sua Watchlist em um só lugar.
            </p>
          </div>

          {/* Coluna 2: Navegação Funcional */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Navegação</h3>
            <ul className="space-y-3 text-gray-400 flex flex-col items-start">
              <FooterLink label="Início" view="landing" />
              <FooterLink label="Lançamentos" view="home" />
              <FooterLink label="Mais Votados" view="home" />
              <FooterLink label="Minha Lista" view="favorites" />
            </ul>
          </div>

          {/* Coluna 3: Suporte Funcional */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Suporte</h3>
            <ul className="space-y-3 text-gray-400 flex flex-col items-start">
              <FooterLink label="Central de Ajuda" view="help" />
              <FooterLink label="Termos de Uso" view="terms" />
              <FooterLink label="Política de Privacidade" view="privacy" />
              <FooterLink label="Contato" view="contact" />
            </ul>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-800/50 my-8"></div>

        {/* Parte Inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500">
            © {new Date().getFullYear()} CineTrailers. Todos os direitos
            reservados.
          </p>

          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span>Dados fornecidos por</span>
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB"
              className="h-3"
            />
          </div>

          {/* <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white hover:scale-110 transition-all"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 hover:scale-110 transition-all"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-pink-500 hover:scale-110 transition-all"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
            >
              <Mail size={20} />
            </a>
          </div> */}
        </div>

        <div className="text-center mt-8 text-gray-600 text-xs flex items-center justify-center gap-1">
          Feito com <Heart size={12} className="text-red-600 fill-current" />{" "}
          para amantes de cinema.
        </div>
      </div>
    </footer>
  );
}
