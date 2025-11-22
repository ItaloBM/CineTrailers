import React, { useState } from "react";
import {
  User,
  Mail,
  Save,
  LogOut,
  Key,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function Profile({ user, onViewHome, onLogout }) {
  // Estados para atualização de perfil (Nome)
  const [name, setName] = useState(user?.displayName || "");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  // Estados para redefinição de senha
  const [resetStatus, setResetStatus] = useState("idle"); // idle | loading | success | error
  const [resetMessage, setResetMessage] = useState("");

  // --- ATUALIZAR NOME ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMessage({ type: "", text: "" });

    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      setProfileMessage({
        type: "success",
        text: "Nome atualizado com sucesso!",
      });
    } catch (error) {
      console.error(error);
      setProfileMessage({
        type: "error",
        text: "Erro ao atualizar. Tente novamente.",
      });
    }
    setLoadingProfile(false);
  };

  // --- REDEFINIR SENHA (Ajustado) ---
  const handlePasswordReset = async () => {
    // Limpa estados anteriores
    setResetStatus("loading");
    setResetMessage("");

    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetStatus("success");
      setResetMessage(
        `Um link de redefinição foi enviado para ${user.email}. Verifique sua caixa de entrada e spam.`
      );
    } catch (error) {
      console.error("Erro reset senha:", error);
      setResetStatus("error");

      // Tratamento de erros comuns do Firebase
      if (error.code === "auth/too-many-requests") {
        setResetMessage(
          "Muitas tentativas recentes. Aguarde alguns instantes antes de tentar novamente."
        );
      } else {
        setResetMessage(
          "Não foi possível enviar o e-mail. Tente novamente mais tarde."
        );
      }
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto mt-4 p-4 md:p-8">
      {/* Header com Botão Voltar */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onViewHome}
          className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Voltar para Home"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
          <p className="text-gray-400">Gerencie seus dados e segurança</p>
        </div>
      </div>

      <div className="grid gap-8">
        {/* CARTÃO 1: DADOS PESSOAIS */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-red-600/20">
              {name ? name[0].toUpperCase() : <User />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Informações da Conta
              </h2>
              <p className="text-sm text-gray-500">Visível para você</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">
                Nome de Exibição
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 text-white rounded-xl py-3 pl-10 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">
                E-mail Cadastrado
              </label>
              <div className="relative opacity-60 cursor-not-allowed">
                <Mail className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full bg-black/40 border border-gray-700 text-gray-400 rounded-xl py-3 pl-10 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                O e-mail não pode ser alterado.
              </p>
            </div>

            {profileMessage.text && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                  profileMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {profileMessage.type === "success" ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {profileMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loadingProfile}
              className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingProfile ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} /> Salvar Alterações
                </>
              )}
            </button>
          </form>
        </div>

        {/* CARTÃO 2: SEGURANÇA (ALTERAR SENHA) */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Key className="text-red-500 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Segurança</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Para sua segurança, nós não armazenamos sua senha diretamente.
              Para alterá-la, enviaremos um e-mail seguro de redefinição.
            </p>

            {/* Feedback Visual da Redefinição */}
            {resetStatus !== "idle" && (
              <div
                className={`p-4 rounded-xl text-sm animate-fade-in flex items-start gap-3 ${
                  resetStatus === "success"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : resetStatus === "error"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {resetStatus === "loading" && (
                  <Loader2 className="animate-spin shrink-0" size={18} />
                )}
                {resetStatus === "success" && (
                  <CheckCircle className="shrink-0" size={18} />
                )}
                {resetStatus === "error" && (
                  <AlertCircle className="shrink-0" size={18} />
                )}
                <span>{resetMessage || "Processando solicitação..."}</span>
              </div>
            )}

            <button
              onClick={handlePasswordReset}
              disabled={resetStatus === "loading" || resetStatus === "success"}
              className={`w-full border border-gray-700 hover:border-gray-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                resetStatus === "success" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {resetStatus === "success"
                ? "E-mail Enviado"
                : "Enviar E-mail de Redefinição"}
            </button>
          </div>
        </div>

        {/* ZONA DE PERIGO / LOGOUT */}
        <div className="pt-6 border-t border-gray-800">
          <button
            onClick={onLogout}
            className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-medium"
          >
            <LogOut size={20} /> Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
