import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  FileText,
  Shield,
  HelpCircle,
  Send,
  ChevronRight,
  Loader2,
  CheckCircle,
  Lock
} from "lucide-react";

import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- SUB-COMPONENTES ---

const PageLayout = ({ 
  title, 
  icon: Icon, 
  children, 
  onBack,
  // Definimos o vermelho como padrão caso não seja informada outra cor
  iconColor = "text-red-500", 
  iconBg = "bg-red-600/20" 
}) => (
  <div className="max-w-4xl mx-auto p-6 animate-fade-in min-h-[70vh]">
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
    >
      <ArrowLeft size={20} /> Voltar para Suporte
    </button>

    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
        
        {/* AQUI ESTÁ A MUDANÇA: Usamos as variáveis iconBg e iconColor */}
        <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
          <Icon size={32} />
        </div>
        
        <h1 className="text-3xl font-bold text-white">{title}</h1>
      </div>
      <div className="text-gray-300 space-y-4 leading-relaxed">{children}</div>
    </div>
  </div>
);

const HelpCenter = ({ onBack }) => (
  <PageLayout 
    title="Central de Ajuda" 
    icon={HelpCircle} 
    onBack={onBack}
    // Passando as cores azuis aqui:
    iconColor="text-blue-500"
    iconBg="bg-blue-500/20"
  >
    <h3 className="text-xl font-bold text-white mt-4">
      Como assistir aos trailers?
    </h3>
    <p>
      Basta clicar no botão "Assistir" em qualquer cartão de filme. O trailer
      abrirá em uma janela modal.
    </p>
    <h3 className="text-xl font-bold text-white mt-4">
      Como salvar favoritos?
    </h3>
    <p>
      Você precisa estar logado. Clique no ícone de coração nos filmes para
      salvar na sua lista pessoal.
    </p>
  </PageLayout>
);

const Terms = ({ onBack }) => (
  <PageLayout 
    title="Termos de Uso" 
    icon={FileText} 
    onBack={onBack}
    // Adicionando as cores roxas aqui:
    iconColor="text-purple-500"
    iconBg="bg-purple-500/20"
  >
    <p>Última atualização: 2025</p>
    <p>Ao acessar o CineTrailers, você concorda com estes termos.</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>Conteúdo propriedade do TMDB.</li>
      <li>Proibido uso comercial.</li>
    </ul>
  </PageLayout>
);

const Privacy = ({ onBack }) => (
  <PageLayout title="Política de Privacidade" icon={Shield} onBack={onBack} iconColor="text-yellow-500"
    iconBg="bg-yellow-500/20">
    <p>Sua privacidade é importante. Não compartilhamos seus dados.</p>
  </PageLayout>
);

// --- FORMULÁRIO DE CONTATO (Tema Verde) ---
const Contact = ({ onBack, user, onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: 'Suporte Técnico',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; 

    setLoading(true);

    try {
      await addDoc(collection(db, "messages"), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Usuário',
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSuccess(true);
      setFormData({ subject: 'Suporte Técnico', message: '' });
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // 1. TELA DE BLOQUEIO (Se não estiver logado)
  if (!user) {
    return (
      <PageLayout 
        title="Fale Conosco" 
        icon={Mail} 
        onBack={onBack}
        // Configurando cor VERDE no cabeçalho
        iconColor="text-green-500"
        iconBg="bg-green-500/20"
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-800 p-4 rounded-full mb-4">
            <Lock size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
          <p className="text-gray-400 max-w-md mb-8">
            Para garantir a segurança e responderemos corretamente, você precisa estar logado em sua conta para enviar mensagens.
          </p>
          <button 
            onClick={onLogin}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
          >
            Fazer Login
          </button>
        </div>
      </PageLayout>
    );
  }

  // 2. TELA DE FORMULÁRIO (Logado)
  return (
    <PageLayout 
      title="Fale Conosco" 
      icon={Mail} 
      onBack={onBack}
      // Configurando cor VERDE no cabeçalho aqui também
      iconColor="text-green-500"
      iconBg="bg-green-500/20"
    >
      {success ? (
        // MENSAGEM DE SUCESSO
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Mensagem Enviada!</h3>
          <p className="text-gray-400 mb-6">Responderemos em breve no e-mail <strong>{user.email}</strong>.</p>
          <button onClick={() => setSuccess(false)} className="text-green-400 underline hover:text-green-300">
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        // O FORMULÁRIO
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Assunto</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
            >
              <option>Suporte Técnico</option>
              <option>Sugestão de Filme</option>
              <option>Reportar Erro</option>
              <option>Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">Sua Mensagem</label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={5}
              placeholder="Descreva detalhadamente como podemos ajudar..."
              className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white p-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Enviando...</span>
            ) : (
              <>
                <Send size={20} /> Enviar Mensagem
              </>
            )}
          </button>
        </form>
      )}
    </PageLayout>
  );
};

// --- COMPONENTE PRINCIPAL (Export Default) ---

export default function SupportPages({ defaultTab = null, onViewHome, user, onLogin }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (activeTab === "help") return <HelpCenter onBack={() => setActiveTab(null)} />;
  if (activeTab === "terms") return <Terms onBack={() => setActiveTab(null)} />;
  if (activeTab === "privacy") return <Privacy onBack={() => setActiveTab(null)} />;
  
  // Agora passamos user e onLogin para o Contact
  if (activeTab === "contact") return <Contact onBack={() => setActiveTab(null)} user={user} onLogin={onLogin} />;

  // Menu Principal (Hub)
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in min-h-screen">
      <button 
        onClick={onViewHome}
        className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Voltar para Início
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Como podemos ajudar?
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Selecione uma opção abaixo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MenuButton 
          icon={HelpCircle} color="blue" title="Central de Ajuda" 
          onClick={() => setActiveTab("help")} 
        />
        <MenuButton 
          icon={Mail} color="green" title="Fale Conosco" 
          desc="Envie uma mensagem para nossa equipe."
          onClick={() => setActiveTab("contact")} 
        />
        <MenuButton 
          icon={FileText} color="purple" title="Termos de Uso" 
          onClick={() => setActiveTab("terms")} 
        />
        <MenuButton 
          icon={Shield} color="yellow" title="Privacidade" 
          onClick={() => setActiveTab("privacy")} 
        />
      </div>
    </div>
  );
}

const MenuButton = ({ icon: Icon, color, title, desc, onClick }) => {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
    purple: "bg-purple-500/10 text-purple-500",
    yellow: "bg-yellow-500/10 text-yellow-500",
  };

  return (
    <button
      onClick={onClick}
      className="bg-gray-900 hover:bg-gray-800 border border-gray-800 p-6 rounded-2xl text-left transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg mb-4 ${colorClasses[color]}`}>
          <Icon size={28} />
        </div>
        <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {desc && <p className="text-gray-400 text-sm">{desc}</p>}
    </button>
  );
};