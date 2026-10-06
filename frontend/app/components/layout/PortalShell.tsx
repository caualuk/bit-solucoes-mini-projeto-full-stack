"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import Sidebar from "@/app/components/layout/Sidebar";
import { PortalProvider } from "@/app/context/PortalContext";
import { useIsClient } from "@/app/hooks/useIsClient";
import { getToken } from "@/app/utils/auth";

// Estrutura das telas logadas -> protege a rota e monta menu + conteúdo
export default function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isClient = useIsClient();
  const hasToken = isClient && !!getToken();

  // Sem token, volta para o login
  useEffect(() => {
    if (isClient && !hasToken) router.replace("/");
  }, [isClient, hasToken, router]);

  // Evita mostrar a tela antes de validar o token
  if (!hasToken) return null;

  return (
    <PortalProvider>
      <div className="flex min-h-screen bg-[#161624] text-white">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-10">
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>
    </PortalProvider>
  );
}
