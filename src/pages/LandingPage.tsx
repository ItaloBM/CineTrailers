import React from 'react';
import { Film, PlayCircle, Star, MonitorPlay, ChevronRight, Clapperboard, Tv, Globe } from 'lucide-react';

interface LandingPageProps {
  onJoin: () => void;
}

export default function LandingPage({ onJoin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-600 selection:text-white overflow-x-hidden font-sans">
      
      {/* Estilos de Animação Customizados (apenas CSS simples) */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

      {/* --- HERO SECTION --- */}
      <div className="relative min-h-screen flex items-center justify-center">
        
        {/* Background Image com Overlay Cinemático */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 scale-105"></div>
          {/* Gradiente Radial para focar no centro */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
        </div>

        {/* Elementos Decorativos de Luz (Glow) */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          
          {/* Badge Superior */}
          <div className="flex justify-center mb-8 opacity-0 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm font-medium text-red-200 tracking-wide uppercase">A Nova Era do Streaming</span>
            </div>
          </div>
          
          {/* Título Principal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 opacity-0 animate-fade-in delay-100">
            O Cinema na <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-orange-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              Sua Tela
            </span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in delay-200">
            Transforme a maneira como você escolhe o que assistir. Explore prévias em alta definição, encontre aquelas joias escondidas e organize tudo em uma plataforma intuitiva e imersiva.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-in delay-300">
            <button 
              onClick={onJoin}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-red-600 rounded-full hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] focus:outline-none ring-offset-2 focus:ring-2 ring-red-500 ring-offset-[#0a0a0a]"
            >
              <PlayCircle className="mr-2 w-5 h-5 fill-current" />
              Começar Agora
            </button>
            
            <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-300 transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white backdrop-blur-sm">
              Saiba Mais
            </button>
          </div>
        </div>

        {/* Scroll Indicator (Opcional) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="relative py-32 bg-[#0a0a0a]">
        {/* Divisor de Gradiente Suave */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher o <span className="text-red-500">CineTrailers?</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Tecnologia de ponta e design pensado para quem ama a sétima arte.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <FeatureCard 
              icon={<Clapperboard className="w-8 h-8 text-white" />}
              title="Radar de Lançamentos"
              description="Fique à frente do hype. Assista aos trailers e teasers das próximas grandes estreias antes de todo mundo."
              color="from-red-500 to-orange-600"
            />

            {/* Card 2 */}
            <FeatureCard 
              icon={<Star className="w-8 h-8 text-white" />}
              title="Lista de Desejos"
              description="Nunca mais esqueça uma estreia. Favorite os trailers que te empolgaram e crie sua coleção pessoal de filmes aguardados."
              color="from-purple-500 to-pink-600"
              delay="delay-100"
            />

            {/* Card 3 */}
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-white" />}
              title="Ecossistema Unificado"
              description="Compatibilidade total. Seus dados e preferências são atualizados em tempo real na nuvem, independente da plataforma."
              color="from-blue-500 to-cyan-600"
              delay="delay-200"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}

// Componente auxiliar para os Cards (Deixa o código principal mais limpo)
function FeatureCard({ icon, title, description, color, delay = "" }: { icon: React.ReactNode, title: string, description: string, color: string, delay?: string }) {
  return (
    <div className={`group relative p-8 rounded-3xl bg-gray-900/40 border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:bg-gray-800/60 ${delay}`}>
      
      {/* Glow Effect no Hover */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Icon Box */}
      <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
        {description}
      </p>

      {/* <div className="mt-6 flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors cursor-pointer">
        Saiba mais <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div> */}
    </div>
  );
}