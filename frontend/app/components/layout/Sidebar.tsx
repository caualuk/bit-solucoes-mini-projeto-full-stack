"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiGrid, FiInbox, FiList, FiLogOut, FiPlus, FiSidebar } from "react-icons/fi";

import { usePortal } from "@/app/context/PortalContext";
import { getDashboard } from "@/app/services/dashboard/dashboard";
import { clearToken, getUsername } from "@/app/utils/auth";

// Menu lateral fixo do portal
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openForm, refreshKey } = usePortal();

  // Em telas pequenas o menu começa recolhido (Sidebar só renderiza no navegador)
  const [open, setOpen] = useState(() => window.matchMedia("(min-width: 768px)").matches);

  // No celular o menu aberto fica por cima do conteúdo: fecha ao navegar
  function closeOnMobile() {
    if (!window.matchMedia("(min-width: 768px)").matches) setOpen(false);
  }
  const [total, setTotal] = useState<number | null>(null);

  // Nome do usuário vem do token (Sidebar só renderiza no navegador)
  const username = getUsername();

  // Total exibido ao lado de "Solicitações" (recarrega quando algo muda)
  useEffect(() => {
    getDashboard()
      .then((d) => setTotal(d.totalRequests))
      .catch(() => setTotal(null));
  }, [refreshKey]);

  function handleLogout() {
    clearToken();
    router.push("/");
  }

  // Itens do menu
  const items = [
    { href: "/dashboard", label: "Dashboard", icon: FiGrid, badge: null },
    { href: "/solicitations", label: "Solicitações", icon: FiList, badge: total },
  ];

  return (
    // No celular reserva só a largura do menu recolhido; o menu aberto sobrepõe o conteúdo
    <div className="w-[64px] flex-none md:w-auto">
      {/* Fundo escuro atrás do menu aberto no celular */}
      {open && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`top-0 z-40 flex h-screen md:z-auto flex-none flex-col gap-5 border-r border-[#30303d] bg-[#1b1b29] px-3 py-5 text-white transition-all md:sticky ${
          open ? "fixed left-0 w-[235px]" : "sticky w-[64px]"
        }`}
      >
        {/* Logo + botão de recolher */}
        <div className={`flex items-center gap-3 px-1 ${open ? "" : "flex-col"}`}>
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-violet-400 text-violet-400">
            <FiInbox size={17} />
          </div>
          {open && (
            <span className="flex-1 text-sm font-semibold leading-4">
              Portal de
              <br />
              Solicitações
            </span>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="text-[#A0A0C0] hover:text-white"
            title={open ? "Recolher menu" : "Expandir menu"}
          >
            <FiSidebar size={16} />
          </button>
        </div>
  
        {/* Nova solicitação */}
        <button
          type="button"
          onClick={() => {
            closeOnMobile();
            openForm();
          }}
          title="Nova solicitação"
          className={`flex h-9 items-center gap-2 rounded-lg bg-violet-500 text-sm text-white transition hover:bg-violet-400 ${
            open ? "px-3" : "justify-center"
          }`}
        >
          <FiPlus size={16} />
          {open && "Nova solicitação"}
        </button>
  
        {/* Menu */}
        <nav className="space-y-1">
          {open && <p className="px-2 pb-1 text-[10px] uppercase tracking-wide text-[#77778f]">Menu</p>}
  
          {items.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                onClick={closeOnMobile}
                className={`flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition ${
                  open ? "" : "justify-center"
                } ${active ? "bg-[#302947] text-white" : "text-[#A0A0C0] hover:bg-[#252532] hover:text-white"}`}
              >
                <Icon size={16} className="flex-none" />
                {open && <span className="flex-1">{label}</span>}
                {open && badge !== null && <span className="text-xs text-[#A0A0C0]">{badge}</span>}
              </Link>
            );
          })}
        </nav>
  
        {/* Usuário logado + sair */}
        <div
          className={`mt-auto flex items-center gap-2 border-t border-[#30303d] pt-4 ${
            open ? "" : "flex-col"
          }`}
        >
          <div
            title={username}
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#4b3b78] text-xs uppercase"
          >
            {username.slice(0, 2)}
          </div>
  
          {open && <p className="flex-1 truncate text-xs font-medium">{username}</p>}
  
          <button
            type="button"
            onClick={handleLogout}
            title="Sair"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-[#3b3b4a] text-[#A0A0C0] transition hover:border-violet-400 hover:text-violet-400"
          >
            <FiLogOut size={15} />
          </button>
        </div>
      </aside>
    </div>
  );
}
