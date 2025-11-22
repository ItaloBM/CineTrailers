import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase"; 

export default function AuthForm({ type, onSubmit, onToggle, error: propError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  const [loading, setLoading] = useState(false);
  
  // Novo estado para controlar notificações internas (Sucesso ou Aviso)
  const [notification, setNotification] = useState({ type: null, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: null, message: "" }); // Limpa notificações antigas
    setLoading(true);
    await onSubmit(email, password, name);
    setLoading(false);
  };

  // Função melhorada para resetar senha
  const handleResetPassword = async () => {
    setNotification({ type: null, message: "" });

    // Validação: Usuário precisa digitar o e-mail antes
    if (!email) {
      setNotification({
        type: "warning",
        message: "Por favor, digite seu e-mail no campo abaixo para recuperar a senha."
      });
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setNotification({
        type: "success",
        message: `Enviamos um link de recuperação para ${email}. Verifique sua caixa de entrada (e spam).`
      });
    } catch (err) {
      console.error(err);
      let errorMsg = "Erro ao enviar e-mail. Verifique se o endereço está correto.";
      if (err.code === 'auth/user-not-found') errorMsg = "E-mail não cadastrado.";
      
      setNotification({
        type: "error",
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-xl animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {type === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h2>
          <p className="text-gray-400">
            {type === "login"
              ? "Entre para acessar sua lista"
              : "Comece sua jornada cinematográfica"}
          </p>
        </div>

        {/* --- ÁREA DE NOTIFICAÇÕES (Erro de Login vindo das props) --- */}
        {propError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3 animate-slide-down">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{propError}</span>
          </div>
        )}

        {/* --- ÁREA DE NOTIFICAÇÕES (Recuperação de Senha) --- */}
        {notification.message && (
          <div className={`
            p-4 rounded-xl mb-6 flex items-start gap-3 border animate-slide-down relative
            ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : ''}
            ${notification.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : ''}
            ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
          `}>
            {notification.type === 'success' && <CheckCircle size={20} className="shrink-0 mt-0.5" />}
            {notification.type === 'warning' && <AlertCircle size={20} className="shrink-0 mt-0.5" />}
            {notification.type === 'error' && <AlertCircle size={20} className="shrink-0 mt-0.5" />}
            
            <span className="text-sm font-medium pr-4">{notification.message}</span>
            
            <button 
              onClick={() => setNotification({ type: null, message: "" })}
              className="absolute top-3 right-3 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nome (Só aparece no Registro) */}
          {type === "register" && (
            <div className="relative group">
              <User className="absolute left-3 top-3 text-gray-500 w-5 h-5 group-focus-within:text-red-500 transition-colors" />
              <input
                type="text"
                placeholder="Seu Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 text-white rounded-xl py-3 pl-10 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5 group-focus-within:text-red-500 transition-colors" />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-black/50 border text-white rounded-xl py-3 pl-10 focus:ring-2 outline-none transition-all
                ${notification.type === 'warning' ? 'border-orange-500 focus:ring-orange-500' : 'border-gray-700 focus:ring-red-600'}
              `}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5 group-focus-within:text-red-500 transition-colors" />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 text-white rounded-xl py-3 pl-10 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Link de Esqueci a Senha */}
          {type === "login" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 hover:shadow-lg hover:shadow-red-600/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {type === "login" ? "Entrar" : "Criar Conta"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          {type === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}
          <button
            onClick={() => {
              setNotification({ type: null, message: "" }); // Limpa erros ao trocar de tela
              onToggle();
            }}
            className="ml-2 text-white font-bold hover:text-red-500 transition-colors"
          >
            {type === "login" ? "Cadastre-se agora" : "Fazer Login"}
          </button>
        </div>
      </div>
    </div>
  );
}