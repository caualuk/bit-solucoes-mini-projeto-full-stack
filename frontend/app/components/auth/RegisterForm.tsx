"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FiEye, FiEyeOff, FiInbox } from "react-icons/fi";

import { login } from "@/app/services/auth/login";
import { register } from "@/app/services/auth/register";
import { saveToken } from "@/app/utils/auth";

// Classe padrão dos campos
const inputClass =
  "h-9 w-full rounded-lg border border-[#414151] bg-[#252532] px-3 pr-12 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-violet-400";

// Tela de cadastro
export default function RegisterForm() {
  const router = useRouter();

  // Campos e estados da tela
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Valida, cria a conta e já faz o login
  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    // Validação do usuário
    if (!username.trim()) {
      setError("Informe o nome de usuário.");
      return;
    }

    // Validação do tamanho da senha
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      await register({ username: username.trim(), password });

      // Login automático após o cadastro
      const response = await login({ username: username.trim(), password });
      saveToken(response.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#161624] px-6">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-[30px] items-center justify-center rounded-lg border border-violet-400 p-5 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
            <FiInbox size={17} />
          </div>

          <span className="font-semibold text-white">
            Portal de Solicitações
          </span>
        </div>

        <h1 className="text-[28px] font-medium tracking-tight text-white">
          Criar Conta
        </h1>

        <p className="text-[14px] text-[#A0A0C0]">
          Preencha os campos abaixo para criar sua conta.
        </p>

        {/* Mensagem de erro */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-500/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form className="mt-7 space-y-4" onSubmit={handleRegister}>
          {/* Usuário */}
          <div>
            <label htmlFor="username" className="mb-2 block text-xs text-gray-300">
              Nome de usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex.: user.name"
              className={inputClass}
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="mb-2 block text-xs text-gray-300">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 cursor-pointer text-violet-400"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirmação de senha */}
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-xs text-gray-300">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 cursor-pointer text-violet-400"
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-lg border border-violet-400 text-sm font-medium text-violet-400 transition hover:bg-violet-400 hover:text-white disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#A0A0C0]">
          Já possui uma conta?{" "}
          <Link href="/" className="text-violet-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
