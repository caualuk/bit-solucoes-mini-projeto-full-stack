"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FiEye, FiEyeOff, FiInbox } from "react-icons/fi";

import { login } from "@/app/services/auth/login";
import { saveToken } from "@/app/utils/auth";

// Tela de login
export default function LoginForm() {
  const router = useRouter();

  // Campos e estados da tela
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Envia as credenciais, salva o token e vai para o dashboard
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await login({ username, password });

      saveToken(response.token);
      router.push("/dashboard");
    } catch {
      setError(
        "Não foi possível realizar o login. Verifique suas credenciais e tente novamente.",
      );
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
          Entrar
        </h1>

        <p className="text-[14px] text-[#A0A0C0]">
          Digite suas credenciais para acessar o portal de solicitações.
        </p>

        {/* Formulário */}
        <form className="mt-7 space-y-4" onSubmit={handleLogin}>
          {/* Usuário */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-xs text-gray-300"
            >
              Nome de usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex.: user.name"
              className="h-9 w-full rounded-lg border border-[#414151] bg-[#252532] px-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-violet-400"
            />
          </div>

          {/* Senha com botão de mostrar/ocultar */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs text-gray-300"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#414151] bg-[#252532] px-3 pr-12 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-violet-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 text-violet-400 cursor-pointer"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="h-10 w-full rounded-lg border border-violet-400 text-sm font-medium text-violet-400 transition hover:bg-violet-400 hover:text-white disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Mensagem de erro */}
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <p className="mt-5 text-center text-sm text-[#A0A0C0]">
          Não possui uma conta?{" "}
          <Link href="/register" className="text-violet-400 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
